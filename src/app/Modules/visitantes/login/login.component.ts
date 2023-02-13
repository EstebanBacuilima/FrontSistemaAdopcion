import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CargarScrpitsService } from 'src/app/cargar-scrpits.service';
import { Fundacion } from 'src/app/Models/Fundacion';
import { Persona } from 'src/app/Models/Persona';
import { Usuario } from 'src/app/Models/Usuario';
import { FotoService } from 'src/app/Services/imagen.service';
import { PersonaService } from 'src/app/Services/persona.service';
import { UsuarioService } from 'src/app/Services/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  //VALIDACIONES

  // MAYUSCULAS
  formatInput(model: any) {
    model = model.toUpperCase();
  }

  // letras y espacios
  letrasEspace: RegExp = /^[a-zA-Z\s]+$/;
  letrasEspaceNumbers: RegExp = /^[a-zA-Z0-9\s]+$/;
  expCorreo: RegExp = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
  valCorreo: boolean = true;
  verfCorreo: string = '';

  validarCorreo() {
    this.valCorreo = this.expCorreo.test(this.persona.correo!);
    if (this.valCorreo) {
      console.log("Correo Bueno");
      // this.verfCorreo = 'form-control is-valid';
    } else {
      this.verfCorreo = 'ng-invalid ng-dirty';
      console.log("Correo malo");
    }
  }
  //

  generos: string[] = [
    'Masculino', 'Femenino', 'Otro'
  ];


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

  usuarioRol: string = "PUBLICO";

  ngOnInit(): void {
    localStorage.removeItem('idUsuario');
    localStorage.removeItem('nameImagen');
    localStorage.removeItem('nameLogo');
    localStorage.setItem('rol', String(this.usuarioRol));
    console.log("ROL ->" + localStorage.getItem('rol'))
  };

  showSpinner: any;
  usuarioRolCapturado: any;
  login() {
    if (!this.usuario.username || !this.usuario.password) {
      this.toastrService.error('Uno o más campos vacios', 'Verifique los Campos de texto', {
        timeOut: 3000,
      });
    } else {
      this.showSpinner = true;
      this.usuarioService.login(this.usuario.username, this.usuario.password).subscribe(
        data => {
          console.log(data);
          if (data != null) {
            if (data == null) {
              this.toastrService.warning('Usuario deshabilitado!', 'Aviso!', {
                timeOut: 4000,
              });
            } else {
              if (data.estado == true) {
                this.usuario.idUsuario = data.idUsuario;
                this.userFoto = data.foto_perfil;
                this.fundacionLogo = data.fundacion?.logo;
                this.usuarioRolCapturado = data.rol;
                this.toastrService.success('Bienvenido', 'Exitoso', {
                  timeOut: 1500,
                  'progressBar': true,
                  'progressAnimation': 'increasing'
                });
                localStorage.setItem('rol', String(this.usuarioRolCapturado));
                localStorage.setItem('idUsuario', String(this.usuario.idUsuario));
                localStorage.setItem('nameImagen', String(this.userFoto));
                localStorage.setItem('nameLogo', String(this.fundacionLogo));
                console.log("ROL CAPTURADO ->" + String(this.usuarioRolCapturado))
                console.log("CAMBIO DE ROL ->" + localStorage.getItem('rol'))
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
      if (!this.persona.nombres || !this.persona.apellidos || !this.persona.correo || !this.usuario.username || !this.usuario.password
        || !this.persona.fechaNacimiento || !this.persona.telefono || !this.persona.celular || !this.usuario.username || !this.verficarPassword) {
        this.toastrService.error('Uno o más campos vacios', 'Verifique los Campos de texto', {
          timeOut: 3000,
        });
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
                      this.toastrService.success('Registrado Exitosamente', 'Bienvenido ', {
                        timeOut: 1000,
                      });
                      this.limpiarCampos();
                      this. closeModal();
                      location.replace('/login');
                    }
                  )
                }
              )
            } else {
              this.toastrService.error('Username ya en uso', 'Digite otro username', {
                timeOut: 3000,
              });
              this.usuario.username = '';
            }
          }
        )
      }
    } else {
      this.toastrService.error('No son similares', 'Verifique su contraseña', {
        timeOut: 3000,
      });
    }
  }

  limpiarCampos(){
    this.persona.cedula = '';
    this.persona.correo = '';
    this.persona.genero = '';
    this.persona.fechaNacimiento = new Date;
    this.persona.direccion = '';
    this.persona.nombres = '';
    this.persona.apellidos = '';
    this.persona.telefono = '';
    this.usuario.username = '';
    this.usuario.password = '';
    this.verficarPassword = '';
    this.file = '';
  }

  closeModal() {
    let modal = document.getElementById('exampleModal');
    if (modal) {
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
      let backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove();
      }
    }
  }

}
