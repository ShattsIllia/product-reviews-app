import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  public apiUrl = 'http://localhost:3000/api/v1';

  getApiUrl(): string {
    return this.apiUrl;
  }

  getAuthUrl(path: string): string {
    return `${this.apiUrl}/auth${path}`;
  }

  getProductsUrl(): string {
    return `${this.apiUrl}/products`;
  }

  getReviewsUrl(): string {
    return `${this.apiUrl}/reviews`;
  }

  getUsersUrl(): string {
    return `${this.apiUrl}/users`;
  }
}
