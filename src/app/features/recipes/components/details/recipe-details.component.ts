import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

@Component({
  selector: 'app-recipe-details',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButton,
    RecipeFormComponent,
    LoadingComponent,
  ],
  templateUrl: './recipe-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipeDetailsComponent implements OnInit, OnDestroy {
  route = inject(ActivatedRoute);
  router = inject(Router);
  recipeService = inject(RecipeService);
  fb = inject(FormBuilder);

  currentRecipe$!: Observable<RecipeI>;

  initialValues: RecipeForm = {
    title: '',
    description: '',
    ingredients: [],
    instructions: '',
    imageUrl: '',
    isFavorite: false,
  };

  isEditing = signal(false);
  isLoading = signal(false);

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.initRecipe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

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
            })
          )
        )
      )
      .subscribe();
  }

  deleteRecipe(id: string): void {
    if (confirm('Are you sure you want to delete this recipe?')) {
      this.isLoading.set(true);
      this.recipeService.deleteRecipe(id).subscribe({
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

  toggleFavorite(id: string, isFavorite: boolean): void {
    this.isLoading.set(true);

    this.currentRecipe$ = this.currentRecipe$.pipe(
      map((recipe) => ({ ...recipe, isFavorite: !isFavorite }))
    );

    this.recipeService
      .toggleFavorite(id, !isFavorite)
      .subscribe(() => this.isLoading.set(false));
  }

  toggleEdit(): void {
    this.isEditing.update((val) => !val);
  }
}
