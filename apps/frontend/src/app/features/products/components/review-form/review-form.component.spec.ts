import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { ReviewFormComponent } from './review-form.component';
import { ReviewService } from '../../services/review.service';
import { AuthService } from '../../../../core/services/auth.service';
import type { ReviewModel } from '../../../../core/models/models';

describe('ReviewFormComponent', () => {
  let component: ReviewFormComponent;
  let fixture: ComponentFixture<ReviewFormComponent>;
  let reviewService: jasmine.SpyObj<ReviewService>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const reviewSpy = jasmine.createSpyObj('ReviewService', [
      'createReview',
    ]) as jasmine.SpyObj<ReviewService>;
    const authSpy = jasmine.createSpyObj('AuthService', [
      'isAuthenticatedSync',
    ]) as jasmine.SpyObj<AuthService>;
    authSpy.isAuthenticatedSync.and.returnValue(true);

    await TestBed.configureTestingModule({
      imports: [ReviewFormComponent, HttpClientTestingModule, NoopAnimationsModule],
      providers: [
        { provide: ReviewService, useValue: reviewSpy },
        { provide: AuthService, useValue: authSpy },
      ],
    }).compileComponents();

    reviewService = TestBed.inject(ReviewService) as jasmine.SpyObj<ReviewService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    fixture = TestBed.createComponent(ReviewFormComponent);
    component = fixture.componentInstance;
    component.productId = 'p1';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(authService.isAuthenticatedSync).toHaveBeenCalled();
  });

  it('submits valid review and emits reviewAdded', () => {
    const emitSpy = spyOn(component.reviewAdded, 'emit');
    const createdReview: ReviewModel = {
      id: 'r1',
      userId: 'u1',
      productId: 'p1',
      rating: 5,
      comment: 'ok',
    };
    reviewService.createReview.and.returnValue(of(createdReview));

    component.form.patchValue({ rating: 5, comment: 'ok' });
    component.onSubmit();

    expect(reviewService.createReview).toHaveBeenCalledWith('p1', { rating: 5, comment: 'ok' });
    expect(emitSpy).toHaveBeenCalled();
  });
});
