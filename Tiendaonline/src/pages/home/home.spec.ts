import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { HomeComponent as Home } from './home';

describe('Home (DummyJSON)', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create and load all products (limit=194)', () => {
    fixture.detectChanges();

    // 1) categorías
    const catsReq = httpMock.expectOne('https://dummyjson.com/products/categories');
    expect(catsReq.request.method).toBe('GET');
    catsReq.flush(['womens-dresses', 'womens-bags']);

    // 2) productos (todos)
    const prodReq = httpMock.expectOne('https://dummyjson.com/products?limit=194');
    expect(prodReq.request.method).toBe('GET');
    prodReq.flush({
      products: [{ id: 1, title: 'Vestido', price: 100, thumbnail: 'x.jpg', category: 'womens-dresses' }],
      total: 194
    });

    expect(component.productos().length).toBe(1);
    expect(component.total()).toBe(194);
  });

  it('should load by category when selected', () => {
    fixture.detectChanges();

    // categorías
    const catsReq = httpMock.expectOne('https://dummyjson.com/products/categories');
    catsReq.flush(['womens-dresses', 'womens-bags']);

    // primera carga "todos"
    const prodReq1 = httpMock.expectOne('https://dummyjson.com/products?limit=194');
    prodReq1.flush({ products: [], total: 194 });

    // seleccionar categoría
    component.onSelectCategory('womens-dresses');

    const prodReq2 = httpMock.expectOne('https://dummyjson.com/products/category/womens-dresses?limit=194');
    expect(prodReq2.request.method).toBe('GET');
    prodReq2.flush({ products: [], total: 40 });

    expect(component.selectedCategory()).toBe('womens-dresses');
    expect(component.total()).toBe(40);
  });
});
