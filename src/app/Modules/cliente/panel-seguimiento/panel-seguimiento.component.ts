import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CargarScrpitsService } from 'src/app/cargar-scrpits.service';
import { Fundacion } from 'src/app/Models/Fundacion';
import { Mascota } from 'src/app/Models/Mascota';
import { Seguimiento } from 'src/app/Models/Seguimiento';
import { Usuario } from 'src/app/Models/Usuario';
import { FundacionService } from 'src/app/Services/fundacion.service';
import { FotoService } from 'src/app/Services/imagen.service';
import { MascotaService } from 'src/app/Services/mascota.service';
import { PersonaService } from 'src/app/Services/persona.service';
import { SeguimientoService } from 'src/app/Services/seguimiento.service';
import { SolicitudAdopcionService } from 'src/app/Services/solicitud-adopcion.service';
import { UsuarioService } from 'src/app/Services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-panel-seguimiento',
  templateUrl: './panel-seguimiento.component.html',
  styleUrls: ['./panel-seguimiento.component.css']
})
export class PanelSeguimientoComponent implements OnInit {

  loading: boolean = true;
  mascota: Mascota = new Mascota;
  fundacion: Fundacion = new Fundacion;
  usuario: Usuario = new Usuario;
  idUsuario: any;
  idFundacion: any;

  constructor(private toastrService: ToastrService,private fotoService: FotoService ,private seguimientoService: SeguimientoService, private _CargarScript: CargarScrpitsService, private solicitudService: SolicitudAdopcionService, private mascotaService: MascotaService, private fundacionService: FundacionService, private personaService: PersonaService, private usuarioService: UsuarioService, private router: Router) {
  }


  ngOnInit(): void {
    this.obtenerMasotas();
    this.obtenerUsuario();
  }

  personas: any;

  obtenerUsuario() {
    this.idUsuario = localStorage.getItem('idUsuario');
    if (this.idUsuario != '' && this.idUsuario != undefined) {
      this.usuarioService.getPorId(this.idUsuario).subscribe((data) => {
        console.log(data);
        this.usuario = data;
        this.personas = this.usuario.persona;
      })
    } else {
      console.log("Usuario no foun => ")
    }
  }


  listaMascotas: Mascota[] = [];

  obtenerMasotas() {
    this.idUsuario = localStorage.getItem('idUsuario');
    this.mascotaService.getMascotaPorUsuario(this.idUsuario).subscribe(
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


  datainicialMascota: any;

  capParaSeguimiento(idMascota: any) {
    this.datainicialMascota = idMascota;
    console.log("idMascota " + idMascota)
    this.limpiarCampos();
    this.optenerDatos();
    this.listarSeguimientosPorMasocta();
  }

  optenerDatos() {
    this.mascotaService.getPorId(this.datainicialMascota).subscribe(data => {
      this.mascota = data
      this.mascota.idMascota = this.mascota.idMascota
      this.mascota.chipMascota
      this.mascota.nombre_mascota;
      this.mascota.color;
      this.mascota.sexo;
      this.mascota.raza;
      this.mascota.especie;
      this.mascota.descripcion;
      this.mascota.estado_mascota;
      this.mascota.estado_adopcion;
      this.mascota.estado_seguimiento;
      this.mascota.foto;
    })
  }
  seguimiento: Seguimiento = new Seguimiento;
  seguimientos: any;

  realizarSeguimiento() {
    if (!this.seguimiento.descripcion_mascota || !this.seguimiento.descripcion_visita  || !this.seguimiento.estado_comportamiento  || !this.seguimiento.estado_salud) {
      this.toastrService.error('Uno o más campos vacíos', 'Verifique los campos de texto', {
        timeOut: 2000,
      });
    } else {
    let fechaPrueba: Date = new Date();
    let fechaFormateada = fechaPrueba.toISOString().substr(0,10);
    console.log("Es la fecha de hoy -> " + fechaFormateada);
    this.seguimiento.fecha_seguimiento = fechaPrueba;
    this.seguimiento.mascota = this.mascota;
    this.seguimiento.estado = true;
    this.seguimiento.foto_evidencia = this.foto_evidencia;
    this.seguimiento.estadoInforme = 'P'
    this.seguimientoService.verficarRegistro(this.datainicialMascota,fechaFormateada).subscribe(
      data => {
        this.seguimientos = data
        console.log("Data cap -> " + this.seguimientos)
        if (!data) {
          console.log("No hay datos")
          this.cargarImagenEvidencia();
          this.seguimientoService.postSeguimiento(this.seguimiento).subscribe(
            info => {
              this.toastrService.success('Seguimiento realizado con exito', 'Enviado', {
                timeOut: 1500,
              });
              this.listarSeguimientosPorMasocta();
              this.limpiarCampos();
            }
          );
        } else{
          console.log("Si hay datos")
          Swal.fire({
            icon: 'error',
            title: 'Registro del día completado',
            text: 'Ya se realizo el seguimiento diario'
          })
        }
      }
    );
    }
  }

  pageActual: number = 1;
  public myCounter: number = 0;

  listaSeguimientos: Seguimiento[] = [];
  seguimiento2: Seguimiento = new Seguimiento;

  listarSeguimientosPorMasocta(){
    this.seguimientoService.getAllSeguimientosPorMascota(this.datainicialMascota).subscribe(
      data => {
        this.listaSeguimientos = data.map(
          result => {
            this.seguimiento2 = result
            this.seguimiento2.idSeguimiento = result.idSeguimiento;
            this.seguimiento2.descripcion_mascota = result.descripcion_mascota;
            this.seguimiento2.estado_comportamiento = result.estado_comportamiento;
            this.seguimiento2.estado_salud = result.estado_salud;
            this.seguimiento2.foto_evidencia = result.foto_evidencia;
            this.seguimiento2.fecha_seguimiento = result.fecha_seguimiento;
            this.seguimiento2.estado = result.estado;
            this.seguimiento2.estadoInforme = result.estadoInforme;
            this.seguimiento2.mascota = result.mascota;
            return this.seguimiento2;
          }
        );
        this.loading = false;
      }
    )
    this.listarSeguimientosInformesPorMasocta();
  }

  listaSeguimientos3: Seguimiento[] = [];
  seguimiento3: Seguimiento = new Seguimiento;

solir: any;
  listarSeguimientosInformesPorMasocta(){
    this.seguimientoService.getAllSeguimientosInformesPorMascota(this.datainicialMascota).subscribe(
      data => {
        this.solir=data.length;
        console.log("conteo -> " + this.solir);
        this.listaSeguimientos3 = data.map(
          result => {
            this.seguimiento3 = result
            this.seguimiento3.idSeguimiento = result.idSeguimiento;
            this.seguimiento3.descripcion_mascota = result.descripcion_mascota;
            this.seguimiento3.estado_comportamiento = result.estado_comportamiento;
            this.seguimiento3.estado_salud = result.estado_salud;
            this.seguimiento3.foto_evidencia = result.foto_evidencia;
            this.seguimiento3.fecha_seguimiento = result.fecha_seguimiento;
            this.seguimiento3.estado = result.estado;
            this.seguimiento3.estadoInforme = result.estadoInforme;
            this.seguimiento3.mascota = result.mascota;
            return this.seguimiento3;
          }
        );
        this.loading = false;
      }
    )
  }

file: any;
private selectedFile!: File;
private foto_evidencia: string = '';

public async imageSelected(event: any) {
  this.selectedFile = event.target.files[0];
  this.foto_evidencia = event.target.value.slice(12);
  console.log('Nombre imagen original =>', this.foto_evidencia);
  this.seguimiento.foto_evidencia = this.foto_evidencia;
  const reader = new FileReader();
  reader.readAsDataURL(this.selectedFile);
  reader.onload = () => this.file = reader.result;
}

public cargarImagenEvidencia() {
  this.fotoService.guararImagenes(this.selectedFile);
}


limpiarCampos() {
  console.log("Entro a limpiar")
  this.seguimiento.descripcion_visita  = '';
  this.seguimiento.descripcion_mascota  = '';
  this.seguimiento.estado_comportamiento  = '';
  this.seguimiento.estado_salud  = '';
  this.file = '';
}


}
