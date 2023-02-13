import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SuperAdministradorGuard implements CanActivate {
  constructor(
    private router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const role = localStorage.getItem('rol');

    if (role === 'SUPER_ADMINISTRADOR') {
      return true;
    } else {
      this.router.navigate(['/bienvenido']);
      return false;
    }
  }
}