import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  signal,
} from '@angular/core';
import { RecipeForm } from '../../types/recipe-form.type';
import { RecipeService } from '../../services/recipe.service';
import { CommonModule } from '@angular/common';
import { RecipeFormComponent } from '../form/recipe-form.component';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { Subject, takeUntil } from 'rxjs';

/**
 * Component for creating recipe.
 * Handles creating recipes.
 * Uses OnPush change detection for better performance.
 */
@Component({
  selector: 'app-recipe-submission',
  imports: [CommonModule, RecipeFormComponent, LoadingComponent],
  templateUrl: './recipe-submission.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipeSubmissionComponent implements OnDestroy {
  private readonly recipeService = inject(RecipeService); // injecting for recipe creation

  isLoading = signal(false); // Signal for loading state

  private destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Handles form submission for recipe creates
   *
   * @param form created recipe form data
   */
  onSubmit(form: RecipeForm): void {
    this.isLoading.set(true);
    this.recipeService
      .createRecipe(form)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.isLoading.set(false),
        error: () => this.isLoading.set(false),
      });
  }
}
