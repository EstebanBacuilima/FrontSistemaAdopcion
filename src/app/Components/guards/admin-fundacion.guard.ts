import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminFundacionGuard implements CanActivate {
  constructor(
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const role = localStorage.getItem('rol');
    console.log("esto se va a comparar ->" + role)
    if (role === 'ADMIN_FUDACION') {
      return true;
    } else {
      this.router.navigate(['/bienvenido']);
      return false;
    }
  }
  
}
