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
import { ToastrService } from 'ngx-toastr';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-recipe-card',
  imports: [RouterLink, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './recipe-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipeCardComponent {
  @Input() recipe?: RecipeI;

  recipeService = inject(RecipeService);
  toastr = inject(ToastrService);

  /* 
   * or newer approach
   recipe: InputSignal<RecipeI | undefined> = input<RecipeI>();
   * and in template, replace recipe, with recipe() 
  */

  toggleFavorite(): void {
    if (this.recipe) {
      this.recipe.isFavorite = !this.recipe.isFavorite;

      this.recipeService
        .toggleFavorite(this.recipe.id, this.recipe.isFavorite)
        .subscribe({
          next: (res) => {
            this.recipe = { ...this.recipe!, isFavorite: res.isFavorite }; // Ensure immutability
            this.toastr.success(
              this.recipe!.isFavorite
                ? 'Recipe favorited successfully!'
                : 'Recipe unfavorited Successfully',
              '',
              {
                timeOut: 3000,
                closeButton: true,
                positionClass: 'toast-bottom-right',
              }
            );
          },
          error: (err) => {
            this.toastr.error('Something went wrong!', '', {
              timeOut: 3000,
              closeButton: true,
              positionClass: 'toast-bottom-right',
            });
            console.error(err);
          },
        });
    }
  }
}
