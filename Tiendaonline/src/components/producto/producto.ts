import { Component, input } from '@angular/core';
import { CommonModule, CurrencyPipe, SlicePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

// Importamos la interfaz MLItem del servicio API para tipar el input.
import { MLItem as ProductoInterface } from '../../app/services/api';

@Component({
  selector: 'app-product-card',
  template: `
    <mat-card class="product-card">
        <!-- Enlaza el thumbnail y el título -->
        <a [href]="product().permalink" target="_blank" class="product-link">
            <mat-card-header>
                <!-- Usamos una div simple como contenedor del thumbnail -->
                <div mat-card-avatar class="product-image-container">
                    <img [src]="product().thumbnail" [alt]="product().title" class="product-img">
                </div>
                <mat-card-title class="product-title">{{ product().title }}</mat-card-title>
                <!-- La API de Mercado Libre no siempre devuelve la categoría directamente en el item, 
                     pero usamos el ID o un campo relevante si existiera. -->
                <mat-card-subtitle>{{ product().id }}</mat-card-subtitle>
            </mat-card-header>
        </a>

        <mat-card-content>
            <!-- Usamos la descripción del título ya que la API de ML no siempre proporciona una descripción detallada en el listado. -->
            <!-- Utilizamos el pipe 'slice' que requiere 'CommonModule' -->
            <p class="product-description">{{ product().title | slice:0:70 }}...</p>
            
            <!-- ELIMINADO: No tenemos un campo 'rating' en la MLItem, se quita para evitar errores. -->
        </mat-card-content>

        <mat-card-actions class="flex justify-between items-center">
            <div class="price-section">
                <!-- Mostramos el precio con el pipe currency, usando el currency_id de la API de ML -->
                <span class="price font-bold text-xl text-green-700">
                    {{ product().price | currency: product().currency_id }}
                </span>
            </div>
            
            <a [href]="product().permalink" target="_blank">
                <button mat-raised-button color="primary">
                    <mat-icon>launch</mat-icon>
                    Ver Producto
                </button>
            </a>
        </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .product-card {
        width: 100%;
        max-width: 400px;
        margin: 16px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
    }
    .product-link {
        text-decoration: none;
        color: inherit;
    }
    .product-image-container {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 16px;
        flex-shrink: 0;
    }
    .product-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    .product-title {
        font-size: 1rem;
        font-weight: 600;
        line-height: 1.2;
        max-height: 2.4em; /* Mantiene 2 líneas */
        overflow: hidden;
    }
    mat-card-header {
        align-items: flex-start;
        padding-bottom: 0;
    }
    mat-card-content {
        padding-top: 8px;
        flex-grow: 1;
    }
    .product-description {
        font-size: 0.9rem;
        color: #555;
    }
    mat-card-actions {
        padding: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .price {
        white-space: nowrap;
    }
  `],
  standalone: true,
  // Importamos los módulos de Angular Material necesarios y CommonModule para los pipes
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    CurrencyPipe,
    SlicePipe
  ]
})
export class ProductCardComponent {
  // Utilizamos `input()` para recibir los datos del producto
  product = input.required<ProductoInterface>();

  // ELIMINADO: No es necesario ya que la acción solo es un enlace
  // onAddToCart() {
  //    console.log(`Producto ${this.product().title} agregado al carrito!`);
  // }
}
