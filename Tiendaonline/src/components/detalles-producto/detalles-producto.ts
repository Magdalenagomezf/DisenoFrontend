import { Component, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, NgIf, NgFor } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LoginService } from '../../app/services/login.service';
import { CartService } from '../../app/services/cart.service';
import { FavoritesService } from '../../app/services/favorites.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, CurrencyPipe, MatButtonModule, MatIconModule],
  templateUrl: './detalles-producto.html',
  styleUrls: ['./detalles-producto.scss']
})
export default class ProductDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private auth = inject(LoginService);
  private cart = inject(CartService);
  private favs = inject(FavoritesService);

  product: any = null;
  isLoading = true;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadProduct(id);
  }

  async loadProduct(id: string) {
    try {
      const res = await fetch(`https://dummyjson.com/products/${id}`);
      this.product = await res.json();
    } catch (err) {
      console.error('Error cargando producto', err);
    } finally {
      this.isLoading = false;
    }
  }

  private requireLoginOr(fn: () => void) {
    if (this.auth.isLoggedIn()) return fn();
    alert('Iniciá sesión para usar esta función.');
    this.router.navigate(['/login']);
  }

  addToCart() {
    this.requireLoginOr(() =>
      this.cart.add({ id: this.product.id, title: this.product.title, price: this.product.price, image: this.product.thumbnail }, 1)
    );
  }

  toggleFav() {
    this.requireLoginOr(() =>
      this.favs.toggle({ id: this.product.id, title: this.product.title, price: this.product.price, image: this.product.thumbnail })
    );
  }
}
