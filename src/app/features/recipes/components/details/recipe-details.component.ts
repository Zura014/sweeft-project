import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { RecipeI } from '../../interfaces/recipe.interface';
import {
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
import { RecipeForm } from '../../../../shared/components/recipe-form/types/recipe-form.type';
import { RecipeFormComponent } from '../../../../shared/components/recipe-form/recipe-form.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-recipe-details',
  imports: [CommonModule, ReactiveFormsModule, RecipeFormComponent],
  templateUrl: './recipe-details.component.html',
})
export class RecipeDetailsComponent implements OnInit, OnDestroy {
  route = inject(ActivatedRoute);
  router = inject(Router);
  recipeService = inject(RecipeService);
  fb = inject(FormBuilder);

  recipe$!: Observable<RecipeI>;

  initialValues: RecipeForm = {
    title: '',
    description: '',
    ingredients: [],
    instructions: '',
    imageUrl: '',
    isFavorite: false,
  };

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.recipe$ = this.route.data.pipe(
      takeUntil(this.destroy$),
      map((data) => data['recipe']),
      tap((recipe) => {
        this.initialValues = {
          title: recipe.title,
          description: recipe.description,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          imageUrl: recipe.imageUrl,
          isFavorite: recipe.isFavorite,
        };
      })
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(form: RecipeForm): void {
    this.route.params
      .pipe(
        take(1),
        map((params) => params['id']),
        switchMap((id) => this.recipeService.updateRecipe(id, form))
      )
      .subscribe();
  }

  onError(error: HttpErrorResponse): void {
    this.router.navigate(['/recipes']);
  }
}
