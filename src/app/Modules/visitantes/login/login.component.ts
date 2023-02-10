import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CargarScrpitsService } from 'src/app/cargar-scrpits.service';
import { Fundacion } from 'src/app/Models/Fundacion';
import { Persona } from 'src/app/Models/Persona';
import { Usuario } from 'src/app/Models/Usuario';
import { FotoService } from 'src/app/Services/imagen.service';
import { PersonaService } from 'src/app/Services/persona.service';
import { UsuarioService } from 'src/app/Services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  persona: Persona = new Persona;
  usuario: Usuario = new Usuario;
  fundacion: Fundacion = new Fundacion;

  tipoUser: any;
  userFoto: any;
  fundacionLogo: any;
  nombreUsuario: any;

  constructor(
    private _CargarScript: CargarScrpitsService,
    private usuarioService: UsuarioService,
    private personaService: PersonaService,
    private router: Router,
    private fotoService: FotoService,
    private toastrService: ToastrService
  ) {
    _CargarScript.Cargar(["loginFunciones"]);
  }



  ngOnInit(): void {
    localStorage.removeItem('idUsuario');
    localStorage.removeItem('rol');
    localStorage.removeItem('nameImagen');
    localStorage.removeItem('nameLogo');
  };

  showSpinner:any;
  login() {
    if ( !this.usuario.username || !this.usuario.password) {
      this.toastrService.error('Uno o más campos vacios', 'Verifique los Campos de texto', {
        timeOut: 3000,
      });
    } else {
      this.showSpinner = true;
      this.usuarioService.login(this.usuario.username, this.usuario.password).subscribe(
        data => {
          console.log(data);
          if (data != null) {
            if (data.estado == true) {
              this.usuario.idUsuario = data.idUsuario;
              this.userFoto = data.foto_perfil;
              this.fundacionLogo = data.fundacion?.logo;
              this.toastrService.success('Bienvenido', 'Exitoso', {
                timeOut: 1500,
                'progressBar': true,
                'progressAnimation': 'increasing'
              });
              
              localStorage.setItem('rol', String(this.usuario.rol));
              localStorage.setItem('idUsuario', String(this.usuario.idUsuario));
              localStorage.setItem('nameImagen', String(this.userFoto));
              localStorage.setItem('nameLogo', String(this.fundacionLogo));
              setTimeout(() => {
                this.showSpinner = false;
                location.replace('/bienvenido');
              }, 1500);
            } else {
              console.log("Desactivo")
              this.toastrService.error('Usuario Inhabilitado', 'No tiene acceso', {
                timeOut: 3000,
              });
              this.usuario = new Usuario;
            }
          } else {
            console.log("no encontrado")
            this.toastrService.warning('Username o password incorrectos!', 'Aviso!', {
              timeOut: 4000,
            });
            this.usuario = new Usuario;
          }
          this.showSpinner = false;
        }
      )
    }
  }


  imagen!: any;
  nombre_orignal_u: string = "";
  cap_nombre_archivo_u: any;
  selectedFiles!: File;
  file: any = '';

  public imageSelected(event: any) {
    this.selectedFiles = event.target.files[0];
    // mostrar imagen seleccionada
    this.imagen = this.selectedFiles;
    const reader = new FileReader();
    reader.readAsDataURL(this.selectedFiles);
    reader.onload = () => {
      this.file = reader.result;
    };
    this.cap_nombre_archivo_u = event.target.value;
    this.nombre_orignal_u = this.cap_nombre_archivo_u.slice(12);
    console.log("Nombre imagen original => " + this.nombre_orignal_u);
    this.usuario.foto_perfil = this.nombre_orignal_u;
  }

  cargarImagenUsuario() {
    this.fotoService.guararImagenes(this.selectedFiles);
  }


  // REGISTRARSE //

  verficarPassword: any;

  registrarUsuario() {

    if (this.verficarPassword == this.usuario.password) {

      if (this.persona.nombres === '' || this.persona.apellidos === '' || this.persona.correo === '' || this.usuario.username === '' || this.usuario.password === ''
        || this.persona.nombres === null || this.persona.apellidos === null || this.persona.correo === null || this.usuario.username === null || this.usuario.password === null) {
        Swal.fire({
          icon: 'error',
          title: 'Verifique los Campos!'
        })
      } else {
        this.usuarioService.verfUsername(this.usuario.username).subscribe(
          data => {
            if (!data) {
              this.personaService.postPersona(this.persona).subscribe(
                data => {
                  console.log(data);
                  this.persona.idPersona = data.idPersona;
                  this.persona = data;
                  this.usuario.persona = this.persona;
                  // this.usuario.fundacion = this.fundacion;
                  this.usuario.estado = true;
                  this.usuario.rol = "CLIENTE";
                  this.cargarImagenUsuario();
                  this.usuarioService.postUsuario(this.usuario).subscribe(
                    result => {
                      console.log(result);
                      this.usuario = result;
                      Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Registrado Exitosamente',
                        showConfirmButton: false,
                        timer: 1500
                      })
                      location.replace('/login');
                    }
                  )
                }
              )
            } else {
              Swal.fire({
                icon: 'error',
                title: 'El username que eligio ya está en uso!',
                text: 'Cambie su username'
              })
              this.usuario.username = '';
            }
          }
        )
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Contraseñas son distintas!',
        text: 'Verifique su contraseña'
      })
    }

  }

}
