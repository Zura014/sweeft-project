import { Routes } from '@angular/router';
import { NotFoundComponent } from './features/not-found/not-found.component';
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
    loadComponent: () =>
      import('./features/home/home.component').then((c) => c.HomeComponent),
  },
  {
    title: 'Recipes - Create',
    path: 'submission',
    loadComponent: () =>
      import(
        './features/recipes/components/submission/recipe-submission.component'
      ).then((c) => c.RecipeSubmissionComponent),
  },
  {
    title: 'Recipes - Details',
    path: 'details/:id',
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
