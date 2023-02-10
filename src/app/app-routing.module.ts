import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListMascotaComponent } from './Modules/admin-fundacion/mascotas/list-mascota/list-mascota.component';
import { RegMascotaComponent } from './Modules/admin-fundacion/mascotas/reg-mascota/reg-mascota.component';
import { PanelSeguimientoAdminComponent } from './Modules/admin-fundacion/panel-seguimiento-admin/panel-seguimiento-admin.component';
import { PanelSolicitudAdminComponent } from './Modules/admin-fundacion/panel-solicitud-admin/panel-solicitud-admin.component';
import { ReportesComponent } from './Modules/admin-fundacion/reportes/reportes.component';
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
  { path: 'login', component: LoginComponent },
  { path: 'welcome', component: WelcomeComponent },

  { path: 'bienvenido', component: BienvenidoComponent },

  { path: 'register-fundacion', component: RegFundacionComponent },
  { path: 'list-fundacion', component: ListFundacioComponent },

  { path: 'reg-mascota', component: RegMascotaComponent },
  { path: 'list-mascota', component: ListMascotaComponent },
  
  { path: 'reg-voluntario', component: RegVoluntarioComponent },
  { path: 'list-voluntario', component: ListVoluntarioComponent },
  { path: 'reportes-admin', component: ReportesComponent },
  { path: 'catalogo-mascota', component: CatalgoMascotasComponent },
  { path: 'panel-solicitudes-cliente', component: PanelSolicitudesComponent },
  { path: 'panel-seguimiento-cliente', component: PanelSeguimientoComponent },
  { path: 'panel-solicitudes-admin', component: PanelSolicitudAdminComponent },
  { path: 'panel-seguimiento-admin', component: PanelSeguimientoAdminComponent },

  {path : '', redirectTo: 'welcome', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 

}





