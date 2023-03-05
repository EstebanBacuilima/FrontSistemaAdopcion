import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './Components/footer/footer.component';
import { HeaderComponent } from './Components/header/header.component';
import { LoginComponent } from './Modules/visitantes/login/login.component';
import { WelcomeComponent } from './Modules/visitantes/welcome/welcome.component';
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
import { CatalgoMascotasComponent } from './Modules/cliente/catalgo-mascotas/catalgo-mascotas.component';
import { PanelSolicitudesComponent } from './Modules/cliente/panel-solicitudes/panel-solicitudes.component';
import { PanelSeguimientoComponent } from './Modules/cliente/panel-seguimiento/panel-seguimiento.component';
import { PanelSolicitudAdminComponent } from './Modules/admin-fundacion/panel-solicitud-admin/panel-solicitud-admin.component';
import { PanelSeguimientoAdminComponent } from './Modules/admin-fundacion/panel-seguimiento-admin/panel-seguimiento-admin.component';
// NUEVOS
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


// PRIMENG
import {InputMaskModule} from 'primeng/inputmask';
import {KeyFilterModule } from 'primeng/keyfilter';
import {PasswordModule } from 'primeng/password';
import {InputTextModule} from 'primeng/inputtext';
import {DropdownModule} from 'primeng/dropdown';
import {MatTabsModule} from '@angular/material/tabs';
import {CalendarModule} from 'primeng/calendar';
import {BadgeModule} from 'primeng/badge';

//PDF
import { PdfMakeWrapper } from 'pdfmake-wrapper';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { FiltradoFechasPipe } from './Components/Pipes/filtrado-fechas.pipe';
import { FiltroMascotasPipe } from './Components/Pipes/filtro-mascotas.pipe';
PdfMakeWrapper.setFonts(pdfFonts);



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
    CatalgoMascotasComponent,
    PanelSolicitudesComponent,
    PanelSeguimientoComponent,
    PanelSeguimientoAdminComponent,
    PanelSolicitudAdminComponent,
    FiltradoFechasPipe,
    FiltroMascotasPipe,
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgxPaginationModule,
    CommonModule,
    // PRIME
    InputMaskModule,
    PasswordModule,
    KeyFilterModule,
    InputTextModule,
    DropdownModule,
    MatTabsModule,
    CalendarModule,
    ReactiveFormsModule,
    BadgeModule
  ],
  providers: [
    CargarScrpitsService
  ],
  bootstrap: [AppComponent
  ],
  schemas: [ 
    CUSTOM_ELEMENTS_SCHEMA 
  ]

})


export class AppModule { }
