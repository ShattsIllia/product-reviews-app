import { Component, Input, Output, EventEmitter, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../../core/services/auth.service';
import { ReviewService } from '../../services/review.service';
import { DeleteConfirmDialogComponent } from '../../../../shared/components/delete-confirm-dialog/delete-confirm-dialog.component';
import type { ReviewModel, UserModel } from '../../../../core/models/models';

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatSnackBarModule, MatDialogModule],
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.scss'],
})
export class ReviewListComponent {
  @Input() reviews: ReviewModel[] = [];
  @Input() productId!: string;
  @Output() reviewDeleted = new EventEmitter<string>();

  private authService = inject(AuthService);
  private reviewService = inject(ReviewService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private destroyRef = inject(DestroyRef);

  currentUserId: string | null = null;

  constructor() {
    this.authService
      .getCurrentUser()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user: UserModel | null) => {
        this.currentUserId = user?.id || null;
      });
  }

  isOwner(review: ReviewModel): boolean {
    return this.currentUserId === review.userId;
  }

  deleteReview(reviewId: string): void {
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Review',
        message: 'Are you sure you want to delete this review?',
      },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((confirmed) => {
        if (!confirmed) {
          return;
        }

        this.reviewService
          .deleteReview(reviewId)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              this.snackBar.open('Review deleted', 'Close', { duration: 3000 });
              this.reviewDeleted.emit(reviewId);
            },
            error: (error: unknown) => {
              const message =
                (error as { error?: { message?: string } } | null | undefined)?.error?.message ||
                'Error deleting review';
              this.snackBar.open(message, 'Close', { duration: 5000 });
            },
          });
      });
  }
}
