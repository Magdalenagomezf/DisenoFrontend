// src/pages/home/home.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ProductCardComponent } from '../../components/producto/producto';
import { MLItem as ProductoInterface } from '../../app/services/api';

type CatVal = { id: string; name: string; results?: number };

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ProductCardComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class HomeComponent implements OnInit {
  private http = inject(HttpClient);

  // estado
  limit = signal(194);                 // cantidad de productos a traer
  selectedCategory = signal<string>(''); // '' = todas

  productos = signal<ProductoInterface[]>([]);
  total = signal(0);
  categorias = signal<CatVal[]>([]);
  loading = signal<boolean>(true);
  error = signal<string>('');

  ngOnInit() {
    this.loadCategories();
    this.load();
  }

  /** Trae todas las categorías de DummyJSON */
  private loadCategories() {
    // https://dummyjson.com/products/categories  -> array de strings
    this.http.get<string[]>('https://dummyjson.com/products/categories')
      .subscribe({
        next: (cats) => {
          // Convertimos a {id,name}
          const map = (id: string) => ({ id, name: this.prettyCat(id) });
          this.categorias.set(cats.map(map));
        },
        error: (e) => {
          console.error('Error categorías', e);
          this.categorias.set([]);
        }
      });
  }

  /** Carga TODOS los productos o por categoría (según selectedCategory) */
  load() {
    this.loading.set(true);
    this.error.set('');
    const cat = this.selectedCategory();
    const url = cat
      ? `https://dummyjson.com/products/category/${encodeURIComponent(cat)}?limit=${this.limit()}`
      : `https://dummyjson.com/products?limit=${this.limit()}`;

    this.http.get<{ products: any[]; total: number }>(url)
      .subscribe({
        next: (resp) => {
          const items = (resp.products ?? []).map((p) => this.toMLItem(p));
          this.productos.set(items);
          this.total.set(resp.total ?? items.length);
          this.loading.set(false);
        },
        error: (err) => {
          console.error(err);
          this.error.set('No se pudieron cargar los productos.');
          this.loading.set(false);
        },
      });
  }

  onSelectCategory(id: string) {
    this.selectedCategory.set(id || ''); // '' = todas
    this.load();
  }

  /** Adapta el item de DummyJSON al tipo que espera tu ProductCard */
  private toMLItem(p: any): ProductoInterface {
    return {
      id: p.id,
      title: p.title,
      price: p.price,
      currency_id: 'USD',
      thumbnail: p.thumbnail ?? p.images?.[0] ?? '',
      category: p.category,
      permalink: `https://dummyjson.com/products/${p.id}`,
    } as ProductoInterface;
  }

  private prettyCat(id: string) {
    // "womens-dresses" -> "Womens Dresses"
    return id.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }
}
