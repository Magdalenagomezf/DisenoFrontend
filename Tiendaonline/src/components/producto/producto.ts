import { Component, input, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, SlicePipe, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

import { MLItem as ProductoInterface } from '../../app/services/api';
import { LoginService } from '../../app/services/login.service';
import { CartService } from '../../app/services/cart.service';
import { FavoritesService } from '../../app/services/favorites.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    CurrencyPipe,
    SlicePipe
  ],
  templateUrl: './producto.html',
  styleUrls: ['./producto.scss']
})
export class ProductCardComponent {
  /** Datos del producto desde la lista */
  product = input.required<ProductoInterface>();

  private auth = inject(LoginService);
  private cart = inject(CartService);
  private favs = inject(FavoritesService);
  private router = inject(Router);

  /** Ir a la página interna de detalle */
  goDetail(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    this.router.navigate(['/detalle', this.product().id]);
  }

  /** Abrir el sitio externo en otra pestaña sin afectar el click interno */
  openExternal(ev: Event) {
    ev.preventDefault();
    ev.stopPropagation();
    const url = this.product().permalink;
    if (url) window.open(url, '_blank');
  }

  /** Ejecuta la acción solo si hay sesión; si no, redirige al login */
  private requireLoginOr(fn: () => void) {
    if (this.auth.isLoggedIn()) return fn();
    alert('Iniciá sesión para usar esta función.');
    this.router.navigate(['/login']);
  }

  onAddToCart() {
    const p = this.product();
    this.requireLoginOr(() =>
      this.cart.add({ id: Number(p.id), title: p.title, price: p.price, image: p.thumbnail }, 1)
    );
  }

  isFav(): boolean {
    return this.favs.isFavorite(Number(this.product().id));
  }

  onToggleFav() {
    const p = this.product();
    this.requireLoginOr(() =>
      this.favs.toggle({ id: Number(p.id), title: p.title, price: p.price, image: p.thumbnail })
    );
  }
}
