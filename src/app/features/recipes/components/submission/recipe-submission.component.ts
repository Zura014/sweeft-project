import { Component, inject, signal } from '@angular/core';
import { RecipeForm } from '../../types/recipe-form.type';
import { RecipeService } from '../../services/recipe.service';
import { CommonModule } from '@angular/common';
import { RecipeFormComponent } from '../form/recipe-form.component';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
@Component({
  selector: 'app-recipe-submission',
  imports: [CommonModule, RecipeFormComponent, LoadingComponent],
  templateUrl: './recipe-submission.component.html',
})
export class RecipeSubmissionComponent {
  recipeService = inject(RecipeService);

  isLoading = signal(false);

  onSubmit(form: RecipeForm): void {
    this.isLoading.set(true);
    this.recipeService.createRecipe(form).subscribe({
      next: () => this.isLoading.set(false),
      error: () => this.isLoading.set(false),
    });
  }
}
