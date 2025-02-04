import { Component, inject } from '@angular/core';
import { RecipeForm } from '../../types/recipe-form.type';
import { RecipeService } from '../../services/recipe.service';
import { CommonModule } from '@angular/common';
import { RecipeFormComponent } from '../form/recipe-form.component';

@Component({
  selector: 'app-recipe-submission',
  imports: [CommonModule, RecipeFormComponent],
  templateUrl: './recipe-submission.component.html',
})
export class RecipeSubmissionComponent {
  recipeService = inject(RecipeService);

  onSubmit(form: RecipeForm): void {
    this.recipeService.createRecipe(form).subscribe();
  }
}
