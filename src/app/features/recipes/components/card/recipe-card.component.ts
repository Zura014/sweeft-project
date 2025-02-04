import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { RecipeI } from '../../interfaces/recipe.interface';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { RecipeService } from '../../services/recipe.service';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-recipe-card',
  imports: [RouterLink, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './recipe-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipeCardComponent {
  /*
   * I would've used signals instead of decorators,
   * but task description suggested using decorators.
   */
  @Input() recipe?: RecipeI;

  recipeService = inject(RecipeService);

  toggleFavorite(): void {
    if (this.recipe) {
      this.recipe.isFavorite = !this.recipe.isFavorite;

      this.recipeService
        .toggleFavorite(this.recipe.id, this.recipe.isFavorite)
        .subscribe({
          next: (res) => {
            this.recipe = { ...this.recipe!, isFavorite: res.isFavorite }; // Ensure immutability
          },
        });
    }
  }
}
