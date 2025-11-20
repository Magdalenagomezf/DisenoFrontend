import { Injectable, computed, effect, signal } from '@angular/core';
import { LoginService } from './login.service';
import { readLS, writeLS, userScopedKey } from './user-storage';

export interface CartItem {
  id: number;
  title: string;
  price: number;
  image?: string;
  qty: number;
}

const BASE_KEY = 'cart:items';

@Injectable({ providedIn: 'root' })
export class CartService {
  private items = signal<CartItem[]>([]);
  readonly totalItems = computed(() => this.items().reduce((a, i) => a + i.qty, 0));
  readonly totalPrice = computed(() => this.items().reduce((a, i) => a + i.price * i.qty, 0));
  readonly list = computed(() => this.items());

  constructor(private auth: LoginService) {
    effect(() => {
      const user = this.auth.currentUser();
      const key = userScopedKey(user, BASE_KEY);
      const data = readLS<CartItem[]>(key, []);
      this.items.set(data);
    });
    effect(() => {
      const user = this.auth.currentUser();
      const key = userScopedKey(user, BASE_KEY);
      writeLS(key, this.items());
    });
  }

  add(item: Omit<CartItem, 'qty'>, qty = 1) {
    const current = [...this.items()];
    const idx = current.findIndex(i => i.id === item.id);
    if (idx >= 0) current[idx] = { ...current[idx], qty: current[idx].qty + qty };
    else current.push({ ...item, qty });
    this.items.set(current);
  }

  setQty(id: number, qty: number) {
    const current = this.items().map(i => (i.id === id ? { ...i, qty } : i)).filter(i => i.qty > 0);
    this.items.set(current);
  }

  remove(id: number) {
    this.items.set(this.items().filter(i => i.id !== id));
  }

  clear() {
    this.items.set([]);
  }
}
