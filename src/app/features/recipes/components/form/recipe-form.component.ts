import {
  Component,
  inject,
  Input,
  OnInit,
  Output,
  EventEmitter,
  signal,
} from '@angular/core';
import { RecipeForm } from '../../types/recipe-form.type';
import { RecipeFormControls } from '../../types/recipe-form-controls.type';
import { RecipeFormGroup } from '../../types/recipe-form-group.type';
import {
  FormControl,
  ReactiveFormsModule,
  Validators,
  FormGroup,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { computed } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { LiveAnnouncer } from '@angular/cdk/a11y';

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
  private liveAnnouncer = inject(LiveAnnouncer);

  @Input() initialValues?: RecipeForm;
  @Output() submitEvent = new EventEmitter<RecipeForm>();
  @Output() error = new EventEmitter<HttpErrorResponse>();

  // Main form group
  form: RecipeFormGroup = new FormGroup<RecipeFormControls>({
    title: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    description: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10)],
    }),
    ingredients: new FormControl<string[]>([], {
      nonNullable: true,
      validators: [Validators.required],
    }),
    instructions: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(20)],
    }),
    imageUrl: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    isFavorite: new FormControl<boolean>(false, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  readonly ingredients = signal<string[]>([]);

  private isFormDirty = computed(() => this.form.dirty);

  // Computed property to check if form has errors
  hasError = computed(() => this.form.touched && !this.form.valid);

  ngOnInit(): void {
    if (this.initialValues) {
      this.form.patchValue({
        title: this.initialValues.title,
        description: this.initialValues.description,
        ingredients: this.initialValues.ingredients,
        instructions: this.initialValues.instructions,
        imageUrl: this.initialValues.imageUrl,
        isFavorite: this.initialValues.isFavorite,
      });

      // Handle initial ingredients
      if (this.initialValues.ingredients.length) {
        this.ingredients.set(this.initialValues.ingredients);
      }
    }
  }

  addIngredient(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.ingredients.update((ingredients) => [...ingredients, value]);
      this.liveAnnouncer.announce(`Added ${value} to ingredients`);
    }
    if (event.chipInput) {
      event.chipInput.clear();
    }
  }

  removeIngredient(ingredient: string): void {
    this.ingredients.update((ingredients) => {
      const index = ingredients.indexOf(ingredient);
      if (index >= 0) {
        ingredients.splice(index, 1);
        this.liveAnnouncer.announce(`Removed ${ingredient} from ingredients`);
      }
      return [...ingredients];
    });
  }

  submitForm(): void {
    if (this.form.valid) {
      const formValue = this.form.getRawValue();
      this.submitEvent.emit({
        ...formValue,
        ingredients: this.ingredients(),
      } as RecipeForm);
    } else {
      // Mark all fields as touched to display errors
      this.form.markAllAsTouched();
    }
  }
}
