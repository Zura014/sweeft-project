import { Component, input, InputSignal } from '@angular/core';
import { RecipeI } from '../../interfaces/recipe.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-recipe-template',
  imports: [RouterLink],
  templateUrl: './recipe-template.component.html',
})
export class RecipeTemplateComponent {
  recipe: InputSignal<RecipeI | undefined> = input<RecipeI>();
}
