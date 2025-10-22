import { Injectable, computed, effect, signal } from '@angular/core';
import { LoginService } from './login.service';
import { readLS, writeLS, userScopedKey } from './user-storage';

export interface FavoriteItem {
  id: number;
  title: string;
  price: number;
  image?: string;
}

const BASE_KEY = 'fav:items';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private items = signal<FavoriteItem[]>([]);
  readonly list = computed(() => this.items());
  readonly count = computed(() => this.items().length);

  constructor(private auth: LoginService) {
    effect(() => {
      const key = userScopedKey(this.auth.currentUser(), BASE_KEY);
      this.items.set(readLS<FavoriteItem[]>(key, []));
    });
    effect(() => {
      const key = userScopedKey(this.auth.currentUser(), BASE_KEY);
      writeLS(key, this.items());
    });
  }

  toggle(item: FavoriteItem) {
    const exists = this.items().some(i => i.id === item.id);
    this.items.set(exists ? this.items().filter(i => i.id !== item.id) : [...this.items(), item]);
  }

  remove(id: number) {
    this.items.set(this.items().filter(i => i.id !== id));
  }
}
