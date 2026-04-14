import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { of } from 'rxjs';

import { ProductCatalogComponent } from './product-catalog.component';
import { ProductService } from '../../services/product.service';
import type { Paginated, ProductModel } from '../../../../core/models/models';

describe('ProductCatalogComponent', () => {
  let component: ProductCatalogComponent;
  let fixture: ComponentFixture<ProductCatalogComponent>;
  let productService: jasmine.SpyObj<ProductService>;
  let router: Router;

  beforeEach(async () => {
    const productSpy = jasmine.createSpyObj('ProductService', [
      'getProducts',
      'getCategories',
    ]) as jasmine.SpyObj<ProductService>;
    productSpy.getProducts.and.returnValue(
      of({
        data: [
          {
            id: 'p1',
            slug: 'p1',
            name: 'Laptop',
            description: 'd',
            price: 10,
            imageUrl: '',
            category: 'Electronics',
            averageRating: null,
            reviewCount: 0,
          },
          {
            id: 'p2',
            slug: 'p2',
            name: 'Book',
            description: 'd',
            price: 10,
            imageUrl: '',
            category: 'Books',
            averageRating: null,
            reviewCount: 0,
          },
        ],
        total: 2,
        page: 1,
        limit: 12,
      } satisfies Paginated<ProductModel>)
    );
    productSpy.getCategories.and.returnValue(of(['Electronics', 'Books']));

    await TestBed.configureTestingModule({
      declarations: [ProductCatalogComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        NoopAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatIconModule,
      ],
      providers: [{ provide: ProductService, useValue: productSpy }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    productService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    fixture = TestBed.createComponent(ProductCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and load products', () => {
    expect(component).toBeTruthy();
    expect(productService.getProducts).toHaveBeenCalled();
    expect(component.products.length).toBe(2);
    expect(component.filteredProducts.length).toBe(2);
  });

  it('search updates call backend (server-side filtering)', fakeAsync(() => {
    component.filterForm.get('search')?.setValue('lap');
    tick(350);
    expect(productService.getProducts).toHaveBeenCalledWith(
      jasmine.objectContaining({ search: 'lap', page: 1 })
    );
  }));

  it('onProductSelect navigates to detail', () => {
    const selected: ProductModel = {
      id: 'p1',
      slug: 'p1',
      name: 'Laptop',
      description: 'd',
      price: 10,
      imageUrl: '',
      category: 'Electronics',
      averageRating: null,
      reviewCount: 0,
    };
    component.onProductSelect(selected);
    expect(router.navigate).toHaveBeenCalledWith(['/products', 'p1']);
  });
});
