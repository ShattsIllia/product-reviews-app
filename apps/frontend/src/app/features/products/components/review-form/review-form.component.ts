import { Component, DestroyRef, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ReviewService } from '../../services/review.service';
import { AuthService } from '../../../../core/services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.scss'],
})
export class ReviewFormComponent {
  @Input() productId!: string;
  @Output() reviewAdded = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private reviewService = inject(ReviewService);
  private snackBar = inject(MatSnackBar);
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);

  form: FormGroup;
  isLoading = false;

  constructor() {
    this.form = this.fb.group({
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', [Validators.maxLength(500)]],
    });
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticatedSync();
  }

  setRating(value: number): void {
    this.form.patchValue({ rating: value });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    const { rating, comment } = this.form.value as { rating: number; comment: string };

    this.reviewService
      .createReview(this.productId, { rating, comment })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.form.reset();
          this.snackBar.open('Review added successfully!', 'Close', {
            duration: 3000,
          });
          this.reviewAdded.emit();
        },
        error: (error: unknown) => {
          this.isLoading = false;
          const message =
            (error as { error?: { message?: string } } | null | undefined)?.error?.message ||
            'Error adding review';
          this.snackBar.open(message, 'Close', { duration: 5000 });
        },
      });
  }
}
