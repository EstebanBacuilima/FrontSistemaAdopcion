import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CargarScrpitsService } from 'src/app/cargar-scrpits.service';
import { Fundacion } from 'src/app/Models/Fundacion';
import { Mascota } from 'src/app/Models/Mascota';
import { Seguimiento } from 'src/app/Models/Seguimiento';
import { SolicitudAdopcion } from 'src/app/Models/SolicitudAdopcion';
import { Usuario } from 'src/app/Models/Usuario';
import { FundacionService } from 'src/app/Services/fundacion.service';
import { FotoService } from 'src/app/Services/imagen.service';
import { MascotaService } from 'src/app/Services/mascota.service';
import { PersonaService } from 'src/app/Services/persona.service';
import { SeguimientoService } from 'src/app/Services/seguimiento.service';
import { SolicitudAdopcionService } from 'src/app/Services/solicitud-adopcion.service';
import { UsuarioService } from 'src/app/Services/usuario.service';

@Component({
  selector: 'app-panel-seguimiento-admin',
  templateUrl: './panel-seguimiento-admin.component.html',
  styleUrls: ['./panel-seguimiento-admin.component.css']
})
export class PanelSeguimientoAdminComponent implements OnInit {

  loading: boolean = true;
  mascota: Mascota = new Mascota;
  fundacion: Fundacion = new Fundacion;
  usuario: Usuario = new Usuario;
  idUsuario: any;
  idFundacion: any;

  constructor(private toastrService: ToastrService, private fotoService: FotoService, private solicitudAdopcionService: SolicitudAdopcionService, private seguimientoService: SeguimientoService, private _CargarScript: CargarScrpitsService, private solicitudService: SolicitudAdopcionService, private mascotaService: MascotaService, private fundacionService: FundacionService, private personaService: PersonaService, private usuarioService: UsuarioService, private router: Router) {
  }

  ngOnInit(): void {
    this.obtenerUsuario();
  }

  personas: any;
  //Validacio de Caracteres
  letrasEspeciales: RegExp = /^[a-zA-Z0-9\s.,]+$/;
  validarCaracteresEspeciales(event: KeyboardEvent) {
    const pattern = /^[a-zA-Z0-9]*$/;
    const inputChar = String.fromCharCode(event.keyCode);

    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  obtenerUsuario() {
    this.idUsuario = localStorage.getItem('idUsuario');
    if (this.idUsuario != '' && this.idUsuario != undefined) {
      this.usuarioService.getPorId(this.idUsuario).subscribe((data) => {
        console.log(data);
        this.usuario = data;
        this.personas = this.usuario.persona;
        this.idFundacion = data.fundacion?.idFundacion;
        this.obtenerMasotas();
      })
    } else {
      console.log("Usuario no encontrado => ")
    }
  }


  listaMascotas: Mascota[] = [];

  obtenerMasotas() {
    this.mascotaService.getAllMascotasEnSeguimiento(this.idFundacion).subscribe(
      data => {
        this.listaMascotas = data.map(
          result => {
            let mascota = new Mascota;
            mascota.idMascota = result.idMascota;
            mascota.chipMascota = result.chipMascota;
            mascota.nombre_mascota = result.nombre_mascota;
            mascota.color = result.color
            mascota.sexo = result.sexo;
            mascota.raza = result.raza;
            mascota.foto = result.foto;
            mascota.especie = result.especie;
            mascota.descripcion = result.descripcion;
            mascota.estado_mascota = result.estado_mascota;
            mascota.estado_adopcion = result.estado_adopcion;
            return mascota;
          }
        );
        this.loading = false;
      }
    )
  }

  // APROBAR SEGUIMIENTO
  datainicialSeguimiento: any;

  capParaAprobarSeguimiento(idSeguimiento: any) {
    this.datainicialSeguimiento = idSeguimiento;
    console.log("idSeguimiento " + idSeguimiento)
    this.optenerDatosSeguimiento();
  }

  optenerDatosSeguimiento() {
    this.seguimientoService.getPorId(this.datainicialSeguimiento).subscribe(
      result => {
        this.seguimiento = result
        this.seguimiento.idSeguimiento = result.idSeguimiento;
        this.seguimiento.descripcion_mascota = result.descripcion_mascota;
        this.seguimiento.estado_comportamiento = result.estado_comportamiento;
        this.seguimiento.estado_salud = result.estado_salud;
        this.seguimiento.foto_evidencia = result.foto_evidencia;
        this.seguimiento.fecha_seguimiento = result.fecha_seguimiento;
        this.seguimiento.estado = result.estado;
        this.seguimiento.estadoInforme = result.estadoInforme;
        this.seguimiento.mascota = result.mascota;
      })
  }

  actualizarEstadoSeguimiento() {
    this.seguimiento.estado = true;
    this.seguimiento.estadoInforme = 'A';
    this.seguimientoService.updateEstadoSeguimiento(this.seguimiento, this.seguimiento.idSeguimiento).subscribe(data => {
      console.log(data)
      this.toastrService.success('Seguimiento Aprobado', '', {
        timeOut: 1500,
      });
      this.optenerDatosSeguimiento();
      this.listarSeguimientosPorMasocta();
      this.listarSeguimientosInformesPorMasocta();
    })
  }

  actualizarEstadoSeguimientoRechazado() {
    this.seguimiento.estado = true;
    this.seguimiento.estadoInforme = 'R';
    this.seguimientoService.updateEstadoSeguimiento(this.seguimiento, this.seguimiento.idSeguimiento).subscribe(data => {
      console.log(data)
      this.toastrService.error('Seguimiento Rechazado', '', {
        timeOut: 1500,
      });
      this.optenerDatosSeguimiento();
      this.listarSeguimientosPorMasocta();
      this.listarSeguimientosInformesPorMasocta();
    })
  }
  //


  datainicialMascota: any;

  capParaSeguimiento(idMascota: any) {
    this.datainicialMascota = idMascota;
    console.log("idMascota " + idMascota)
    this.listarSeguimientosPorMasocta();
    this.listarSeguimientosInformesPorMasocta();
  }

  seguimiento: Seguimiento = new Seguimiento;
  pageActual: number = 1;
  public myCounter: number = 0;
  listaSeguimientos: Seguimiento[] = [];

  listarSeguimientosPorMasocta() {
    this.seguimientoService.getAllSeguimientosPorMascota(this.datainicialMascota).subscribe(
      data => {
        this.listaSeguimientos = data.map(
          result => {
            this.seguimiento = result
            this.seguimiento.idSeguimiento = result.idSeguimiento;
            this.seguimiento.descripcion_mascota = result.descripcion_mascota;
            this.seguimiento.estado_comportamiento = result.estado_comportamiento;
            this.seguimiento.estado_salud = result.estado_salud;
            this.seguimiento.foto_evidencia = result.foto_evidencia;
            this.seguimiento.fecha_seguimiento = result.fecha_seguimiento;
            this.seguimiento.estado = result.estado;
            this.seguimiento.mascota = result.mascota;
            return this.seguimiento;
          }
        );
        this.loading = false;
      }
    )
  }

  // INVALIDAR ADOPCION
  listaSeguimientos3: Seguimiento[] = [];
  seguimiento3: Seguimiento = new Seguimiento;

  conteoMalas: any;
  listarSeguimientosInformesPorMasocta() {
    this.seguimientoService.getAllSeguimientosInformesPorMascota(this.datainicialMascota).subscribe(
      data => {
        this.conteoMalas = data.length;
        console.log("conteo malas-> " + this.conteoMalas);
      }
    )
  }

  capIdDueñoFundacion: any;
  capIdDueñoActual: any;
  solicitud: SolicitudAdopcion = new SolicitudAdopcion;
  idSolicitudCap: any;
  idSeguimiento: any;
  listaSolicitudInvalidados: SolicitudAdopcion[] = [];
  listaSeguimientosInvalidados: Seguimiento[] = [];
  solicitudAdopcion: SolicitudAdopcion = new SolicitudAdopcion;

  invalidarAdopcionDeMascota() {
    this.mascotaService.getPorId(this.datainicialMascota).subscribe(dataP => {
      this.mascota = dataP
      this.capIdDueñoActual = this.mascota.usuario?.idUsuario;
      console.log("DUEÑO ACTUAL ->" + this.capIdDueñoActual)
      this.seguimientoService.getAllSeguimientosPorMascota(this.datainicialMascota).subscribe(
        dataSM => {
          this.listaSeguimientosInvalidados = dataSM.map(
            result => {
              this.seguimiento = result;
              this.seguimiento = this.seguimiento;
              this.idSeguimiento = this.seguimiento.idSeguimiento;
              return this.seguimiento;
            }
          );
          this.listaSeguimientosInvalidados.forEach((seg: Seguimiento) => {
            seg.estado = false;
            this.seguimientoService.updateEstadoSeguimiento(seg, seg.idSeguimiento).subscribe();
          });
          console.log("Cambio los estados de seguimiento ->")
          this.solicitudAdopcionService.getSolicitudesUsuarioAndMascota(this.datainicialMascota, this.capIdDueñoActual).subscribe(
            dataSL => {
              this.listaSolicitudInvalidados = dataSL.map(
                result => {
                  this.solicitudAdopcion = result;
                  this.solicitudAdopcion = this.solicitudAdopcion;
                  this.idSolicitudCap = result.idSolicitudAdopcion;
                  return this.solicitudAdopcion;
                }
              );
              console.log("id de la soli " + this.idSolicitudCap)
              this.listaSolicitudInvalidados.forEach((solicitud: SolicitudAdopcion) => { 
                solicitud.estado = 'Q';
                this.solicitudAdopcionService.updateEstadoSolicitud(solicitud,solicitud.idSolicitudAdopcion).subscribe();
              })
              // this.solicitudAdopcion.estado = 'RR';
              // console.log("es la id DOSS -> " + this.solicitudAdopcion.idSolicitudAdopcion)
              // this.solicitudAdopcionService.updateEstadoSolicitud(this.idSolicitudCap, this.solicitudAdopcion).subscribe(
              //   dataUSI => {
              //   })
            })

          this.capIdDueñoFundacion = this.mascota.fundacion?.persona.idPersona;
          this.usuarioService.getPorIdPersona(this.capIdDueñoFundacion).subscribe(dataU => {
            this.usuario = dataU
            this.mascota.estado_adopcion = true;
            this.mascota.estado_seguimiento = false;
            console.log("Dueño de la fundacion -> " + this.capIdDueñoFundacion);
            this.mascotaService.updateEstadoAdopcion(this.mascota, this.mascota.idMascota).subscribe(
              dataM => {
                console.log("Se cambio a " + dataM.estado_adopcion);
                this.mascota = dataM
                this.mascota.usuario = this.usuario
                this.mascotaService.updateDueñoMascota(this.mascota, this.mascota.idMascota).subscribe(
                  dataMD => {
                    console.log("Volvio a la fundacion la mascota")
                    this.toastrService.error('Se realizo la invalidación de esta adopción', 'Invalidacion de Adopción', {
                      timeOut: 2000,
                    });
                    this.obtenerUsuario();
                  })
              })
          })
        })
    })
  }

  limpiarCampos() {
    console.log("Entro a limpiar")
    this.seguimiento.descripcion_visita = '';
    this.seguimiento.descripcion_mascota = '';
    this.seguimiento.estado_comportamiento = '';
    this.seguimiento.estado_salud = '';
  }


  // ANTERIOR SOLO FALTABA LA SOLICITUD
  /*invalidarAdopcionDeMascota() {
    this.mascotaService.getPorId(this.datainicialMascota).subscribe(dataP => {
      this.mascota = dataP
      this.capIdDueñoActual = this.mascota.usuario?.idUsuario;
      console.log("DUEÑO ACTUAL ->" + this.capIdDueñoActual)
      this.seguimientoService.getAllSeguimientosPorMascota(this.datainicialMascota).subscribe(
        dataSM =>{
          this.listaSeguimientosInvalidados = dataSM.map(
                  result => {
                    this.seguimiento = result;
                    this.seguimiento = this.seguimiento;
                    return this.seguimiento;
                  }
                );
      // this.solicitudAdopcionService.getSolicitudesUsuarioDos(this.capIdDueñoActual).subscribe(
      //   dataS => {
      //     this.listaSeguimientosInvalidados = dataS.map(
      //       result => {
      //         this.solicitud = result;
      //         this.solicitud = this.solicitud;
      //         return this.solicitud;
      //       }
      //     );
      //     this.idSolicitud = this.solicitud.idSolicitudAdopcion;
      //     this.solicitud.estado = 'RR';
      //     console.log("id solicitud -> " + this.idSolicitud)
      //     this.solicitudAdopcionService.updateEstadoSolicitud(this.solicitud, this.idSolicitud).subscribe(
      //       dataUs => {
              this.capIdDueñoFundacion = this.mascota.fundacion?.persona.idPersona;
              this.usuarioService.getPorIdPersona(this.capIdDueñoFundacion).subscribe(dataU => {
                this.usuario = dataU
                this.mascota.estado_adopcion = true;
                this.mascota.estado_seguimiento = false;
                console.log("Dueño de la fundacion -> " + this.capIdDueñoFundacion);
                this.mascotaService.updateEstadoAdopcion(this.mascota, this.mascota.idMascota).subscribe(
                  dataM => {
                    console.log("Se cambio a " + dataM.estado_adopcion);
                    this.mascota = dataM
                    this.mascota.usuario = this.usuario
                    this.mascotaService.updateDueñoMascota(this.mascota, this.mascota.idMascota).subscribe(
                      dataMD => {
                        console.log("Volvio a la fundacion la mascota")
                        this.toastrService.error('Se realizo la invalidación de esta adopción', 'Invalidacion de Adopción', {
                          timeOut: 2000,
                        });
                        this.obtenerUsuario();
                      })
                  })
              })
            })
        })
    //     })
    // })
  }*/
}
