import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnDestroy,
} from '@angular/core';
import { RecipeI } from '../../interfaces/recipe.interface';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { RecipeService } from '../../services/recipe.service';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Subject, takeUntil } from 'rxjs';
import { NgIf } from '@angular/common';

/**
 * Component for displaying individual recipe cards
 * Uses OnPush change detection for better performance
 * Handles favorite toggling with proper subscription cleanup
 */

@Component({
  selector: 'app-recipe-card',
  imports: [NgIf, RouterLink, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipeCardComponent implements OnDestroy {
  private readonly recipeService = inject(RecipeService); // injects recipe service for handling toggle-favorite
  /*
   * I would've used signals instead of decorators,
   * but task description suggested using decorators.
   */
  @Input() recipe?: RecipeI; // receives recipe value which is displayed in card template

  private destroy$ = new Subject<void>();

  imageLoaded = false;

  // Toggles the favorite status of a recipe
  toggleFavorite(): void {
    if (this.recipe) {
      this.recipe.isFavorite = !this.recipe.isFavorite;

      this.recipeService
        .toggleFavorite(this.recipe.id, this.recipe.isFavorite)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            this.recipe = { ...this.recipe!, isFavorite: res.isFavorite }; // Ensure immutability
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
