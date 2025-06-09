import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { GlobalService } from '../services/global.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private globalService: GlobalService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    const userType = localStorage.getItem('userType');
    if (userType) {
      // Si el usuario ya ha iniciado sesión, redirigirlo a su página correspondiente
      this.router.navigate(['/' + userType]);
      return false;
    }
    // Si no ha iniciado sesión, permitir el acceso a la página de login
    return true;
  }
}