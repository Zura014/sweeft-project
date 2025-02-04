import { FormControl } from '@angular/forms';
import { RecipeForm } from './recipe-form.type';

export type RecipeFormControls = {
  [K in keyof RecipeForm]: FormControl<RecipeForm[K]>;
};
