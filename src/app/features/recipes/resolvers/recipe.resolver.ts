import { ResolveFn, Router } from '@angular/router';
import { RecipeI } from '../interfaces/recipe.interface';
import { inject } from '@angular/core';
import { RecipeService } from '../services/recipe.service';
import { catchError, delay, EMPTY } from 'rxjs';

/**
 * Resolver for pre-fetching a specific recipe
 * before navigating to the corresponding page.
 *
 * @returns Observable<RecipeI>
 */

export const recipeResolver: ResolveFn<RecipeI> = (route, state) => {
  const recipeService = inject(RecipeService);
  const router = inject(Router);

  return recipeService.getRecipeById(route.paramMap.get('id') ?? '').pipe(
    delay(300),
    catchError(() => {
      router.navigate(['/']);
      return EMPTY;
    })
  );
};
