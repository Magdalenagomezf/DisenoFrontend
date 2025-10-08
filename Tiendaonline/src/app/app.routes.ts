import { Routes } from '@angular/router';
import { Home } from '../pages/home/home';
// import { Producto } from '../pages/productos/productos';

export const routes: Routes = [
    {
        path: '',
        component: Home,
        pathMatch: 'full'
    },/*
    {
        path: '', redirectTo: 'productos', pathMatch: 'full'
    },
    {
        path: 'productos',component: Productos
    },*/
];
