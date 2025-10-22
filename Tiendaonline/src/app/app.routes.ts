import { Routes } from '@angular/router';
import { HomeComponent } from '../pages/home/home';
import { ProductCardComponent } from '../components/producto/producto';

export const routes: Routes = [
    { path: '', component: HomeComponent, pathMatch: 'full' },
    { path: 'productos', component: ProductCardComponent },// cuando lo tengas
    { path: '**', redirectTo: '' }
];
