// src/pages/home/home.ts
import { Component, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MercadoLibreService, MLItem } from '../../app/services/api';

type CatVal = { id: string; name: string; results?: number };

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class HomeComponent implements OnInit {
  constructor(private api: MercadoLibreService) { }

  Math = Math;

  // estado
  query = signal('women');     // DummyJSON busca por "women"
  limit = signal(20);
  offset = signal(0);
  selectedCategory = signal<string>(''); // vacío = todas

  productos = signal<MLItem[]>([]);
  total = signal(0);
  categorias = signal<CatVal[]>([]);

  ngOnInit() {
    // Cargar categorías “women*”
    this.api.getCategories().subscribe((all) => {
      const women = (all as string[]).filter(c => c.startsWith('womens-'));
      this.categorias.set(women.map(id => ({
        id,
        name: id.replace('womens-', 'Women ').replace('-', ' ')
      })));
    });

    this.load();
  }

  load() {
    const cat = this.selectedCategory();
    const req = cat
      ? this.api.searchByCategory(cat, this.limit(), this.offset())
      : this.api.searchWomen(this.query(), this.limit(), this.offset());

    req.subscribe({
      next: (resp) => {
        // DummyJSON devuelve { products, total }
        const items = (resp.products ?? []).map(p => ({
          ...p,
          permalink: `https://dummyjson.com/products/${p.id}`,
          currency_id: 'USD', // para el pipe de moneda en tu template
          thumbnail: p.thumbnail ?? p.images?.[0]
        }));
        this.productos.set(items);
        this.total.set(resp.total ?? items.length);
      },
      error: (e) => console.error('DummyJSON error', e)
    });
  }

  onSelectCategory(id: string) {
    this.selectedCategory.set(id || ''); // '' = todas
    this.offset.set(0);
    this.load();
  }

  next() {
    if (this.offset() + this.limit() < this.total()) {
      this.offset.set(this.offset() + this.limit());
      this.load();
    }
  }
  prev() {
    if (this.offset() > 0) {
      this.offset.set(Math.max(0, this.offset() - this.limit()));
      this.load();
    }
  }
}
