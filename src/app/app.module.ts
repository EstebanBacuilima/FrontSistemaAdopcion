import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './Components/footer/footer.component';
import { HeaderComponent } from './Components/header/header.component';
import { LoginComponent } from './Modules/visitantes/login/login.component';
import { WelcomeComponent } from './Modules/visitantes/welcome/welcome.component';
import { ListadoMascotasComponent } from './Modules/visitantes/listado-mascotas/listado-mascotas.component';
import { KeyFilterModule } from 'primeng/keyfilter';
import { PasswordModule } from 'primeng/password';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 

// CARGAR EL JS
import { CargarScrpitsService } from './cargar-scrpits.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    LoginComponent,
    WelcomeComponent,
    ListadoMascotasComponent
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
    BrowserAnimationsModule
  ],
  providers: [
    CargarScrpitsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
