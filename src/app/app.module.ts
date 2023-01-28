import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './Components/footer/footer.component';
import { HeaderComponent } from './Components/header/header.component';
import { LoginComponent } from './Modules/visitantes/login/login.component';
import { WelcomeComponent } from './Modules/visitantes/welcome/welcome.component';
import { KeyFilterModule } from 'primeng/keyfilter';
import { PasswordModule } from 'primeng/password';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { RegFundacionComponent } from './Modules/admin-super/reg-fundacion/reg-fundacion.component';
import { BienvenidoComponent } from './Modules/admin-super/bienvenido/bienvenido.component';
import { RegMascotaComponent } from './Modules/admin-fundacion/mascotas/reg-mascota/reg-mascota.component';
import { ListMascotaComponent } from './Modules/admin-fundacion/mascotas/list-mascota/list-mascota.component';
import { RegVoluntarioComponent } from './Modules/admin-fundacion/voluntario/reg-voluntario/reg-voluntario.component';
import { ListVoluntarioComponent } from './Modules/admin-fundacion/voluntario/list-voluntario/list-voluntario.component';
// CARGAR EL JS
import { CargarScrpitsService } from './cargar-scrpits.service';
// PAGINACION
import {NgxPaginationModule} from 'ngx-pagination';
import { ListFundacioComponent } from './Modules/admin-super/list-fundacio/list-fundacio.component';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    LoginComponent,
    WelcomeComponent,
    BienvenidoComponent,
    RegFundacionComponent,
    RegMascotaComponent,
    ListMascotaComponent,
    RegVoluntarioComponent,
    ListVoluntarioComponent,
    ListFundacioComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ToastrModule.forRoot(),
    KeyFilterModule,
    PasswordModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgxPaginationModule,
    CommonModule
  ],
  providers: [
    CargarScrpitsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
