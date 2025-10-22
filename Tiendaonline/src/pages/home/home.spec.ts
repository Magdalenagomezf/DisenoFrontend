import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { HomeComponent as Home } from './home';
import { MercadoLibreService } from '../../app/services/api';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;
  let httpMock: HttpTestingController;
  const defaultQuery = 'ropa mujer';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [
        MercadoLibreService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    // primera llamada de ngOnInit
    fixture.detectChanges();
    const req = httpMock.expectOne(r =>
      r.url === 'https://api.mercadolibre.com/sites/MLA/search' &&
      r.params.get('q') === defaultQuery
    );
    req.flush({ results: [], paging: { total: 0, offset: 0, limit: 20 }, available_filters: [] });
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar productos por búsqueda por defecto', () => {
    component.load();
    const req = httpMock.expectOne(r =>
      r.url === 'https://api.mercadolibre.com/sites/MLA/search' &&
      r.params.get('q') === defaultQuery &&
      r.params.get('limit') === '20' &&
      r.params.get('offset') === '0'
    );
    expect(req.request.method).toBe('GET');
    req.flush({
      results: [{ id: 'MLA1', title: 'Vestido', price: 10000, currency_id: 'ARS', permalink: 'https://...' }],
      paging: { total: 1, offset: 0, limit: 20 },
      available_filters: [{ id: 'category', values: [{ id: 'MLA1574', name: 'Vestidos', results: 1 }] }],
    });

    expect(component.productos().length).toBe(1);
    expect(component.total()).toBe(1);
    expect(component.categorias().length).toBeGreaterThan(0);
  });

  it('debería buscar por categoría cuando se selecciona', () => {
    component.onSelectCategory('MLA1574');
    const req = httpMock.expectOne(r =>
      r.url === 'https://api.mercadolibre.com/sites/MLA/search' &&
      r.params.get('category') === 'MLA1574'
    );
    req.flush({ results: [], paging: { total: 0, offset: 0, limit: 20 }, available_filters: [] });
    expect(component.selectedCategory()).toBe('MLA1574');
  });
});
