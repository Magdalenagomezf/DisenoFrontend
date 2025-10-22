import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { LoginService } from '../services/login.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(LoginService);
  const router = inject(Router);
  if (auth.isLoggedIn()) return true;
  alert('Debes iniciar sesión para acceder a esta sección.');
  return router.createUrlTree(['/login']);
};
