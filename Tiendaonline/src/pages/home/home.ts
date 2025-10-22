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
  limit = signal(194);                 // ver TODOS
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

  /** Trae categorías y normaliza string/objeto */
  private loadCategories() {
    this.http.get<any>('https://dummyjson.com/products/categories').subscribe({
      next: (res) => {
        // API puede devolver: string[]  ó  {slug,name}[]  ó  {id,name}[]
        const list: any[] = Array.isArray(res) ? res : (res?.categories ?? []);
        const cats: CatVal[] = list
          .map((raw) => this.normalizeCat(raw))
          .filter((c): c is CatVal => !!c.id);
        this.categorias.set(cats);
      },
      error: (e) => {
        console.error('Error categorías', e);
        this.categorias.set([]);
      },
    });
  }

  /** Carga TODOS o por categoría */
  load() {
    this.loading.set(true);
    this.error.set('');
    const cat = this.selectedCategory();
    const url = cat
      ? `https://dummyjson.com/products/category/${encodeURIComponent(cat)}?limit=${this.limit()}`
      : `https://dummyjson.com/products?limit=${this.limit()}`;

    this.http.get<{ products: any[]; total: number }>(url).subscribe({
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

  /** Normaliza categoría desde string u objeto */
  private normalizeCat(raw: any): CatVal {
    if (typeof raw === 'string') {
      return { id: raw, name: this.prettyCat(raw) };
    }
    if (raw && typeof raw === 'object') {
      const id = raw.slug ?? raw.id ?? raw.name ?? '';
      const name = raw.name ? String(raw.name) : this.prettyCat(id);
      return { id: String(id), name };
    }
    return { id: '', name: '' };
  }

  /** Title-case y espacios: "womens-dresses" -> "Womens Dresses" */
  private prettyCat(val: unknown): string {
    const s = String(val ?? '');
    return s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }

  /** Convierte un producto de la API a un MLItem */
  private toMLItem(p: any): ProductoInterface {
    return {
      id: p.id,
      title: p.title,
      price: p.price,
      currency_id: 'USD',
      thumbnail: p.thumbnail ?? p.images?.[0] ?? '',
      category: p.category,
      permalink: `https://dummyjson.com/products/${p.id}`, // para el botón externo
    } as ProductoInterface;
  }
}
