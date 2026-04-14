import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { StarRatingComponent } from '../../../../shared/components/star-rating/star-rating.component';
import type { ProductModel } from '../../../../core/models/models';
import { PricePipe } from '../../../../shared/pipes/price.pipe';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, StarRatingComponent, PricePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent {
  productImageUrl: string = '';

  private _product!: ProductModel;
  @Input()
  set product(value: ProductModel) {
    this._product = value;
    this.productImageUrl = this.buildProductImageUrl(value);
  }
  get product(): ProductModel {
    return this._product;
  }

  private buildProductImageUrl(product: ProductModel | null): string {
    if (product?.imageUrl) return product.imageUrl;

    return 'data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect fill="%23667eea" width="400" height="400"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="24" fill="white">Product</text></svg>';
  }

  truncate(text: string | undefined, length: number): string {
    if (!text) return '';
    return text.length > length ? text.substring(0, length) + '...' : text;
  }
}
