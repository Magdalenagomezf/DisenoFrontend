import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Api, Producto } from './api'; // Asegurate de que la ruta y nombre coincidan con tu archivo

describe('Api', () => {
  let service: Api;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Api],
    });

    service = TestBed.inject(Api);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all products successfully', () => {
    const mockProducts: Producto[] = [
      { id: 1, title: 'Producto 1', price: 100, description: '', category: '', image: '' },
      { id: 2, title: 'Producto 2', price: 200, description: '', category: '', image: '' },
    ];

    service.fetchAllProducts();

    const req = httpMock.expectOne('https://fakestoreapi.com/products');
    expect(req.request.method).toBe('GET');

    // Simula respuesta del backend
    req.flush(mockProducts);

    expect(service.isLoading()).toBeFalse();
    expect(service.hasError()).toBeFalse();
    expect(service.products().length).toBeGreaterThan(0);
  });

  it('should handle error on fetch', () => {
    service.fetchAllProducts();

    const req = httpMock.expectOne('https://fakestoreapi.com/products');
    req.error(new ErrorEvent('Network error'));

    expect(service.hasError()).toBeTrue();
    expect(service.errorMsg()).toContain('No se pudieron cargar los productos');
  });
});