import { Routes } from '@angular/router';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { HomeComponent } from './features/home/home.component';
import { RecipeDetailsComponent } from './features/recipes/components/details/recipe-details.component';
import { RecipeSubmissionComponent } from './features/recipes/components/submission/recipe-submission.component';
import { recipeResolver } from './features/recipes/resolvers/recipe.resolver';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    title: 'Recipes - Home',
    path: 'home',
    component: HomeComponent,
  },
  {
    title: 'Recipes - Create',
    path: 'submission',
    component: RecipeSubmissionComponent,
  },
  {
    title: 'Recipes - Details',
    path: 'details/:id',
    // component: RecipeDetailsComponent,
    loadComponent: () =>
      import(
        './features/recipes/components/details/recipe-details.component'
      ).then((c) => c.RecipeDetailsComponent),
    resolve: { recipeResolver },
  },
  {
    title: 'Recipes - Not found!',
    path: 'not-found',
    component: NotFoundComponent,
  },
  {
    path: '**',
    redirectTo: 'not-found',
    pathMatch: 'full',
  },
];
