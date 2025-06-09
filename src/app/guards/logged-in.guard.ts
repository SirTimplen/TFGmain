import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { GlobalService } from '../services/global.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {
  constructor(private globalService: GlobalService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    const userType = localStorage.getItem('userType');
    if (!userType) {
      // Si el usuario no ha iniciado sesión, redirigirlo a la página de login
      this.router.navigate(['/login']);
      return false;
    }
    // Si ha iniciado sesión, permitir el acceso a la ruta solicitada
    return true;
  }
}