import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'form-validation',
  standalone: false,
  template: `
    <small class="text-red-500 text-xs" *ngIf="error">{{ error }}</small>
  `,
  styleUrl: './form-validation.component.css'
})

export class FormValidationComponent {
  @Input() control!: AbstractControl | null;

  get error(): string | null {
    // console.log(this.control)
    if (!this.control || !this.control.errors || !(this.control.touched || this.control.dirty)) {
      return null;
    }

    if (this.control.errors['required']) return `Required field`;
    if (this.control.errors['minlength']) return 'Too short';
    if (this.control.errors['min']) return 'Minimum is 99';

    return null;
  }
}