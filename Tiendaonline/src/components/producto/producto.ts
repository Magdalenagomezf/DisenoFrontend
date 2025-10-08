/*import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Producto } from '../../services/api';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './producto.html',
  styleUrls: ['./producto.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Producto {
  @Input({ required: true}) product!: Producto;
  @Output() add = new EventEmitter<Producto>();

  onAddToCart() {
    this.add.emit(this.product);
  }
}*/
