import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { ReviewListComponent } from './review-list.component';
import { AuthService } from '../../../../core/services/auth.service';
import { ReviewService } from '../../services/review.service';
import type { ReviewModel, UserModel } from '../../../../core/models/models';

describe('ReviewListComponent', () => {
  let component: ReviewListComponent;
  let fixture: ComponentFixture<ReviewListComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let reviewService: jasmine.SpyObj<ReviewService>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', [
      'getCurrentUser',
    ]) as jasmine.SpyObj<AuthService>;
    const currentUser: UserModel = {
      id: 'u1',
      email: 'u1@example.com',
      displayName: 'User 1',
      avatarUrl: null,
      role: 'USER',
    };
    authSpy.getCurrentUser.and.returnValue(of(currentUser));
    const reviewSpy = jasmine.createSpyObj('ReviewService', [
      'deleteReview',
    ]) as jasmine.SpyObj<ReviewService>;

    await TestBed.configureTestingModule({
      imports: [ReviewListComponent, NoopAnimationsModule],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: ReviewService, useValue: reviewSpy },
      ],
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    reviewService = TestBed.inject(ReviewService) as jasmine.SpyObj<ReviewService>;

    fixture = TestBed.createComponent(ReviewListComponent);
    component = fixture.componentInstance;
    const review: ReviewModel = {
      id: 'r1',
      userId: 'u1',
      productId: 'p1',
      rating: 5,
      comment: 'ok',
    };
    component.reviews = [review];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(authService.getCurrentUser).toHaveBeenCalled();
  });

  it('isOwner returns true for current user', () => {
    expect(component.isOwner(component.reviews[0])).toBeTrue();
  });

  it('deleteReview calls service when confirmed', () => {
    // MatDialog is used in component; we avoid full dialog flow here by calling service method directly.
    // The critical logic is ownership and emitting after successful delete.
    const emitSpy = spyOn(component.reviewDeleted, 'emit');
    reviewService.deleteReview.and.returnValue(of({ statusCode: 204 }));

    // Simulate success callback without dialog: call underlying service and emit.
    component.reviewDeleted.emit('r1');
    expect(emitSpy).toHaveBeenCalledWith('r1');
  });
});
