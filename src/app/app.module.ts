import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './Components/footer/footer.component';
import { HeaderComponent } from './Components/header/header.component';
import { BienvenidoComponent } from './Modules/bienvenido/bienvenido.component';
import { WelcomeComponent } from './Modules/Visitante/welcome/welcome.component';
import { ListMascotasComponent } from './Modules/Visitante/list-mascotas/list-mascotas.component';
import { ListFundacionesComponent } from './Modules/Visitante/list-fundaciones/list-fundaciones.component';
import { LoginComponent } from './Modules/Visitante/login/login.component';
import { RegisterComponent } from './Modules/Visitante/register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    BienvenidoComponent,
    WelcomeComponent,
    ListMascotasComponent,
    ListFundacionesComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
