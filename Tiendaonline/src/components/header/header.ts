import { Component, HostListener, inject } from '@angular/core';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgIf, NgFor, NgClass],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class Header {
  private router = inject(Router);
  open = false;
  toggle() { this.open = !this.open; }
  close() { this.open = false; }

  // Cierra el menú al cambiar de ruta
  constructor() {
    this.router.events.subscribe(() => { if (this.open) this.open = false; });
  }

  // Cerrar con ESC
  @HostListener('document:keydown.escape') onEsc() { this.close(); }

  // Evita cerrar al hacer click dentro del panel
  stop(e: Event) { e.stopPropagation(); }

  // NUEVO: estado del submenú
  submenuOpen = false;
  openSubmenu() { this.submenuOpen = true; }
  closeSubmenu() { this.submenuOpen = false; }
  toggleSubmenu() { this.submenuOpen = !this.submenuOpen; }

  categorias = [
    { label: 'Pantalones', link: '/categoria/pantalones' },
    { label: 'Remeras', link: '/categoria/remeras' },
    { label: 'Bodys', link: '/categoria/bodys' },
    { label: 'Tops', link: '/categoria/tops' },
    { label: 'Camperas', link: '/categoria/camperas' },
  ];
  links = [
    { label: 'Inicio', link: '/' },
    { label: 'Carrito', link: '/cart' },
    { label: 'Contacto', link: '/contact' },
  ];
}
