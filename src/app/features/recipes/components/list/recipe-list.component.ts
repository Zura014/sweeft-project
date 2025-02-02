import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { RecipeService } from '../../services/recipe.service';
import { RecipeI } from '../../interfaces/recipe.interface';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { RecipeTemplateComponent } from '../template/recipe-template.component';

@Component({
  selector: 'app-recipe-list',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    RecipeTemplateComponent,
    ReactiveFormsModule,
    LoadingComponent,
  ],
  templateUrl: './recipe-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipeListComponent implements OnInit {
  private recipeService = inject(RecipeService); // injecting RecipeService

  recipes = signal<RecipeI[]>([]); // Signal to store recipes
  searchTerm = signal(''); // search query to filter recipes

  isLoading = signal(true); // Signal to track loading state

  ngOnInit(): void {
    /**  fetching recipes  */
    this.recipeService.getAllRecipes().subscribe((recipes) => {
      this.isLoading.set(false); // Set loading state to false
      this.recipes.set(recipes); // Set the Signal's value when data arrives
    });
  }

  filteredRecipes = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const allRecipes = this.recipes(); // Access the current value of the Signal

    if (!term) {
      return allRecipes; // Return all recipes if no search term
    }
    /*
     * if the code continues (meaning there's search term),
     * filtering with title and description
     */
    return allRecipes.filter(
      (recipe) =>
        recipe.title.toLowerCase().includes(term) ||
        recipe.description.toLowerCase().includes(term)
    );
  });

  onSearchTermChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value); // Update the searchTerm signal
  }
}
