import { Component, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FavoritesService } from '../../app/services/favorites.service';
import { CartService } from '../../app/services/cart.service';

@Component({
  selector: 'app-favorites-page',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, RouterLink, CurrencyPipe],
  templateUrl: './favorites.html',
  styleUrls: ['./favorites.scss']
})
export default class FavoritesPage {
  favs = inject(FavoritesService);
  cart = inject(CartService);

  remove(id: number) {
    this.favs.remove(id);
  }

  addToCart(item: { id: number; title: string; price: number; image?: string }) {
    this.cart.add({ id: item.id, title: item.title, price: item.price, image: item.image }, 1);
  }
}
