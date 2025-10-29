import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';

import { LandingComponent } from './landing';

describe('LandingComponent (Landing + Ranking)', () => {
  let fixture: ComponentFixture<LandingComponent>;
  let component: LandingComponent;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingComponent],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  function mockProducts(n: number) {
    // Genera n productos con precios variados para forzar un ranking no trivial
    return Array.from({ length: n }).map((_, i) => ({
      id: i + 1,
      title: `Producto ${i + 1}`,
      price: 10 + (i * 3) % 95, // 10..104
      thumbnail: `https://cdn.test/img/${i + 1}.jpg`,
      category: 'general',
      images: [],
    }));
  }

  it('should create and fetch products, rendering Top 12 cards', () => {
    fixture.detectChanges();

    // Expect: llamada a DummyJSON con limit=120
    const req = httpMock.expectOne('https://dummyjson.com/products?limit=120');
    expect(req.request.method).toBe('GET');

    // Respondemos con 20 productos (suficientes para recortar a 12)
    req.flush({ products: mockProducts(20) });

    fixture.detectChanges();

    // La señal computed top() debería quedar en 12
    expect(component.top().length).toBe(12);

    // En el DOM deben renderizarse 12 <app-product-card>
    const cards = fixture.debugElement.queryAll(By.css('app-product-card'));
    expect(cards.length).toBe(12);
  });

  it('should show skeletons while loading and hide them after data arrives', () => {
    // Antes de responder el request, está en loading = true
    fixture.detectChanges();

    // Skeletons visibles
    let skeletons = fixture.debugElement.queryAll(By.css('.skeleton'));
    expect(skeletons.length).toBeGreaterThan(0);

    // Resolvemos la petición
    const req = httpMock.expectOne('https://dummyjson.com/products?limit=120');
    req.flush({ products: mockProducts(8) });

    fixture.detectChanges();

    // Skeletons ocultos cuando ya hay datos
    skeletons = fixture.debugElement.queryAll(By.css('.skeleton'));
    expect(skeletons.length).toBe(0);

    // Y se renderizan hasta 8 productos (si son menos de 12)
    const cards = fixture.debugElement.queryAll(By.css('app-product-card'));
    expect(cards.length).toBe(8);
  });

  it('should render HERO with background video and CTA links', () => {
    fixture.detectChanges();

    // No necesitamos esperar a los datos para validar el HERO
    const hero = fixture.debugElement.query(By.css('.hero'));
    expect(hero).toBeTruthy();

    const video = fixture.debugElement.query(By.css('.hero__video'));
    expect(video).toBeTruthy();

    const heading = fixture.debugElement.query(By.css('.hero__content h1'));
    expect(heading.nativeElement.textContent.trim().length).toBeGreaterThan(0);

    // CTAs que llevan a /productos
    const ctas = fixture.debugElement.queryAll(By.css('.hero__cta a[routerLink="/productos"]'));
    expect(ctas.length).toBeGreaterThan(0);

    // Cerramos la request pendiente para no dejar colgado el test
    const req = httpMock.expectOne('https://dummyjson.com/products?limit=120');
    req.flush({ products: [] });
  });
});
