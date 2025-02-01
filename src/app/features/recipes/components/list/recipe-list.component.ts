import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RecipeService } from '../../services/recipe.service';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  startWith,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { RecipeI } from '../../interfaces/recipe.interface';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { RecipeTemplateComponent } from '../template/recipe-template.component';

@Component({
  selector: 'app-recipe-list',
  imports: [
    AsyncPipe,
    NgIf,
    NgFor,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    RecipeTemplateComponent,
    ReactiveFormsModule,
    LoadingComponent,
  ],
  templateUrl: './recipe-list.component.html',
})
export class RecipeListComponent implements OnInit, OnDestroy {
  private recipeService = inject(RecipeService);

  private destroy$ = new Subject<void>();

  searchControl = new FormControl('');

  recipes$?: Observable<RecipeI[]>;

  ngOnInit(): void {
    this.recipes$ = this.searchControl.valueChanges.pipe(
      startWith(''),
      takeUntil(this.destroy$),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((query) =>
        this.recipeService
          .getAllRecipes()
          .pipe(
            map((recipes) =>
              recipes.filter(
                (recipe) =>
                  recipe.title.toLowerCase().includes(query!.toLowerCase()) ||
                  recipe.description
                    .toLowerCase()
                    .includes(query!.toLowerCase())
              )
            )
          )
      )
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
