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
import Swal from 'sweetalert2';

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

  obtenerEstado(estados: any): string {
    //console.log("El estado ->" + estados);
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
    console.log("idSolicitud " + idSolicitudAdopcion)
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


  // OPCIONES //

  aceptarSolicitud() {
    this.solicitudAdopcionService.getPorId(this.datainicialSolicitud).subscribe(data => {
      this.solicitud = data
      this.idSolicitud = this.solicitud.idSolicitudAdopcion;
      this.isMascotaCap = this.solicitud.mascota?.idMascota;
      this.idUsuarioCap = this.solicitud.usuario?.idUsuario
      this.mascotaService.getPorId(this.isMascotaCap).subscribe(dataP => {
        this.mascota = dataP
        this.usuarioService.getPorId(this.idUsuarioCap).subscribe(dataU => {
          this.usuario = dataU
          this.solicitud.estado = 'A';
          this.mascota.estado_adopcion = false;
          this.solicitud.mascota = this.mascota;
          this.solicitud.usuario = this.usuario;
          console.log("Estado mascota adopcion antes " + this.idSolicitud);
          this.solicitudAdopcionService.updateEstadoSolicitud(this.solicitud, this.idSolicitud).subscribe(
            data => {
              console.log("Estado mascota adopcion antes " + data.mascota?.estado_adopcion);
              this.mascotaService.updateEstadoAdopcion(this.mascota, this.mascota.idMascota).subscribe(
                dataM => {
                  console.log("Se cambio a " + dataM.estado_adopcion);
                  this.mascota = dataM
                  this.mascota.usuario = this.usuario
                  this.mascotaService.updateDueñoMascota(this.mascota, this.mascota.idMascota).subscribe(
                    dataMD => {
                      console.log("Cambio de dueño")
                      Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Solicitud Aceptada',
                        showConfirmButton: false,
                        timer: 1500
                      })
                    }
                  )
                }
              )
            }
          )
        })
      })
    })
  }

  enEsperaSolicitud() {
    this.solicitudAdopcionService.getPorId(this.datainicialSolicitud).subscribe(
      result => {
        if (result) {
          this.solicitud = result;
          this.solicitud.estado = 'E';
          this.idSolicitud = this.solicitud.idSolicitudAdopcion
          this.solicitudAdopcionService.updateEstadoSolicitud(this.solicitud, this.idSolicitud).subscribe(
            data => {
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Solicitud Puesta en Espera',
                timer: 1500
              })
            },
            error => (console.log(error))
          )
        } else {
          console.log("no hay esa solicitud")
        }
      },
      error => (console.log(error))
    )
  }

  idSolicitud: any;
  idUsuarioCap: any;
  isMascotaCap: any;

  rechazarSolicitud() {
    this.solicitudAdopcionService.getPorId(this.datainicialSolicitud).subscribe(data => {
      this.solicitud = data
      this.idSolicitud = this.solicitud.idSolicitudAdopcion;
      this.isMascotaCap = this.solicitud.mascota?.idMascota;
      this.idUsuarioCap = this.solicitud.usuario?.idUsuario
      this.mascotaService.getPorId(this.isMascotaCap).subscribe(dataP => {
        this.mascota = dataP
        this.usuarioService.getPorId(this.idUsuarioCap).subscribe(dataU => {
          this.usuario = dataU
          this.solicitud.estado = 'R';
          this.mascota.estado_adopcion = true;
          this.solicitud.mascota = this.mascota;
          this.solicitud.usuario = this.usuario;
          console.log("Estado mascota adopcion antes " + this.idSolicitud);
          this.solicitudAdopcionService.updateEstadoSolicitud(this.solicitud, this.idSolicitud).subscribe(
            data => {
              console.log("Estado mascota adopcion antes " + data.mascota?.estado_adopcion);
              this.mascotaService.updateEstadoAdopcion(this.mascota, this.mascota.idMascota).subscribe(
                data => {
                  console.log("Se cambio a " + data.estado_adopcion);
                  Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    text: 'Solicitud Rechazada',
                    timer: 1500
                  })
                }
              )
            }
          )
        })
      })
    })
  }


  // obtenerRespuestasyPreguntasSolicitante() {
  //   this.solicitudAdopcionService.listarRespuestasPreguntasPorSolicitud(this.datainicialSolicitud).subscribe(
  //     data => {
  //     this.preguntasRespuestas = data.map(
  //         result => {
  //           let respuesta = new Respuesta;
  //           respuesta.idRespuesta = result.idRespuesta;
  //           respuesta.respuestas = result.respuestas;
  //           //respuesta.pregunta = result.pregunta;
  //           return respuesta;
  //         }
  //       );
  //     },
  //     error => (console.log(error))
  //   )
  // }

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