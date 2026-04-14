import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProductDetailFacade } from '../../services/product-detail.facade';
import type { ProductModel, ReviewModel } from '../../../../core/models/models';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private facade = inject(ProductDetailFacade);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  product: ProductModel | null = null;
  productImageUrl: string = '';
  reviews: ReviewModel[] = [];
  isLoading = false;
  isLoadingReviews = false;

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/products']);
      return;
    }

    this.isLoading = true;
    this.facade
      .load(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ product, reviews }) => {
          this.product = product;
          this.productImageUrl = this.buildProductImageUrl(product);
          this.reviews = reviews;
          this.isLoading = false;
          this.isLoadingReviews = false;
        },
        error: () => {
          this.isLoading = false;
          this.router.navigate(['/products']);
        },
      });
  }

  onReviewAdded(): void {
    if (this.product?.id) {
      this.isLoadingReviews = true;
      this.facade
        .load(this.product.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: ({ product, reviews }) => {
            this.product = product;
            this.productImageUrl = this.buildProductImageUrl(product);
            this.reviews = reviews;
            this.isLoadingReviews = false;
          },
          error: () => {
            this.isLoadingReviews = false;
          },
        });
    }
  }

  onReviewDeleted(reviewId: string): void {
    this.reviews = this.reviews.filter((r) => r.id !== reviewId);

    // Reload product to update rating and review count
    if (this.product?.id) {
      this.facade
        .reloadProduct(this.product.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (product) => {
            this.product = product;
            this.productImageUrl = this.buildProductImageUrl(product);
          },
        });
    }
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }

  private buildProductImageUrl(product: ProductModel | null): string {
    if (product?.imageUrl) return product.imageUrl;

    return 'data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600"><rect fill="%23667eea" width="600" height="600"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="36" fill="white">Product</text></svg>';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
