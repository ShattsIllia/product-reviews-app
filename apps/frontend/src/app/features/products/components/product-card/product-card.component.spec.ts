import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCardComponent } from './product-card.component';

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    component.product = {
      id: 'p1',
      slug: 'p1',
      name: 'Test Product',
      description: 'A very long description',
      price: 12.34,
      imageUrl: '',
      category: 'Electronics',
      averageRating: 4.5,
      reviewCount: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders formatted price', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('$12.34');
  });

  it('truncate adds ellipsis when too long', () => {
    expect(component.truncate('1234567890', 5)).toBe('12345...');
  });
});
