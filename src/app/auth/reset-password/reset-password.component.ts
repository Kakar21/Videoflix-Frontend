import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { passwordMatchValidator } from '../../validations/passwordMatch';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatButtonModule, NgIf ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordComponent {
  hide = signal(true);
  uidb64!: string;
  token!: string;
  passwordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.passwordForm = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.uidb64 = params['uidb64'];
      this.token = params['token'];
    });
  }

  resetPassword(): void {
    if (this.passwordForm.valid) {
      const { password } = this.passwordForm.value;
      this.authService.resetPassword(password, this.uidb64, this.token)
        .then(response => {
          console.log('Password reset successful:', response);
          this.router.navigate(['/login']);
        })
        .catch(error => {
          console.error('Error resetting password:', error);
        });
    }
  }
  
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  private passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }
}
