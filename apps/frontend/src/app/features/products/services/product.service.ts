import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { ProductDto, PaginatedResponseDto } from '../../../core/models/api';
import type { ProductModel, Paginated } from '../../../core/models/models';
import { mapPaginated, mapProductDto } from '../../../core/models/mappers';
import { ConfigService } from '../../../core/services/config.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private configService = inject(ConfigService);

  getProducts(options?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
  }): Observable<Paginated<ProductModel>> {
    const { page = 1, limit = 12, search, category } = options || {};
    let params = new HttpParams().set('page', String(page)).set('limit', String(limit));
    if (search) params = params.set('search', search);
    if (category) params = params.set('category', category);

    return this.http
      .get<PaginatedResponseDto<ProductDto>>(this.configService.getProductsUrl(), { params })
      .pipe(map((res) => mapPaginated(res, mapProductDto)));
  }

  getProductById(id: string): Observable<ProductModel> {
    return this.http
      .get<ProductDto>(`${this.configService.getProductsUrl()}/${id}`)
      .pipe(map(mapProductDto));
  }

  getProductBySlug(slug: string): Observable<ProductModel> {
    return this.http
      .get<ProductDto>(`${this.configService.getProductsUrl()}/${slug}`)
      .pipe(map(mapProductDto));
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.configService.getProductsUrl()}/categories`);
  }
}
