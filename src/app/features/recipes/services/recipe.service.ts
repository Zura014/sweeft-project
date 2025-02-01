import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { RecipeI } from '../interfaces/recipe.interface';
import { UpdateRecipeI } from '../interfaces/update-recipe.interface';
import { CreateRecipeI } from '../interfaces/create-recipe.interface';

/**
 * Service responsible for handling all recipe-related HTTP operations
 * and maintaining a local state of recipes using BehaviorSubject.
 */

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/recipes';

  // BehaviorSubject to maintain and broadcast recipe state changes
  private readonly recipesSubject = new BehaviorSubject<RecipeI[]>([]);

  // Public observable for components to subscribe to recipe changes
  public readonly recipes$ = this.recipesSubject.asObservable();

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
      .pipe(tap((recipes) => this.recipesSubject.next(recipes)));
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
        const currentRecipes = this.recipesSubject.value;
        this.recipesSubject.next([...currentRecipes, createdRecipe]);
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
        const currentRecipes = this.recipesSubject.value;
        const updatedRecipes = currentRecipes
          .filter((recipe) => recipe.id !== id)
          .concat(updatedRecipeResponse);
        this.recipesSubject.next(updatedRecipes);
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
        const filteredRecipes = this.recipesSubject.value.filter(
          (recipe) => recipe.id !== deletedRecipe.id
        );
        this.recipesSubject.next(filteredRecipes);
      })
    );
  }
}
