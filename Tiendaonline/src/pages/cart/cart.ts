import { Component, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../app/services/cart.service';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, RouterLink, CurrencyPipe],
  templateUrl: './cart.html',
  styleUrls: ['./cart.scss']
})
export default class CartPage {
  cart = inject(CartService);

  setQty(id: number, event: Event) {
    const value = Number((event.target as HTMLInputElement).value || 0);
    if (Number.isFinite(value) && value >= 0) {
      this.cart.setQty(id, value);
    }
  }

  remove(id: number) {
    this.cart.remove(id);
  }

  clear() {
    this.cart.clear();
  }
}
