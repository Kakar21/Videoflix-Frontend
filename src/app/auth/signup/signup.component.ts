import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { passwordMatchValidator } from '../../validations/passwordMatch';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-signup',
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatIconModule, NgIf],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent {
  signUpForm: FormGroup;
  errorMessage = '';
  hide = signal(true);

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    // Abrufen der E-Mail-Adresse aus dem Navigationsstatus, falls vorhanden
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { email?: string; };
    const email = state?.email || '';

    this.signUpForm = this.fb.group(
      {
        email: [email, [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
      },
      { validators: passwordMatchValidator() }
    );
  }

  async signup() {
    const { email, password, confirmPassword } = this.signUpForm.value;

    const response = await this.authService.isEmailRegistered(email);
    if (response.is_registered) {
      this.signUpForm.get('email')?.setErrors({ emailAlreadyRegistered: true });
      return;
    }

    if (password === confirmPassword) {
      this.authService
        .register(email, password)
        .then((response) => {
          this.router.navigate(['/login']);
        })
        .catch((error) => {
          console.error(error);
          if (error.error.email) {
            this.errorMessage = error.error.email;
          } else if (error.error.password) {
            this.errorMessage = error.error.password;
          } else {
            this.errorMessage = 'Something went wrong. Please try again later.';
          }
        });
    } else {
      console.error('Passwords do not match');
    }
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
}
