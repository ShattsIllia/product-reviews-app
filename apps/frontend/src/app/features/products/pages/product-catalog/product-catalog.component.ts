import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, debounceTime } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProductService } from '../../services/product.service';
import type { ProductModel } from '../../../../core/models/models';

@Component({
  selector: 'app-product-catalog',
  templateUrl: './product-catalog.component.html',
  styleUrls: ['./product-catalog.component.scss'],
})
export class ProductCatalogComponent implements OnInit, OnDestroy {
  private productService = inject(ProductService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private destroy$ = new Subject<void>();

  products: ProductModel[] = [];
  filteredProducts: ProductModel[] = [];
  isLoading = false;
  filterForm: FormGroup;

  categories: string[] = [];
  currentPage = 1;
  pageSize = 12;

  constructor() {
    this.filterForm = this.fb.group({
      search: [''],
      category: [''],
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();

    this.filterForm
      .get('search')
      ?.valueChanges.pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe(() => {
        this.currentPage = 1;
        this.loadProducts();
      });

    this.filterForm
      .get('category')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.currentPage = 1;
        this.loadProducts();
      });
  }

  loadCategories(): void {
    this.productService
      .getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (cats) => {
          this.categories = cats;
        },
      });
  }

  loadProducts(): void {
    const search = this.filterForm.get('search')?.value || undefined;
    const category = this.filterForm.get('category')?.value || undefined;

    this.isLoading = true;
    this.productService
      .getProducts({ page: this.currentPage, limit: this.pageSize, search, category })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          // Create new array reference to force change detection
          this.products = [...response.data];
          this.filteredProducts = [...response.data];
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading products:', error);
          this.isLoading = false;
        },
      });
  }

  onProductSelect(product: ProductModel): void {
    this.router.navigate(['/products', product.id]);
  }

  resetFilters(): void {
    this.filterForm.reset();
    this.currentPage = 1;
    this.loadProducts();
  }

  trackByProductId(index: number, product: ProductModel): string {
    return product?.id || index.toString();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
