import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AdminFundacionGuard } from './admin-fundacion.guard';
import { ClienteGuard } from './cliente.guard';
import { SuperAdministradorGuard } from './super-administrador-guard.guard';
import { VoluntarioGuard } from './voluntario.guard';

@Injectable({
  providedIn: 'root'
})
export class CombinationGuardGuard implements CanActivate {
  constructor( private router: Router, private superAdministradorGuard: SuperAdministradorGuard, private voluntarioGuard: VoluntarioGuard, private clienteGuard: ClienteGuard, private adminFundacionGuard: AdminFundacionGuard) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.superAdministradorGuard.canActivate(route,state) || this.voluntarioGuard.canActivate(route,state) || this.clienteGuard.canActivate(route,state)|| this.adminFundacionGuard.canActivate(route,state)) {
      this.router.navigate(['/welcome']);
      return false;
    } else {
      this.router.navigate(['/bienvenido']);
      return true;
    }
  }
}
