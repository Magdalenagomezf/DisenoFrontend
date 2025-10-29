import { Component, HostListener, inject } from '@angular/core';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../../app/services/login.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgIf, MatIconModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class Header {
  private router = inject(Router);
  auth = inject(LoginService);

  open = false;
  toggle() { this.open = !this.open; }
  close() { this.open = false; }

  // acciones de cuenta
  goLogin() { this.router.navigate(['/login']); }
  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/');
  }

}
