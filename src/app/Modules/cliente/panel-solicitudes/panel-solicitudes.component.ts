import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Fundacion } from 'src/app/Models/Fundacion';
import { Mascota } from 'src/app/Models/Mascota';
import { Pregunta } from 'src/app/Models/Pregunta';
import { Respuesta } from 'src/app/Models/Respuesta';
import { SolicitudAdopcion } from 'src/app/Models/SolicitudAdopcion';
import { Usuario } from 'src/app/Models/Usuario';
import { FundacionService } from 'src/app/Services/fundacion.service';
import { FotoService } from 'src/app/Services/imagen.service';
import { MascotaService } from 'src/app/Services/mascota.service';
import { SolicitudAdopcionService } from 'src/app/Services/solicitud-adopcion.service';
import { UsuarioService } from 'src/app/Services/usuario.service';


@Component({
  selector: 'app-panel-solicitudes',
  templateUrl: './panel-solicitudes.component.html',
  styleUrls: ['./panel-solicitudes.component.css']
})
export class PanelSolicitudesComponent implements OnInit {

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
        this.idUsuario = data.idUsuario
        this.obtenerSolicitudes();
      })
    } else {
      console.log("Usuario no encontrado => ")
    }
  }

  solicitudes: any
  obtenerSolicitudes() {
    this.solicitudAdopcionService.getSolicitudesUsuario(this.idUsuario).subscribe(
      data => {
        this.solicitudes = data
      },
      error => (console.log(error))
    )
  }

  obtenerEstado(estados: any): string {
    let estado: string = '';
    if (estados == 'A') {
      estado = 'ACEPTADO';
    } else if (estados == 'P') {
      estado = 'PENDIENTE';
    } else if (estados == 'E') {
      estado = 'EN PROCESO';
    } else if (estados == 'R') {
      estado = 'SOLICITUD RECHAZADA';
    }
    return estado;
  }

  datainicialSolicitud: any;
  capParaLitar(idSolicitudAdopcion: any) {
    this.datainicialSolicitud = idSolicitudAdopcion;
    console.log("idMascota " + idSolicitudAdopcion)
    this.obtenerRespuestasyPreguntasSolicitante();
  }

  preguntasRespuestas: any;
  obtenerRespuestasyPreguntasSolicitante() {
    this.solicitudAdopcionService.listarRespuestasPreguntasPorSolicitud(this.datainicialSolicitud).subscribe(
      data => {
        this.preguntasRespuestas = data
      },
      error => (console.log(error))
    )
  }

}
