import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import("./login/login.component").then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadChildren: () => import("./register/register.component").then(m => m.RegisterComponent)
  },
  {
    path: 'home',
    loadChildren: () => import("./welcome/welcome.component").then(m => m.WelcomeComponent)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VisitantesRoutingModule { }
