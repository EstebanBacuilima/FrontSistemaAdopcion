import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegFundacionComponent } from './Modules/admin-fundacion/reg-fundacion/reg-fundacion.component';
import { LoginComponent } from './Modules/visitantes/login/login.component';
import { WelcomeComponent } from './Modules/visitantes/welcome/welcome.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'welcome', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 

}

