import { Component } from '@angular/core';
import { RecipeListComponent } from '../recipes/components/list/recipe-list.component';
import { HeaderComponent } from "../../shared/components/header/header.component";

@Component({
  selector: 'app-home',
  imports: [RecipeListComponent, HeaderComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {}
