import { Component, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../../core/services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private destroyRef = inject(DestroyRef);

  form: FormGroup;
  isLoading = false;
  hidePassword = true;
  hidePasswordConfirm = true;

  constructor() {
    this.form = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        displayName: ['', [Validators.required, Validators.minLength(2)]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(group: FormGroup): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit = (): void => {
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    const { email, password, displayName } = this.form.value;

    if (!this.authService) {
      console.error('AuthService is undefined');
      return;
    }

    this.authService
      .register(email, password, displayName)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.snackBar.open(
            'Registration successful! Please log in with your credentials.',
            'Close',
            {
              duration: 5000,
            }
          );
          this.router.navigate(['/auth/login']);
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading = false;
          const message = error?.error?.message || 'Registration error';
          this.snackBar.open(message, 'Close', { duration: 5000 });
        },
      });
  };

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  togglePasswordConfirmVisibility(): void {
    this.hidePasswordConfirm = !this.hidePasswordConfirm;
  }

  get email() {
    return this.form.get('email');
  }

  get displayName() {
    return this.form.get('displayName');
  }

  get password() {
    return this.form.get('password');
  }

  get confirmPassword() {
    return this.form.get('confirmPassword');
  }

  get passwordsMatch(): boolean {
    return this.form.get('password')?.value === this.form.get('confirmPassword')?.value;
  }
}
