import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminFundacionGuard } from './Components/guards/admin-fundacion.guard';
import { ClienteGuard } from './Components/guards/cliente.guard';
import { CombinationGuardGuard } from './Components/guards/combination-guard.guard';
import { PublicGuardGuard } from './Components/guards/public-guard.guard';
import { SuperAdministradorGuard } from './Components/guards/super-administrador-guard.guard';
import { VoluntarioGuard } from './Components/guards/voluntario.guard';
import { ListMascotaComponent } from './Modules/admin-fundacion/mascotas/list-mascota/list-mascota.component';
import { RegMascotaComponent } from './Modules/admin-fundacion/mascotas/reg-mascota/reg-mascota.component';
import { PanelSeguimientoAdminComponent } from './Modules/admin-fundacion/panel-seguimiento-admin/panel-seguimiento-admin.component';
import { PanelSolicitudAdminComponent } from './Modules/admin-fundacion/panel-solicitud-admin/panel-solicitud-admin.component';
import { ListVoluntarioComponent } from './Modules/admin-fundacion/voluntario/list-voluntario/list-voluntario.component';
import { RegVoluntarioComponent } from './Modules/admin-fundacion/voluntario/reg-voluntario/reg-voluntario.component';
import { BienvenidoComponent } from './Modules/admin-super/bienvenido/bienvenido.component';
import { ListFundacioComponent } from './Modules/admin-super/list-fundacio/list-fundacio.component';
import { RegFundacionComponent } from './Modules/admin-super/reg-fundacion/reg-fundacion.component';
import { CatalgoMascotasComponent } from './Modules/cliente/catalgo-mascotas/catalgo-mascotas.component';
import { PanelSeguimientoComponent } from './Modules/cliente/panel-seguimiento/panel-seguimiento.component';
import { PanelSolicitudesComponent } from './Modules/cliente/panel-solicitudes/panel-solicitudes.component';
import { LoginComponent } from './Modules/visitantes/login/login.component';
import { WelcomeComponent } from './Modules/visitantes/welcome/welcome.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent,canActivate: [PublicGuardGuard]},
  { path: 'welcome', component: WelcomeComponent,canActivate: [PublicGuardGuard] },

  { path: 'bienvenido', component: BienvenidoComponent,},

  { path: 'register-fundacion', component: RegFundacionComponent, canActivate: [SuperAdministradorGuard]},
  { path: 'list-fundacion', component: ListFundacioComponent, canActivate: [SuperAdministradorGuard]},

  { path: 'reg-mascota', component: RegMascotaComponent,canActivate: [AdminFundacionGuard]},
  { path: 'list-mascota', component: ListMascotaComponent,canActivate: [AdminFundacionGuard] },
  { path: 'reg-voluntario', component: RegVoluntarioComponent,canActivate: [AdminFundacionGuard] },
  { path: 'list-voluntario', component: ListVoluntarioComponent,canActivate: [AdminFundacionGuard]},
  { path: 'panel-solicitudes-admin', component: PanelSolicitudAdminComponent,canActivate: [VoluntarioGuard]  },
  { path: 'panel-seguimiento-admin', component: PanelSeguimientoAdminComponent,canActivate: [VoluntarioGuard] },

  { path: 'catalogo-mascota', component: CatalgoMascotasComponent,canActivate: [ClienteGuard]  },
  { path: 'panel-solicitudes-cliente', component: PanelSolicitudesComponent,canActivate: [ClienteGuard] },
  { path: 'panel-seguimiento-cliente', component: PanelSeguimientoComponent,canActivate: [ClienteGuard] },

  {path : '', redirectTo: 'welcome', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 

}





