import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RecipeListComponent } from '../recipes/components/list/recipe-list.component';

@Component({
  selector: 'app-home',
  imports: [RecipeListComponent],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {}
