// src/services/api.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

export interface MLItem {
  id: number;
  title: string;
  price: number;
  category: string;
  thumbnail?: string;
  images?: string[];
  permalink?: string; // lo generamos para el link
  currency_id?: string; // para que tu template no rompa
}

@Injectable({ providedIn: 'root' })
export class MercadoLibreService {
  private http = inject(HttpClient);
  private base = 'https://dummyjson.com';

  // Búsqueda “women”
  searchWomen(q = 'women', limit = 20, offset = 0) {
    const params = new HttpParams()
      .set('q', q)
      .set('limit', limit)
      .set('skip', offset);
    return this.http.get<{ products: MLItem[]; total: number }>(
      `${this.base}/products/search`,
      { params }
    );
  }

  // Por categoría (ej: womens-dresses, womens-bags, womens-shoes…)
  searchByCategory(categoryId: string, limit = 20, offset = 0) {
    const params = new HttpParams()
      .set('limit', limit)
      .set('skip', offset);
    return this.http.get<{ products: MLItem[]; total: number }>(
      `${this.base}/products/category/${categoryId}`,
      { params }
    );
  }

  // Todas las categorías; filtraremos en el componente las que comienzan con "womens-"
  getCategories() {
    return this.http.get<string[]>(`${this.base}/products/categories`);
  }
}
