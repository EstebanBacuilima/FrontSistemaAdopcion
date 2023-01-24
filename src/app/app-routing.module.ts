import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Modules/visitantes/login/login.component';
import { WelcomeComponent } from './Modules/visitantes/welcome/welcome.component';
import { ListadoMascotasComponent } from './Modules/visitantes/listado-mascotas/listado-mascotas.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'list_mascotas', component: ListadoMascotasComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 

}
