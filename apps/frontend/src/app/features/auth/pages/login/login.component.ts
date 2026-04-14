import { Component, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../../core/services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private destroyRef = inject(DestroyRef);

  form: FormGroup;
  isLoading = false;
  hidePassword = true;

  constructor() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit = (): void => {
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    const { email, password } = this.form.value;

    if (!this.authService) {
      console.error('AuthService is undefined');
      return;
    }

    this.authService
      .login(email, password)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.snackBar.open('Sign in successful!', 'Close', {
            duration: 3000,
          });
          this.router.navigate(['/products']);
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading = false;
          const message = error?.error?.message || 'Sign in error';
          this.snackBar.open(message, 'Close', { duration: 5000 });
        },
      });
  };

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }
}
