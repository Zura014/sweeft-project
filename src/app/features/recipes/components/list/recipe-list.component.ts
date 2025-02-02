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
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  EMPTY,
  map,
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

@Component({
  selector: 'app-recipe-list',
  imports: [
    NgIf,
    AsyncPipe,
    MatFormFieldModule,
    MatInputModule,
    MatButtonToggleModule,
    RecipeCardComponent,
    ReactiveFormsModule,
    LoadingComponent,
  ],
  templateUrl: './recipe-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush, // Using OnPush strategy for better performance
})
export class RecipeListComponent implements OnInit, OnDestroy {
  // Injecting the RecipeService for data fetching
  private readonly recipeService = inject(RecipeService);

  // Subject for managing component destruction lifecycle
  private readonly destroy$ = new Subject<void>();

  // BehaviorSubject to handle filter state changes
  private readonly filterSubject = new BehaviorSubject<RecipeFilterType>('all');

  // Signals for reactive state management
  protected readonly recipeFilter = signal<RecipeFilterType>('all');
  protected readonly isLoading = signal(true);
  protected readonly searchControl = new FormControl('');

  // Observable for the list of recipes
  protected recipes$?: Observable<RecipeI[]>;

  ngOnInit(): void {
    this.initializeRecipeStream();
  }

  private initializeRecipeStream(): void {
    // Setting up observables for search and filter
    const search$ = this.searchControl.valueChanges.pipe(
      startWith(''), // Start with an empty query to fetch all recipes initially
      debounceTime(300), // Wait for 300ms before processing the latest value
      distinctUntilChanged() // Only emit if the search term has changed
    );

    const filter$ = this.filterSubject.asObservable();

    this.recipes$ = combineLatest([search$, filter$]).pipe(
      takeUntil(this.destroy$), // Unsubscribe when component is destroyed
      tap(() => this.isLoading.set(true)), // Set loading state to true before fetching
      switchMap(([query, filter]) => this.fetchAndFilterRecipes(query, filter)),
      catchError(() => {
        this.isLoading.set(false); // If there's an error, stop loading indicator
        return EMPTY; // Return an empty observable to avoid errors in the subscription
      }),
      tap(() => this.isLoading.set(false)) // Set loading to false after data is processed or error occurred
    );
  }

  private fetchAndFilterRecipes(
    query: string | null,
    filter: RecipeFilterType
  ): Observable<RecipeI[]> {
    return this.recipeService
      .getAllRecipes() // Fetch all recipes from the service
      .pipe(map((recipes) => this.applyFilters(recipes, query, filter))); // Apply filters
  }

  private applyFilters(
    recipes: RecipeI[],
    query: string | null,
    filterType: RecipeFilterType
  ): RecipeI[] {
    let filteredRecipes = recipes;

    // Filter by search query if provided
    if (query?.trim()) {
      const normalizedQuery = query.toLowerCase();
      filteredRecipes = recipes.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(normalizedQuery) ||
          recipe.description.toLowerCase().includes(normalizedQuery)
      );
    }

    // Filter by favorite status
    if (filterType !== 'all') {
      const isFavorite = filterType === 'favorited';
      filteredRecipes = filteredRecipes.filter(
        (recipe) => recipe.isFavorite === isFavorite
      );
    }

    return filteredRecipes;
  }

  protected handleFilterChange(event: MatButtonToggleChange): void {
    // Update both the signal and the subject on filter change
    this.recipeFilter.set(event.value);
    this.filterSubject.next(event.value);
  }

  ngOnDestroy(): void {
    // Cleanup subscriptions to prevent memory leaks
    this.destroy$.next();
    this.destroy$.complete();
    this.filterSubject.complete();
  }
}
