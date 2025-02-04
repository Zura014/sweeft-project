import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { RecipeService } from '../../services/recipe.service';
import { RecipeI } from '../../interfaces/recipe.interface';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { RecipeCardComponent } from '../card/recipe-card.component';
import { AsyncPipe, NgIf } from '@angular/common';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  EMPTY,
  Observable,
  startWith,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import {
  MatButtonToggleChange,
  MatButtonToggleModule,
} from '@angular/material/button-toggle';
import { RecipeFilterType } from '../../types/recipe-filter.type';
import { MatProgressBar } from '@angular/material/progress-bar';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush, // Using OnPush strategy for better performance
  imports: [
    NgIf,
    AsyncPipe,
    MatFormFieldModule,
    MatInputModule,
    MatButtonToggleModule,
    RecipeCardComponent,
    ReactiveFormsModule,
    LoadingComponent,
    MatProgressBar,
  ],
})
export class RecipeListComponent implements OnInit, OnDestroy {
  // Injecting the RecipeService for data fetching
  private readonly recipeService = inject(RecipeService);

  // Subject for managing component destruction lifecycle
  private readonly destroy$ = new Subject<void>();

  // BehaviorSubject to handle filter state changes
  protected readonly filterSubject = new BehaviorSubject<RecipeFilterType>(
    'all'
  );

  // Signals for reactive state management
  protected readonly isLoading = signal(true);
  protected readonly searchControl = new FormControl<string>('');

  // Observable for the list of recipes
  protected recipes$?: Observable<RecipeI[]>;

  ngOnInit(): void {
    this.configureRecipeStream();
  }

  /**
   * Initializes the reactive stream for recipes, combining search and filter observables.
   * This method sets up the pipeline to fetch and filter recipes based on user interactions.
   */
  private configureRecipeStream(): void {
    // Setting up observables for search and filter
    const search$ = this.searchControl.valueChanges.pipe(
      startWith(''), // Start with an empty query to fetch all recipes initially
      debounceTime(300), // Wait for 300ms before processing the latest value
      distinctUntilChanged(), // Only emit if the search term has changed
      tap(() => this.isLoading.set(true))
    );

    const filter$ = this.filterSubject
      .asObservable()
      .pipe(tap(() => this.isLoading.set(true)));

    this.isLoading.set(true);

    this.recipes$ = combineLatest([search$, filter$]).pipe(
      takeUntil(this.destroy$), // Unsubscribe when component is destroyed
      switchMap(([query, filter]) =>
        this.recipeService.getAllRecipes(query ?? undefined, filter).pipe(
          catchError(() => {
            this.isLoading.set(false);
            return EMPTY;
          }),
          tap(() => {
            this.isLoading.set(false);
          }) // handling loading state.
        )
      )
    );
  }

  /**
   * Handles changes in the filter toggle buttons, updating both the signal and the subject.
   * @param event - The change event from MatButtonToggle.
   */
  protected handleFilterChange(event: MatButtonToggleChange): void {
    this.filterSubject.next(event.value);
  }

  ngOnDestroy(): void {
    // Cleanup subscriptions to prevent memory leaks
    this.destroy$.next();
    this.destroy$.complete();
    this.filterSubject.complete();
  }
}
