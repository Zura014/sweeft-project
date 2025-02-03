import {
  Component,
  inject,
  Input,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { RecipeForm } from './types/recipe-form.type';
import {
  FormBuilder,
  FormControl,
  FormArray,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { computed } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-recipe-form',
  templateUrl: './recipe-form.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatCardModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
  ],
})
export class RecipeFormComponent implements OnInit {
  private fb = inject(FormBuilder);

  @Input() initialValues?: RecipeForm;
  @Output() submitEvent = new EventEmitter<RecipeForm>();
  @Output() error = new EventEmitter<HttpErrorResponse>();

  // Control for adding new ingredients
  ingredientFormCtrl = new FormControl('', [Validators.required]);

  // Main form group
  form = this.fb.nonNullable.group({
    title: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(50)],
    ],
    description: [
      '',
      [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(500),
      ],
    ],
    ingredients: this.fb.array([], [Validators.required]),
    instructions: ['', [Validators.required, Validators.minLength(20)]],
    imageUrl: [
      '',
      [
        Validators.required,
        Validators.pattern(
          /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/
        ),
      ],
    ],
    isFavorite: [false],
  });

  get ingredients(): FormArray {
    return this.form.get('ingredients') as FormArray;
  }

  // Computed property to check if form has errors
  hasError = computed(() => this.form.touched && !this.form.valid);

  ngOnInit(): void {
    if (this.initialValues) {
      this.form.patchValue({
        title: this.initialValues.title,
        description: this.initialValues.description,
        instructions: this.initialValues.instructions,
        imageUrl: this.initialValues.imageUrl,
        isFavorite: this.initialValues.isFavorite,
      });
      // Handle initial ingredients
      if (this.initialValues.ingredients?.length) {
        this.initialValues.ingredients.forEach((ingredient) =>
          this.ingredients.push(
            this.fb.control(ingredient, Validators.required)
          )
        );
        this.ingredientFormCtrl.clearValidators();
      } else {
        this.ingredientFormCtrl.addValidators([Validators.required]);
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
      this.ingredientFormCtrl.setValidators([]);
      this.ingredientFormCtrl.reset();
    }
  }

  removeIngredient(index: number): void {
    this.ingredients.removeAt(index);
  }

  submitForm(): void {
    if (this.ingredientFormCtrl.valid) {
      this.addIngredient();
    }

    if (this.ingredients.value.length && this.form.valid) {
      this.submitEvent.emit(this.form.getRawValue() as RecipeForm);
    } else {
      // Mark all fields as touched to display errors
      Object.values(this.form.controls).forEach((control) => {
        if (control instanceof FormControl) {
          control.markAsTouched();
        }
      });
    }
  }
}
