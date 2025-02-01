import { Routes } from '@angular/router';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { HomeComponent } from './features/home/home.component';
import { RecipeDetailsComponent } from './features/recipes/components/details/recipe-details.component';
import { RecipeSubmissionComponent } from './features/recipes/components/submission/recipe-submission.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'submission',
    component: RecipeSubmissionComponent,
  },
  {
    path: 'details/:id',
    component: RecipeDetailsComponent,
  },
  {
    path: 'not-found',
    component: NotFoundComponent,
  },
  {
    path: '**',
    redirectTo: 'not-found',
    pathMatch: 'full',
  },
];
