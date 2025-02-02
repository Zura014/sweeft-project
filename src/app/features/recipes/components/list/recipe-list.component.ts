import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { RecipeService } from '../../services/recipe.service';
import { RecipeI } from '../../interfaces/recipe.interface';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { RecipeTemplateComponent } from '../template/recipe-template.component';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  startWith,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';

@Component({
  selector: 'app-recipe-list',
  imports: [
    NgIf,
    NgFor,
    AsyncPipe,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    RecipeTemplateComponent,
    ReactiveFormsModule,
    LoadingComponent,
  ],
  templateUrl: './recipe-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush, // optimization strategy to improve performance
})
export class RecipeListComponent implements OnInit {
  private readonly recipeService = inject(RecipeService); // inject the RecipeService

  private destroy$ = new Subject<void>(); // subject to handle unsubscribing from observables on component destroy
  isLoading = signal(true); // signal to track the loading state of recipes

  searchControl = new FormControl(''); // FormControl for the search input

  recipes$?: Observable<RecipeI[]>; // observable that will hold the filtered recipes

  ngOnInit(): void {
    // initialize the recipes
    this.recipes$ = this.searchControl.valueChanges.pipe(
      takeUntil(this.destroy$), // unsubscribe when the component is destroyed
      startWith(''), // start with an empty string to fetch all recipes initially
      debounceTime(300), // wait 300ms after user input before making a request
      distinctUntilChanged(), // only emit values that are different from the previous value
      switchMap(
        (
          query // switch to a new observable for each search query
        ) =>
          this.recipeService.getAllRecipes().pipe(
            // call the RecipeService to get all recipes
            map(
              (
                recipes // filter the recipes based on the search query
              ) =>
                recipes.filter(
                  (
                    recipe // filter logic: check if title or description includes the query
                  ) =>
                    recipe.title.toLowerCase().includes(query!.toLowerCase()) ||
                    recipe.description
                      .toLowerCase()
                      .includes(query!.toLowerCase())
                )
            ),
            tap(() => this.isLoading.set(false)) // set isLoading to false after recipes are loaded
          )
      )
    );
  }

  ngOnDestroy(): void {
    // unsubscribe from all observables to prevent memory leaks
    this.destroy$.next();
    this.destroy$.complete();
  }
}
