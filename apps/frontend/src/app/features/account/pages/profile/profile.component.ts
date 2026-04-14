import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import type { UserModel } from '../../../../core/models/models';
import { UserService } from '../../services/user.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  private userService = inject(UserService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  form: FormGroup;
  isLoading = false;
  isSaving = false;
  currentUser: UserModel | null = null;
  avatarLoadFailed = false;

  constructor() {
    this.form = this.fb.group({
      email: [{ value: '', disabled: true }, Validators.required],
      displayName: ['', [Validators.required, Validators.minLength(2)]],
      avatarUrl: [''],
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.userService
      .getProfile()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (user: UserModel) => {
          this.avatarLoadFailed = false;
          this.currentUser = user;
          this.authService.setCurrentUser(user);
          this.form.patchValue({
            email: user.email,
            displayName: user.displayName,
            avatarUrl: user.avatarUrl || '',
          });
          this.isLoading = false;
        },
        error: (_err: Error) => {
          this.isLoading = false;
          this.snackBar.open('Error loading profile', 'Close', {
            duration: 5000,
          });
        },
      });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    this.isSaving = true;
    this.avatarLoadFailed = false;
    const displayName = String(this.form.get('displayName')?.value ?? '').trim();
    const avatarUrlRaw = String(this.form.get('avatarUrl')?.value ?? '').trim();
    const avatarUrl = avatarUrlRaw.length ? avatarUrlRaw : null;

    this.userService
      .updateProfile({ displayName, avatarUrl })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (user: UserModel) => {
          this.currentUser = user;
          this.authService.setCurrentUser(user);
          this.snackBar.open('Profile updated successfully!', 'Close', {
            duration: 3000,
          });
          this.isSaving = false;
        },
        error: (_err: Error) => {
          this.snackBar.open('Error saving profile', 'Close', {
            duration: 5000,
          });
          this.isSaving = false;
        },
      });
  }

  onExit(): void {
    this.router.navigate(['/products']);
  }

  onCancel(): void {
    this.router.navigate(['/products']);
  }

  onAvatarError(): void {
    this.avatarLoadFailed = true;
  }

  get avatarUrlPreview(): string | null {
    if (this.avatarLoadFailed) return null;
    const fromForm = String(this.form.get('avatarUrl')?.value ?? '').trim();
    if (fromForm) return fromForm;
    return this.currentUser?.avatarUrl ?? null;
  }

  get email() {
    return this.form.get('email');
  }

  get displayName() {
    return this.form.get('displayName');
  }

  get avatarUrl() {
    return this.form.get('avatarUrl');
  }
}
