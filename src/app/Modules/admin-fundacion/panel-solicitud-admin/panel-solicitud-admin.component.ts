import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Fundacion } from 'src/app/Models/Fundacion';
import { Mascota } from 'src/app/Models/Mascota';
import { SolicitudAdopcion } from 'src/app/Models/SolicitudAdopcion';
import { Usuario } from 'src/app/Models/Usuario';
import { FundacionService } from 'src/app/Services/fundacion.service';
import { FotoService } from 'src/app/Services/imagen.service';
import { MascotaService } from 'src/app/Services/mascota.service';
import { SolicitudAdopcionService } from 'src/app/Services/solicitud-adopcion.service';
import { UsuarioService } from 'src/app/Services/usuario.service';

@Component({
  selector: 'app-panel-solicitud-admin',
  templateUrl: './panel-solicitud-admin.component.html',
  styleUrls: ['./panel-solicitud-admin.component.css']
})
export class PanelSolicitudAdminComponent implements OnInit {

  listaSolicitudes: SolicitudAdopcion[] = [];
  loading: boolean = true;

  constructor(private solicitudAdopcionService: SolicitudAdopcionService, private mascotaService: MascotaService, private fundacionService: FundacionService, private usuarioService: UsuarioService, private router: Router, private fotoService: FotoService
  ) { }

  ngOnInit(): void {
    this.obtenerUsuario();
  }

  mascota: Mascota = new Mascota;
  fundacion: Fundacion = new Fundacion;
  usuario: Usuario = new Usuario;
  solicitud: SolicitudAdopcion = new SolicitudAdopcion;
  idUsuario: any;
  idFundacion: any;

  obtenerUsuario() {
    this.idUsuario = localStorage.getItem('idUsuario');
    if (this.idUsuario != '' && this.idUsuario != undefined) {
      this.usuarioService.getPorId(this.idUsuario).subscribe((data) => {
        console.log(data);
        this.usuario = data;
        this.idFundacion = data.fundacion?.idFundacion;
        this.obtenerSolicitudes();
      })
    } else {
      console.log("Usuario no foun => ")
    }
  }

  solicitudes: any
  obtenerSolicitudes() {
    this.solicitudAdopcionService.getSolicitudesFundacion(this.idFundacion).subscribe(
      data => {
        this.solicitudes = data
      },
      error => (console.log(error))
    )
  }

  // obtenerSolicitudes() {
  //   this.solicitudAdopcionService.getSolicitudesFundacion(this.idFundacion).subscribe(
  //     data => {
  //       this.listaSolicitudes = data.map(
  //         result => {
  //           let solicitud = new SolicitudAdopcion;
  //           this.solicitud.idSolicitudAdopcion = result.idSolicitudAdopcion;
  //           this.solicitud.fecha_solicitud_adopcion = result.fecha_solicitud_adopcion;
  //           this.solicitud.razon = result.razon;
  //           this.solicitud.descripcion = result.descripcion
  //           this.solicitud.estado = result.estado;
  //           this.usuario.foto_perfil = result.usuario?.foto_perfil;
  //           this.solicitud.usuario = result.usuario;
  //           this.solicitud.mascota = result.mascota;
  //           return solicitud;
  //         }
  //       );
  //       this.loading = false;
  //     }
  //   )
  // }
}
