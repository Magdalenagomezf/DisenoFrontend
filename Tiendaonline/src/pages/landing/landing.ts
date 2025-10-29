import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ProductCardComponent } from '../../components/producto/producto';
import { MLItem as ProductoInterface } from '../../app/services/api';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent],
  templateUrl: './landing.html',
  styleUrls: ['./landing.scss'],
})
export class LandingComponent implements OnInit {
  private http = inject(HttpClient);

  private _items = signal<ProductoInterface[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    // Traemos un set razonable y lo rankeamos localmente
    this.http.get<{ products: any[] }>('https://dummyjson.com/products?limit=120')
      .subscribe({
        next: (resp) => {
          const list = (resp.products ?? []).map(this.toMLItem);
          this._items.set(list);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  // ————— Ranking simple pero efectivo —————
  // favorece precio cercano a la mediana y nombres más cortos/claros
  private rank(items: ProductoInterface[]): ProductoInterface[] {
    if (!items?.length) return [];
    const prices = items.map(i => i.price).sort((a, b) => a - b);
    const mid = Math.floor(prices.length / 2);
    const median = prices.length % 2 ? prices[mid] : (prices[mid - 1] + prices[mid]) / 2;

    const scored = items.map(p => {
      const proximity = 1 - Math.min(Math.abs(p.price - median) / (median || 1), 1); // 0..1
      const nameBonus = 1 - Math.min((p.title?.length || 0) / 60, 1);                // 0..1
      const score = 0.8 * proximity + 0.2 * nameBonus;
      return { p, score };
    });

    return scored.sort((a, b) => b.score - a.score).map(s => s.p);
  }

  top = computed(() => this.rank(this._items()).slice(0, 12));

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
}
