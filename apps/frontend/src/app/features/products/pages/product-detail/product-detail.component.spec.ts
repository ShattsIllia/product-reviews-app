import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

import { ProductDetailComponent } from './product-detail.component';
import { ProductService } from '../../services/product.service';
import { ReviewService } from '../../services/review.service';
import { PricePipe } from '../../../../shared/pipes/price.pipe';
import type { Paginated, ProductModel, ReviewModel } from '../../../../core/models/models';

describe('ProductDetailComponent', () => {
  let component: ProductDetailComponent;
  let fixture: ComponentFixture<ProductDetailComponent>;
  let productService: jasmine.SpyObj<ProductService>;
  let reviewService: jasmine.SpyObj<ReviewService>;
  let router: Router;

  const routeStub = {
    snapshot: {
      paramMap: {
        get: (_key: string) => 'p1',
      },
    },
  };

  beforeEach(async () => {
    const productSpy = jasmine.createSpyObj('ProductService', [
      'getProductById',
    ]) as jasmine.SpyObj<ProductService>;
    const reviewSpy = jasmine.createSpyObj('ReviewService', [
      'getReviewsByProduct',
    ]) as jasmine.SpyObj<ReviewService>;

    productSpy.getProductById.and.returnValue(
      of({
        id: 'p1',
        slug: 'p1',
        name: 'Laptop',
        description: 'd',
        price: 10,
        imageUrl: '',
        category: 'Electronics',
        averageRating: 4.5,
        reviewCount: 1,
      } satisfies ProductModel)
    );
    reviewSpy.getReviewsByProduct.and.returnValue(
      of({
        data: [
          {
            id: 'r1',
            userId: 'u1',
            productId: 'p1',
            rating: 5,
            comment: null,
          } satisfies ReviewModel,
        ],
        total: 1,
        page: 1,
        limit: 10,
      } satisfies Paginated<ReviewModel>)
    );

    await TestBed.configureTestingModule({
      declarations: [ProductDetailComponent],
      imports: [RouterTestingModule, NoopAnimationsModule, PricePipe],
      providers: [
        { provide: ActivatedRoute, useValue: routeStub },
        { provide: ProductService, useValue: productSpy },
        { provide: ReviewService, useValue: reviewSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    productService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    reviewService = TestBed.inject(ReviewService) as jasmine.SpyObj<ReviewService>;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    fixture = TestBed.createComponent(ProductDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and load product + reviews', () => {
    expect(component).toBeTruthy();
    expect(productService.getProductById).toHaveBeenCalledWith('p1');
    expect(reviewService.getReviewsByProduct).toHaveBeenCalledWith('p1');
    expect(component.product?.id).toBe('p1');
    expect(component.reviews.length).toBe(1);
  });

  it('should navigate back', () => {
    component.goBack();
    expect(router.navigate).toHaveBeenCalledWith(['/products']);
  });

  it('on load error navigates to products', () => {
    productService.getProductById.and.returnValue(throwError(() => new Error('fail')));
    component.loadProduct();
    expect(router.navigate).toHaveBeenCalledWith(['/products']);
  });
});
