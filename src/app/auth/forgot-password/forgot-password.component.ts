import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatButtonModule, NgIf],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  isSubmitting: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  async submit() {
    this.successMessage = '';
    this.errorMessage = '';
    this.isSubmitting = true;

    const { email } = this.forgotPasswordForm.value;

    try {
      await this.authService.requestPasswordReset(email);
      this.successMessage = 'We have sent you an email to reset your password.';
    } catch (error) {
      console.error('Error during password reset:', error);
      this.errorMessage = 'Unable to process your request. Please try again later.';
    } finally {
      this.isSubmitting = false;
    }
  }
}