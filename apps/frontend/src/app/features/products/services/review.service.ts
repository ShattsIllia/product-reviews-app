import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type {
  CreateReviewInput,
  UpdateReviewInput,
  PaginatedResponseDto,
  ReviewDto,
} from '../../../core/models/api';
import type { Paginated, ReviewModel } from '../../../core/models/models';
import { mapPaginated, mapReviewDto } from '../../../core/models/mappers';
import { ConfigService } from '../../../core/services/config.service';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private http = inject(HttpClient);
  private configService = inject(ConfigService);

  getReviewsByProduct(
    productId: string,
    page: number = 1,
    limit: number = 10
  ): Observable<Paginated<ReviewModel>> {
    return this.http
      .get<PaginatedResponseDto<ReviewDto>>(
        `${this.configService.getProductsUrl()}/${productId}/reviews`,
        {
          params: { page, limit },
        }
      )
      .pipe(map((res) => mapPaginated(res, mapReviewDto)));
  }

  createReview(productId: string, data: CreateReviewInput): Observable<ReviewModel> {
    return this.http
      .post<ReviewDto>(`${this.configService.getProductsUrl()}/${productId}/reviews`, data)
      .pipe(map(mapReviewDto));
  }

  updateReview(reviewId: string, data: UpdateReviewInput): Observable<ReviewModel> {
    return this.http
      .patch<ReviewDto>(`${this.configService.getReviewsUrl()}/${reviewId}`, data)
      .pipe(map(mapReviewDto));
  }

  deleteReview(reviewId: string): Observable<{ statusCode: number }> {
    return this.http.delete<{ statusCode: number }>(
      `${this.configService.getReviewsUrl()}/${reviewId}`
    );
  }
}
