import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { RecipeI } from '../interfaces/recipe.interface';
import { UpdateRecipeI } from '../interfaces/update-recipe.interface';
import { CreateRecipeI } from '../interfaces/create-recipe.interface';
import { RecipeFilterType } from '../types/recipe-filter.type';
import { environment } from '../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

/**
 * Service responsible for handling all recipe-related HTTP operations
 * and maintaining a local state of recipes using BehaviorSubject.
 */

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private readonly http = inject(HttpClient);
  private readonly toastr = inject(ToastrService);
  private readonly router = inject(Router);
  private readonly apiUrl = `${environment.apiUrl}/recipes`;

  // BehaviorSubject to maintain and broadcast recipe state changes
  private readonly recipesSubject = new BehaviorSubject<RecipeI[]>([]);
  // Public observable for components to subscribe to recipe changes
  public readonly recipes$ = this.recipesSubject.asObservable();

  // BehaviorSubject to maintain and broadcast recipe state changes
  private readonly currentRecipeSubject = new BehaviorSubject<RecipeI | null>(
    null
  );
  // Public observable for components to subscribe to current recipe
  public readonly currentRecipe$ = this.currentRecipeSubject.asObservable();

  /**
   * Fetches all recipes from the API and updates the local state
   * @returns Observable of RecipeI array
   */
  public getAllRecipes(
    query?: string,
    filter?: RecipeFilterType
  ): Observable<RecipeI[]> {
    let params = new HttpParams();

    if (query) {
      params = params.set('q', query);
    }
    if (filter && filter !== 'all') {
      params = params.set('isFavorite', filter === 'favorited');
    }

    return this.http
      .get<RecipeI[]>(this.apiUrl, { params })
      .pipe(tap((recipes) => this.recipesSubject.next(recipes)));
  }

  /**
   * Retrieves a specific recipe by ID
   * @param id - Recipe identifier
   * @returns Observable of single RecipeI
   */
  public getRecipeById(id: string): Observable<RecipeI> {
    return this.http
      .get<RecipeI>(`${this.apiUrl}/${id}`)
      .pipe(tap((res) => this.currentRecipeSubject.next(res)));
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

        this.toastr.success('Recipe created successfully!', '', {
          timeOut: 5000,
          positionClass: 'toast-bottom-right',
          progressBar: true,
          messageClass: 'ease-in',
        });

        this.router.navigate(['/details', createdRecipe.id]);
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
        const updatedRecipes = currentRecipes.map((recipe) =>
          recipe.id !== id ? { ...recipe, ...updatedRecipeResponse } : recipe
        );

        this.currentRecipeSubject.next(updatedRecipeResponse);
        this.recipesSubject.next(updatedRecipes);

        this.toastr.success('Recipe updated successfully!', '', {
          timeOut: 5000,
          positionClass: 'toast-bottom-right',
          progressBar: true,
          messageClass: 'ease-in',
        });
      })
    );
  }

  /**
   * Adds/Removes recipe as favorite
   * @param id - Recipe identifier
   * @param isFavorited - Updated favorite state
   * @returns Observable of updated RecipeI
   */
  public toggleFavorite(id: string, isFavorite: boolean): Observable<RecipeI> {
    return this.http
      .patch<RecipeI>(`${this.apiUrl}/${id}`, {
        isFavorite: isFavorite,
      })
      .pipe(
        tap((updatedRecipeResponse) => {
          const currentRecipes = this.recipesSubject.value;
          const updatedRecipes = currentRecipes.map((recipe) =>
            recipe.id !== id ? { ...recipe, ...updatedRecipeResponse } : recipe
          );

          this.recipesSubject.next(updatedRecipes);

          this.toastr.success(
            isFavorite
              ? 'Recipe favorited successfully!'
              : 'Recipe unfavorited successfully',
            '',
            {
              timeOut: 5000,
              positionClass: 'toast-bottom-right',
              progressBar: true,
              messageClass: 'ease-in',
            }
          );
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
        this.currentRecipeSubject.next(null);

        this.toastr.success('Recipe deleted successfully!', '', {
          timeOut: 5000,
          positionClass: 'toast-bottom-right',
          progressBar: true,
        });
      })
    );
  }
}
