import { Routes } from '@angular/router';

import { HomeComponent } from '../pages/home/home';
import { ProductCardComponent } from '../components/producto/producto';

import { authGuard } from './guards/auth.guard';
import LoginComponent from '../components/login/login';

import FavoritesPage from '../pages/favorites/favorites';
import CartPage from '../pages/cart/cart';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'productos', component: ProductCardComponent },

  { path: 'favoritos', component: FavoritesPage, canActivate: [authGuard] },
  { path: 'carrito', component: CartPage, canActivate: [authGuard] },

  { path: 'login', component: LoginComponent },

  { path: '**', redirectTo: '' },
];
