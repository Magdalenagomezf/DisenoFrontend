// tiendaonline/src/services/api.spec.ts
import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { MercadoLibreService, MLItem } from './api';

describe('MercadoLibreService (DummyJSON)', () => {
  let service: MercadoLibreService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MercadoLibreService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(MercadoLibreService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('searchWomen: llama /products/search con q, limit y skip', () => {
    const q = 'women';
    const limit = 20;
    const offset = 0;

    const mockResponse = {
      products: [
        { id: 1, title: 'Vestido', price: 100, category: 'womens-dresses', thumbnail: 'img.jpg' } as MLItem,
      ],
      total: 1
    };

    service.searchWomen(q, limit, offset).subscribe((resp) => {
      expect(resp.products.length).toBe(1);
      expect(resp.products[0].title).toBe('Vestido');
      expect(resp.total).toBe(1);
    });

    const req = httpMock.expectOne(r =>
      r.url === 'https://dummyjson.com/products/search' &&
      r.params.get('q') === q &&
      r.params.get('limit') === String(limit) &&
      r.params.get('skip') === String(offset)
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('searchByCategory: llama /products/category/:id con limit y skip', () => {
    const categoryId = 'womens-dresses';
    const limit = 10;
    const offset = 20;

    const mockResponse = { products: [] as MLItem[], total: 0 };

    service.searchByCategory(categoryId, limit, offset).subscribe((resp) => {
      expect(resp.products).toEqual([]);
      expect(resp.total).toBe(0);
    });

    const req = httpMock.expectOne(r =>
      r.url === `https://dummyjson.com/products/category/${categoryId}` &&
      r.params.get('limit') === String(limit) &&
      r.params.get('skip') === String(offset)
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
