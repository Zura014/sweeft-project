import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { RecipeI } from '../interfaces/recipe.interface';
import { UpdateRecipeI } from '../interfaces/update-recipe.interface';
import { CreateRecipeI } from '../interfaces/create-recipe.interface';

/**
 * Service responsible for handling all recipe-related HTTP operations
 * and maintaining a local state of recipes using WritableSignal.
 */

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/recipes';

  // WritableSignal to maintain and broadcast recipe state changes
  readonly #recipes = signal<RecipeI[]>([]);

  // Public Signal for components to subscribe to recipe changes
  public readonly recipes = computed(this.#recipes);

  constructor() {
    // Initialize the recipes state when service is instantiated
    this.getAllRecipes().subscribe();
  }

  /**
   * Fetches all recipes from the API and updates the local state
   * @returns Observable of RecipeI array
   */
  public getAllRecipes(): Observable<RecipeI[]> {
    return this.http
      .get<RecipeI[]>(this.apiUrl)
      .pipe(tap((recipes) => this.#recipes.set(recipes)));
  }

  /**
   * Retrieves a specific recipe by ID
   * @param id - Recipe identifier
   * @returns Observable of single RecipeI
   */
  public getRecipeById(id: string): Observable<RecipeI> {
    return this.http.get<RecipeI>(`${this.apiUrl}/${id}`);
  }

  /**
   * Creates a new recipe and updates the local state
   * @param newRecipe - Recipe data for creation
   * @returns Observable of created RecipeI
   */
  public createRecipe(newRecipe: CreateRecipeI): Observable<RecipeI> {
    return this.http.post<RecipeI>(this.apiUrl, newRecipe).pipe(
      tap((createdRecipe) => {
        this.#recipes.update((currentRecipes) => [
          ...currentRecipes,
          createdRecipe,
        ]);
      })
    );
  }

  /**
   * Updates an existing recipe and refreshes the local state
   * @param id - Recipe identifier
   * @param updatedRecipe - Updated recipe data
   * @returns Observable of updated RecipeI
   */
  public updateRecipe(
    id: string,
    updatedRecipe: UpdateRecipeI
  ): Observable<RecipeI> {
    return this.http.patch<RecipeI>(`${this.apiUrl}/${id}`, updatedRecipe).pipe(
      tap((updatedRecipeResponse) => {
        this.#recipes.update((currentRecipes) => {
          return [
            ...currentRecipes.filter((recipe) => recipe.id !== id),
            updatedRecipeResponse,
          ];
        });
      })
    );
  }

  /**
   * Deletes a recipe and updates the local state
   * @param id - Recipe identifier
   * @returns Observable of deleted RecipeI
   */
  public deleteRecipe(id: string): Observable<RecipeI> {
    return this.http.delete<RecipeI>(`${this.apiUrl}/${id}`).pipe(
      tap((deletedRecipe) => {
        this.#recipes.update((currentRecipes) =>
          currentRecipes.filter((recipe) => recipe.id !== deletedRecipe.id)
        );
      })
    );
  }
}
