import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CargarScrpitsService } from 'src/app/cargar-scrpits.service';
import { Persona } from 'src/app/Models/Persona';
import { Usuario } from 'src/app/Models/Usuario';
import { FotoService } from 'src/app/Services/imagen.service';
import { PersonaService } from 'src/app/Services/persona.service';
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
  nombreLogo: any ;

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
    private http: HttpClient
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


  persona: Persona = new Persona;

  obtenerUsuario() {
    this.idUsuario = localStorage.getItem('idUsuario');
    if (this.idUsuario != '' && this.idUsuario != undefined) {
      this.usuarioService.getPorId(this.idUsuario).subscribe(
        data => {
          this.usuario = data;
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
    this.personaService.updatePersona(this.persona, this.persona.idPersona).subscribe(data => {
      console.log(data)
      this.cargarImagenUsuario();
      this.usuarioService.updateUsuario(this.usuario, this.usuario.idUsuario).subscribe(data => {
        console.log(data)
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Perfil Actualizado Correctamente',
            showConfirmButton: false,
            timer: 1500
          })
      })
    })
  }

  visibleSeccion:boolean = false;

  validarPestLogin(){
    console.log("estoy en el login")
    this.visibleSeccion = true
  }

  home(){
    console.log("estoy en el login")
    this.visibleSeccion = false
  }

}

