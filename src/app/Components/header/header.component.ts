import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CargarScrpitsService } from 'src/app/cargar-scrpits.service';
import { Persona } from 'src/app/Models/Persona';
import { SolicitudAdopcion } from 'src/app/Models/SolicitudAdopcion';
import { Usuario } from 'src/app/Models/Usuario';
import { FotoService } from 'src/app/Services/imagen.service';
import { PersonaService } from 'src/app/Services/persona.service';
import { SolicitudAdopcionService } from 'src/app/Services/solicitud-adopcion.service';
import { UsuarioService } from 'src/app/Services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {


  usuario: Usuario = new Usuario;
  idUsuario: any;
  nombreUsuario: any;
  nombreFoto: any;
  nombreLogo: any;

  isSuperAdmin: boolean = false;
  isFundacionAdmin: boolean = false;
  isClient: boolean = false;
  isVoluntario: boolean = false;
  isPublico: boolean = false;
  isLogin: boolean = false;
  verficarPassword: any;



  constructor(
    private personaService: PersonaService,
    private _CargarScript: CargarScrpitsService,
    private usuarioService: UsuarioService,
    private fotoService: FotoService,
    private router: Router,
    private http: HttpClient,
    private toastrService: ToastrService,
    private solicitudAdopcionService: SolicitudAdopcionService,
  ) {
    _CargarScript.Cargar(["header"]);
  }

  ngOnInit(): void {
    this.visibleSeccion = false
    this.isPublico = true;
    this.obtenerUsuario();
    this.nombreFoto = localStorage.getItem('nameImagen');
    this.nombreLogo = localStorage.getItem('nameLogo') || "admin.png";
  }
  ngOnDestroy() {
    console.log("destruir");
  }

  openFileInput() {
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
      fileInput.click();
    }
  }

  listaSolicitudes: SolicitudAdopcion[] = [];
  solicitudes: SolicitudAdopcion = new SolicitudAdopcion();
  conteoSolicitudes: any;

  obtenerSolicitudes() {
    this.solicitudAdopcionService.getSolicitudesFundacionNotificaciones(this.idFundacion).subscribe(
      data => {
        console.log("Data Soli Header -> " + data)
        this.conteoSolicitudes = data.length
        console.log("Conteo ->" + this.conteoSolicitudes)
        this.listaSolicitudes = data.map(
          result => {
            let solicitudes = new SolicitudAdopcion;
            solicitudes = result
            return solicitudes;
          }
        );
      },
      error => (console.log("Error -> " + error))
    )
  }

  idSolicitudCao: any;

  verNotificacion(idSolicitudAdopcion: any) {
    console.log("entro a cambiar esta id -> " + idSolicitudAdopcion)
    this.solicitudAdopcionService.getPorId(idSolicitudAdopcion).subscribe(data => {
      this.solicitudes = data
      this.idSolicitudCao = this.solicitudes.idSolicitudAdopcion;
      this.solicitudes.estadoDos = true;
      this.solicitudAdopcionService.updateEstadoSolicitud(this.solicitudes, this.idSolicitudCao).subscribe(
        data => {
          console.log("Se cambio actualizo");
          this.toastrService.success('Vista nueva solicitud', 'Solicitud vista', {
            timeOut: 3000,
          });
          this.obtenerSolicitudes();
        }
      )
    }
    )
  }

  persona: Persona = new Persona;
  idFundacion: any;

  obtenerUsuario() {
    this.idUsuario = localStorage.getItem('idUsuario');
    if (this.idUsuario != '' && this.idUsuario != undefined) {
      this.usuarioService.getPorId(this.idUsuario).subscribe(
        data => {
          this.usuario = data;
          this.idFundacion = data.fundacion?.idFundacion;
          this.usuario.persona = data.persona;
          this.persona.idPersona = data.persona?.idPersona;
          this.persona.nombres = data.persona?.nombres;
          this.persona.apellidos = data.persona?.apellidos;
          this.persona.cedula = data.persona?.cedula;
          this.persona.direccion = data.persona?.direccion;
          this.persona.celular = data.persona?.celular;
          this.persona.genero = data.persona?.genero;
          this.persona.telefono = data.persona?.telefono;
          this.persona.correo = data.persona?.correo;
          this.obtenerSolicitudes();
          if (data != null) {
            this.isLogin = true;
            this.nombreUsuario = data.persona?.nombres + ' ' + data.persona?.apellidos;
            switch (this.usuario.rol) {
              case 'PUBLICO':
                this.isSuperAdmin = false;
                this.isFundacionAdmin = false;
                this.isClient = false;
                this.isVoluntario = false;
                this.isPublico = true;
                break;
              case 'CLIENTE':
                this.isSuperAdmin = false;
                this.isFundacionAdmin = false;
                this.isClient = true;
                this.isVoluntario = false;
                this.isPublico = false;
                break;
              case 'ADMIN_FUDACION':
                this.isSuperAdmin = false;
                this.isFundacionAdmin = true;
                this.isClient = false;
                this.isVoluntario = false;
                this.isPublico = false;
                break;
              case 'VOLUNTARIO':
                this.isSuperAdmin = false;
                this.isFundacionAdmin = false;
                this.isClient = false;
                this.isVoluntario = true;
                this.isPublico = false;
                break;
              case 'SUPER_ADMINISTRADOR':
                this.isSuperAdmin = true;
                this.isFundacionAdmin = false;
                this.isClient = false;
                this.isVoluntario = false;
                this.isPublico = false;
                break;
              default:
                alert('Rol desconocido');
                break;
            };

          } else {
            this.isLogin = false;
            this.nombreUsuario = 'NULL';
          }
        });
    }
  }

  usuarioRol: string = "PUBLICO";
  cerrarSesion() {
    sessionStorage.removeItem('nameImagen');
    sessionStorage.removeItem('nameLogo');
    localStorage.removeItem('idUsuario');
    localStorage.setItem('rol', String(this.usuarioRol));
    location.replace('/welcome');
  }

  imagen!: any;
  nombre_orignal_u: string = "";
  cap_nombre_archivo_u: any;
  selectedFile!: File;
  file: any = '';

  public imageSelected(event: any) {
    this.selectedFile = event.target.files[0];
    // mostrar imagen seleccionada
    this.imagen = this.selectedFile;
    const reader = new FileReader();
    reader.readAsDataURL(this.selectedFile);
    reader.onload = () => {
      this.file = reader.result;
    };
    this.cap_nombre_archivo_u = event.target.value;
    this.nombre_orignal_u = this.cap_nombre_archivo_u.slice(12);
    console.log("Nombre imagen original => " + this.nombre_orignal_u);
    this.usuario.foto_perfil = this.nombre_orignal_u;
  }

  cargarImagenUsuario() {
    this.fotoService.guararImagenes(this.selectedFile);
  }


  // ACTULIZAR PERFIL DE USUARIO
  actualizarFundacion() {
    this.usuarioService.verfUsername(this.usuario.username).subscribe(
      data => {
        if (!data) {
          this.personaService.updatePersona(this.persona, this.persona.idPersona).subscribe(data => {
            console.log(data)
            this.cargarImagenUsuario();
            this.usuarioService.updateUsuario(this.usuario, this.usuario.idUsuario).subscribe(data => {
              console.log(data)
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Perfil actualizado correctamente',
                showConfirmButton: false,
                timer: 1500
              })
            })
          })
        } else {
          this.toastrService.error('Username ya en uso', 'Digite otro username', {
            timeOut: 1000,
          });
          this.usuario.username = '';
        }
      }
    )
  }

  visibleSeccion: boolean = false;

  validarPestLogin() {
    console.log("estoy en el login")
    this.visibleSeccion = true
  }

  home() {
    console.log("estoy en el login")
    this.visibleSeccion = false
  }

}

