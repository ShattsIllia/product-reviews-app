import { Injectable, inject } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import type { Observable } from 'rxjs';
import type { ProductModel, ReviewModel } from '../../../core/models/models';
import { ProductService } from './product.service';
import { ReviewService } from './review.service';

/**
 * Small facade to keep ProductDetailComponent thin.
 * - Services remain HTTP clients.
 * - Component owns UI flags, facade owns "load both" flow.
 */
@Injectable({ providedIn: 'root' })
export class ProductDetailFacade {
    private productService = inject(ProductService);
    private reviewService = inject(ReviewService);

    /** Load product first, then reviews (keeps existing behavior). */
    load(productId: string): Observable<{ product: ProductModel; reviews: ReviewModel[] }> {
        return this.productService.getProductById(productId).pipe(
            switchMap((product) =>
                this.reviewService.getReviewsByProduct(productId).pipe(
                    map((res) => ({ product, reviews: res.data })),
                ),
            ),
        );
    }

    /** Reload product only (used after delete where UI already removed review row). */
    reloadProduct(productId: string): Observable<ProductModel> {
        return this.productService.getProductById(productId);
    }
}

