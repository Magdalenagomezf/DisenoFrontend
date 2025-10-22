import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { ProductCardComponent } from './producto';
import { MLItem } from '../../app/services/api'; // 👈 ajustado a tu ruta real

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;

  // Mock acorde a DummyJSON (id: number, USD por defecto)
  const mockProduct: MLItem = {
    id: 1,
    title: 'Vestido de Fiesta Elegante para Mujer',
    price: 15000.5,
    currency_id: 'USD',
    permalink: 'https://dummyjson.com/products/1',
    thumbnail: 'https://cdn.dummyjson.com/product-images/1/thumbnail.jpg',
    category: 'womens-dresses'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCardComponent],
      providers: [provideNoopAnimations()], // evita errores de Material en tests
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('product', mockProduct);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the product title', () => {
    const titleElement: HTMLElement = fixture.nativeElement.querySelector('.product-title');
    expect(titleElement.textContent).toContain(mockProduct.title);
  });

  it('should display the product price formatted as currency (contains $ and part of value)', () => {
    const priceElement: HTMLElement = fixture.nativeElement.querySelector('.price');
    expect(priceElement.textContent).toContain('$');       // símbolo
    // Evitamos dependencia exacta del locale
    expect(priceElement.textContent.replace(/\s/g, '')).toMatch(/15,?0?0?0?.?5|15\.000,50/);
  });
  /*
    it('should link to the product permalink', () => {
      const linkElement: HTMLAnchorElement = fixture.nativeElement.querySelector('.product-link');
      expect(linkElement.href).toBe(mockProduct.permalink);
    }); 
  */
  it('should display the product thumbnail', () => {
    const imgElement: HTMLImageElement = fixture.nativeElement.querySelector('.product-img');
    expect(imgElement.src).toContain(mockProduct.thumbnail!);
    expect(imgElement.alt).toBe(mockProduct.title);
  });
});
