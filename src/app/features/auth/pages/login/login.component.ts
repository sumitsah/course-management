import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthFacade } from '../../auth-facade.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  authForm!: FormGroup;
  authFacade = inject(AuthFacade);

  ngOnInit() {
    this.authForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    });
  }

  onSubmit() {
    // console.log(this.authForm);
    // console.log(this.authForm.value);
    this.authFacade.login(this.authForm.value);
  }

  isFieldInvalid(controlName: string) {
    const control = this.authForm.get(controlName);
    return control && (controlName === 'email' ? control.hasError(controlName) : control.hasError('minlength')) && (control.dirty || control.touched);
  }

  isFieldRequired(controlName: string) {
    const control = this.authForm.get(controlName);
    return control && control.hasError('required') && (control.dirty || control.touched);
  }


}
