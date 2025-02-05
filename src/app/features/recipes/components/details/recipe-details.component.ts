import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { RecipeI } from '../../interfaces/recipe.interface';
import {
  catchError,
  EMPTY,
  filter,
  map,
  Observable,
  Subject,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RecipeForm } from '../../types/recipe-form.type';
import { RecipeFormComponent } from '../form/recipe-form.component';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { MatButton } from '@angular/material/button';
import { CdkAccordion, CdkAccordionItem } from '@angular/cdk/accordion';

/**
 * Component for displaying and managing recipe details.
 * Handles viewing, editing, deleting, and favoriting recipes.
 * Uses OnPush change detection for better performance.
 */

@Component({
  selector: 'app-recipe-details',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButton,
    RecipeFormComponent,
    LoadingComponent,
    CdkAccordion,
    CdkAccordionItem,
  ],
  templateUrl: './recipe-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipeDetailsComponent implements OnInit, OnDestroy {
  // DI using the inject function
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly recipeService = inject(RecipeService);

  currentRecipe$!: Observable<RecipeI>; // Observable for handling current recipe

  expandedIndex = 0; // Index for the expanded accordion section

  // Default form values for recipe editing
  initialValues: RecipeForm = {
    title: '',
    description: '',
    ingredients: [],
    instructions: '',
    imageUrl: '',
    isFavorite: false,
  };

  // Signals for managing component state
  isEditing = signal(false);
  isLoading = signal(false);

  // Subject for handling component cleanup
  private destroy$ = new Subject<void>();

  /**
   * Initializes the recipe data on component creation
   */
  ngOnInit(): void {
    this.initRecipe();
  }

  /**
   * Cleanup on component destruction
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Fetches and initializes the current recipe data
   * Updates the form's initial values and loading state
   */
  initRecipe(): void {
    this.isLoading.set(true);
    this.currentRecipe$ = this.recipeService.currentRecipe$.pipe(
      takeUntil(this.destroy$),
      filter((res) => res !== null),
      tap((recipe) => {
        this.initialValues = {
          title: recipe.title,
          description: recipe.description,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          imageUrl: recipe.imageUrl,
          isFavorite: recipe.isFavorite,
        };
        this.isLoading.set(false);
      })
    );
  }

  /**
   * Handles form submission for recipe updates
   *
   * @param form Updated recipe form data
   */
  onSubmit(form: RecipeForm): void {
    this.isLoading.set(true);
    this.route.params
      .pipe(
        take(1),
        map((params) => params['id']),
        catchError(() => {
          this.isLoading.set(false);
          this.router.navigate(['/']);
          return EMPTY;
        }),
        switchMap((id) =>
          this.recipeService.updateRecipe(id, form).pipe(
            tap(() => {
              this.isLoading.set(false);
              // Update initialValues here with the new form data
              this.initialValues = { ...form };
            }),
            catchError(() => {
              this.isLoading.set(false);
              return EMPTY;
            })
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  /**
   * Deletes a recipe after confirmation
   * @param id Recipe ID to delete
   */
  deleteRecipe(id: string): void {
    if (confirm('Are you sure you want to delete this recipe?')) {
      this.isLoading.set(true);
      this.recipeService
        .deleteRecipe(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.isLoading.set(false);
            this.router.navigateByUrl('/home');
          },
          error: () => {
            this.isLoading.set(false);
          },
        });
    }
  }

  /**
   * Toggles the favorite status of a recipe
   * @param id Recipe ID
   * @param isFavorite Current favorite status
   */
  toggleFavorite(id: string, isFavorite: boolean): void {
    this.isLoading.set(true);

    this.currentRecipe$ = this.currentRecipe$.pipe(
      map((recipe) => ({ ...recipe, isFavorite: !isFavorite }))
    );

    this.recipeService
      .toggleFavorite(id, !isFavorite)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.isLoading.set(false));
  }

  /**
   * Toggles the editing mode of the recipe
   */
  toggleEdit(): void {
    this.isEditing.update((val) => !val);
  }
}
