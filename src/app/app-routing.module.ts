import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'sup-admin',
    loadChildren: () => import('./Modules/super-admin/super-admin.module').then(m => m.SuperAdminModule) 
  },
  {
    path: 'admin-fundacion',
    loadChildren: () => import('./Modules/admin-fundacion/admin-fundacion.module').then(m => m.AdminFundacionModule) 
  },
  {
    path: 'clientes',
    loadChildren: () => import('./Modules/cliente/cliente.module').then(m => m.ClienteModule) 

  },
  {
    path: 'visitantes',
    loadChildren: () => import('./Modules/cliente/cliente.module').then(m => m.ClienteModule) 
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 

}
