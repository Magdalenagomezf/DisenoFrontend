import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

export interface Producto {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: { rate: number; count: number };
}

@Injectable({ providedIn: 'root' })
export class Api {
  private http = inject(HttpClient);
  private readonly baseUrl = 'https://fakestoreapi.com/';

  readonly pageSize = signal(10);
  readonly page = signal(1);

  private readonly allProducts = signal<Producto[]>([]);

  readonly isLoading = signal(false);
  readonly hasError = signal(false);
  readonly errorMsg = signal<string | null>(null);

  readonly maxPages = computed(() => {
    const total = this.allProducts().length;
    return Math.max(1, Math.ceil(total / this.pageSize()));
  });

  readonly canGoNext = computed(() => this.page() < this.maxPages());
  readonly canGoPrev = computed(() => this.page() > 1);

  readonly products = computed<Producto[]>(() => {
    const list = this.allProducts();
    const size = this.pageSize();
    const current = this.page();

    const start = (current - 1) * size;
    const end = start + size;
    return list.slice(start, end);
  });

  constructor() {
    effect(() => {
      const m = this.maxPages();
      const p = this.page();
      if (p > m) this.page.set(m);
      if (p < 1) this.page.set(1);
    });
  }

  fetchAllProducts(): void {
    this.isLoading.set(true);
    this.hasError.set(false);
    this.errorMsg.set(null);

this.http
  .get<Producto[]>(`${this.baseUrl}products`) // <-- usa backticks

      .pipe(
        catchError((err) => {
          this.hasError.set(true);
          this.errorMsg.set('No se pudieron cargar los productos.');
          console.error('API error:', err);
          return of([] as Producto[]);
        }),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe((items) => {
        this.allProducts.set(items);
        // Reinicia a página 1 después de una carga
        this.page.set(1);
      });
  }

  goNext(): void {
    if (this.canGoNext()) this.page.update((p) => p + 1);
  }

  goPrev(): void {
    if (this.canGoPrev()) this.page.update((p) => p - 1);
  }

  goToPage(n: number): void {
    const target = Math.min(Math.max(1, n), this.maxPages());
    this.page.set(target);
  }

  setPageSize(size: number): void {
    if (size <= 0) return;
    this.pageSize.set(size);
    this.page.set(1); 
  }
}