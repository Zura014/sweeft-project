import { Component } from '@angular/core';
import { RecipeListComponent } from '../recipes/components/list/recipe-list.component';
import { RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-home',
  imports: [RecipeListComponent, RouterLink, MatButton],
  templateUrl: './home.component.html',
})
export class HomeComponent {}
