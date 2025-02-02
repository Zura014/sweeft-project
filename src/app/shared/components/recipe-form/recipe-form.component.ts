import {
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { RecipeForm } from './types/recipe-form.type';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RecipeService } from '../../../features/recipes/services/recipe.service';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-recipe-form',
  templateUrl: './recipe-form.component.html',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatChipsModule],
})
export class RecipeFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private recipeService = inject(RecipeService);
  private route = inject(ActivatedRoute);

  @Input() initialValues?: RecipeForm;

  @Output() submitEvent = new EventEmitter<RecipeForm>();
  @Output() error = new EventEmitter<HttpErrorResponse>();

  /*/////////////////////////////////////////|
  | * didn't use signal approaches, because  |
  | * task recommended using decorators.     |
  | initialValues = input<RecipeForm>();     |
  | submitEvent = output<RecipeForm>();      |
  | error = output<HttpErrorResponse>();     |
  ///////////////////////////////////////////|
  */

  ingredientFormCtrl = new FormControl('', [Validators.required]);

  form = this.fb.nonNullable.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    ingredients: this.fb.array([], [Validators.required]),
    instructions: ['', [Validators.required]],
    imageUrl: ['', [Validators.required]],
    isFavorite: [false, [Validators.required]],
  });

  get ingredients(): FormArray {
    return this.form.get('ingredients') as FormArray;
  }

  isSubmitting = signal(false);
  hasError = computed(() => this.form.touched && !this.form.valid);

  ngOnInit(): void {
    const values = this.initialValues;

    if (values) {
      this.form.patchValue({
        title: values.title,
        description: values.description,
        ingredients: values.ingredients,
        instructions: values.instructions,
        imageUrl: values.imageUrl,
        isFavorite: values.isFavorite,
      });
      if (values.ingredients?.length) {
        values.ingredients.forEach((ingredient) => {
          this.ingredients.push(this.fb.control(ingredient));
        });
      }
    }
  }

  addIngredient(event?: Event): void {
    event?.preventDefault();

    if (this.ingredientFormCtrl.valid) {
      this.ingredients.push(
        this.fb.control(this.ingredientFormCtrl.value, {
          validators: [Validators.required],
          nonNullable: true,
        })
      );
      this.ingredientFormCtrl.reset();
    }
  }

  removeIngredient(index: number): void {
    this.ingredients.removeAt(index);
  }

  submitForm(): void {
    this.isSubmitting.set(true);
    if (this.form.valid) {
      this.submitEvent.emit(this.form.getRawValue() as RecipeForm);
    }
    this.isSubmitting.set(false);
  }
}
