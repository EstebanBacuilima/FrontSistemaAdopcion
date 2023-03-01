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
// NUEVOS
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';

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
  expCorreo: RegExp =
    /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
  valCorreo: boolean = true;
  verfCorreo: string = '';

  validarCorreo() {
    this.valCorreo = this.expCorreo.test(this.persona.correo!);
    if (this.valCorreo) {
      console.log('Correo bueno');
      // this.verfCorreo = 'form-control is-valid';
    } else {
      // this.verfCorreo = 'ng-invalid ng-dirty';
      console.log('Correo malo');
    }
  }
  //

  generos: string[] = ['Masculino', 'Femenino', 'Otro'];

  persona: Persona = new Persona();
  usuario: Usuario = new Usuario();
  fundacion: Fundacion = new Fundacion();

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
    this.ValidarCampos();
    _CargarScript.Cargar(["loginFunciones"]);
  }

  usuarioRol: string = 'PUBLICO';

  ngOnInit(): void {
    localStorage.removeItem('idUsuario');
    localStorage.removeItem('nameImagen');
    localStorage.removeItem('nameLogo');
    localStorage.setItem('rol', String(this.usuarioRol));
    console.log('ROL ->' + localStorage.getItem('rol'));
  }

  edad: any;
  validarEdad: boolean = false;

  calcularEdad() {
    let fechaPrueba: any = this.persona.fechaNacimiento;
    let fechaFormateada = fechaPrueba.toISOString().substr(0, 10);
    let anio = parseInt(fechaFormateada.substr(0, 4));
    console.log('fecha formateada ->' + fechaFormateada);
    console.log('año elejido ->' + anio);
    let fechaHoy: Date = new Date();
    let fechaFormateadaHoy = fechaHoy.toISOString().substr(0, 10);
    let anioA = parseInt(fechaFormateadaHoy.substr(0, 4));
    console.log('año actual ->' + anioA);
    let edad = anioA - anio;
    console.log('Edad:' + edad);
    if (edad < 18) {
      this.toastrService.error(
        'Prohibido el registro',
        'Usted es menor de edad',
        {
          timeOut: 3000,
        }
      );
      this.validarEdad = false;
      console.log('dato -> ' + this.validarEdad);
    } else {
      console.log('El usuario es mayor de edad');
      this.validarEdad = true;
      console.log('dato -> ' + this.validarEdad);
    }
  }

  showSpinner: any;
  usuarioRolCapturado: any;
  login() {
    if (!this.usuario.username || !this.usuario.password) {
      this.toastrService.error(
        'Uno o más campos vacios',
        'Verifique los Campos de texto',
        {
          timeOut: 1000,
        }
      );
    } else {
      this.showSpinner = true;
      this.usuarioService
        .login(this.usuario.username, this.usuario.password)
        .subscribe((data) => {
          console.log(data);
          if (data != null) {
            if (data == null) {
              this.toastrService.warning('Usuario deshabilitado', 'Aviso!', {
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
                  progressBar: true,
                  progressAnimation: 'increasing',
                });
                localStorage.setItem('rol', String(this.usuarioRolCapturado));
                localStorage.setItem(
                  'idUsuario',
                  String(this.usuario.idUsuario)
                );
                localStorage.setItem('nameImagen', String(this.userFoto));
                localStorage.setItem('nameLogo', String(this.fundacionLogo));
                console.log(
                  'ROL CAPTURADO ->' + String(this.usuarioRolCapturado)
                );
                console.log('CAMBIO DE ROL ->' + localStorage.getItem('rol'));
                setTimeout(() => {
                  this.showSpinner = false;
                  location.replace('/bienvenido');
                }, 1500);
              } else {
                console.log('Desactivo');
                this.toastrService.error(
                  'Usuario Inhabilitado',
                  'No tiene acceso',
                  {
                    timeOut: 3000,
                  }
                );
                this.usuario = new Usuario();
              }
            }
          } else {
            console.log('No encontrado');
            this.toastrService.warning(
              'Usuario o contraseña incorrectos',
              'Aviso!',
              {
                timeOut: 4000,
              }
            );
            this.usuario = new Usuario();
          }
          this.showSpinner = false;
        });
    }
  }

  imagen!: any;
  nombre_orignal_u: string = '';
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
    console.log('Nombre imagen original => ' + this.nombre_orignal_u);
    this.usuario.foto_perfil = this.nombre_orignal_u;
  }

  cargarImagenUsuario() {
    this.fotoService.guararImagenes(this.selectedFiles);
  }

  // REGISTRARSE //

  verficarPassword: any;
  cargando = false;
  registrarUsuario() {
    this.validarGenero();
    // Agregar indicador de carga o mensaje de espera aquí
    this.cargando = true;
    console.log('lo q recibo ->' + this.validarEdad);
    if (
      !this.persona.nombres ||
      !this.persona.apellidos ||
      !this.persona.cedula ||
      !this.persona.correo ||
      !this.usuario.username ||
      !this.usuario.password ||
      !this.persona.fechaNacimiento ||
      !this.persona.telefono ||
      !this.persona.celular ||
      !this.usuario.username ||
      !this.verficarPassword ||
      !this.persona.genero
    ) {
      this.toastrService.error(
        'Uno o más campos vacios',
        'Verifique los Campos de texto',
        {
          timeOut: 3000,
        }
      );
    } else {
      if (this.validarEdad == true) {
        this.personaService
          .getPorCedula(this.persona.cedula)
          .subscribe((result) => {
            if (result === null) {
              if (this.persona.cedula?.length === 10) {
                if (this.verficarPassword == this.usuario.password) {
                  this.usuarioService
                    .verfUsername(this.usuario.username)
                    .subscribe((data) => {
                      if (!data) {
                        this.personaService
                          .postPersona(this.persona)
                          .subscribe((data) => {
                            console.log(data);
                            this.persona.idPersona = data.idPersona;
                            this.persona = data;
                            this.usuario.persona = this.persona;
                            this.usuario.estado = true;
                            this.usuario.rol = 'CLIENTE';
                            this.cargarImagenUsuario();
                            this.usuarioService
                              .postUsuario(this.usuario)
                              .subscribe((result) => {
                                console.log(result);
                                this.usuario = result;
                                this.toastrService.success(
                                  'Registrado Exitosamente',
                                  'Bienvenido ',
                                  {
                                    timeOut: 1000,
                                  }
                                );
                                // Limpiar los campos y cerrar el modal con tiempo
                                setTimeout(() => {
                                  this.limpiarCampos();
                                  this.closeModal();
                                  this.cargando = false;
                                }, 1000);
                              });
                          });
                      } else {
                        this.toastrService.error(
                          'Username ya en uso',
                          'Digite otro username',
                          {
                            timeOut: 1000,
                          }
                        );
                        this.usuario.username = '';
                      }
                    });
                } else {
                  this.toastrService.error(
                    'No son similares',
                    'Verifique su contraseña',
                    {
                      timeOut: 1000,
                    }
                  );
                }
              } else {
                this.toastrService.error(
                  'La cédula debe de tener 10 dígitos',
                  'cédula no procesada',
                  {
                    timeOut: 3000,
                  }
                );
                this.persona.cedula = '';
              }
            } else {
              this.toastrService.error(
                'La cédula ingresada ya está registrada!',
                'Cedula en uso',
                {
                  timeOut: 1000,
                }
              );
              this.persona.cedula = '';
            }
          });
      } else {
        this.toastrService.warning(
          'Verifique su fecha de nacimiento!',
          'Aviso!',
          {
            timeOut: 1000,
          }
        );
      }
    }
  }

  limpiarCampos() {
    this.persona.cedula = '';
    this.persona.correo = '';
    this.persona.genero = '';
    this.persona.fechaNacimiento = new Date();
    this.persona.direccion = '';
    this.persona.nombres = '';
    this.persona.apellidos = '';
    this.persona.telefono = '';
    this.usuario.username = '';
    this.usuario.password = '';
    this.verficarPassword = '';
    this.file = '';
    this.cedulaValidar = '';
    this.limpiarFormulario();
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

  // RECUPERACION DE CONTRASEÑA

  cedulaValidar: any;
  activarPassword: boolean = false;

  validarCedula() {
    this.personaService.getPorCedula(this.cedulaValidar).subscribe((result) => {
      if (result != null) {
        this.toastrService.success('Verificado', 'Cédula encontrada', {
          timeOut: 1000,
        });
        this.activarPassword = true;
        this.persona = result;
        this.persona.idPersona = result.idPersona;
        this.usuarioService
          .getPorIdPersona(this.persona.idPersona)
          .subscribe((dataUsuario) => {
            this.usuario = dataUsuario;
            this.usuario.username = dataUsuario.username;
            this.usuario.password = this.verficarPassword;
            console.log('username => ' + this.usuario.username);
            console.log('nueva contra => ' + this.verficarPassword);
          });
      } else {
        this.toastrService.error(
          'Verifique el número de cedula',
          'Cédula no existente',
          {
            timeOut: 1000,
          }
        );
        this.cedulaValidar = '';
        this.activarPassword = false;
      }
    });
  }

  cambiarConstra() {
    if (this.verficarPassword == this.usuario.password) {
      this.personaService
        .getPorCedula(this.cedulaValidar)
        .subscribe((dataPersona) => {
          this.persona = dataPersona;
          this.persona.idPersona = dataPersona.idPersona;
          this.usuarioService
            .getPorIdPersona(this.persona.idPersona)
            .subscribe((dataUsuario) => {
              this.usuario = dataUsuario;
              this.usuario.username = dataUsuario.username;
              this.usuario.password = this.verficarPassword;
              this.usuarioService
                .updateUsuario(this.usuario, this.usuario.idUsuario)
                .subscribe((dataUsuarioCap) => {
                  this.toastrService.success(
                    'Exitosamente',
                    'Contraseña actualizada',
                    {
                      timeOut: 1000,
                    }
                  );
                  this.limpiarRecuContra();
                  this.activarPassword = false;
                });
            });
        });
    } else {
      this.toastrService.error('No son similares', 'Verifique su contraseña', {
        timeOut: 3000,
      });
    }
  }

  limpiarRecuContra() {
    this.persona.cedula = '';
    this.persona.correo = '';
    this.persona.genero = '';
    this.persona.fechaNacimiento = new Date();
    this.persona.direccion = '';
    this.persona.nombres = '';
    this.persona.apellidos = '';
    this.persona.telefono = '';
    this.usuario.username = '';
    this.usuario.password = '';
    this.verficarPassword = '';
    this.cedulaValidar = '';
    this.activarPassword = false;
    this.closeModal2();
  }

  closeModal2() {
    let modal = document.getElementById('examplePassword');
    if (modal) {
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
      let backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove();
      }
    }
  }

  // OTRAS VALIDACIONES
  generoValido: boolean = false;
  verfGenero: string = '';
  validarGenero() {
    console.log('hola genero');
    this.valCorreo = this.expCorreo.test(this.persona.genero!);
    if (this.valCorreo) {
      console.log('SI TIENE');
    } else {
      this.verfCorreo = 'ng-invalid ng-dirty';
      console.log('VACIO');
    }
  }

  // VALIDAR CAMPOS
  ValidarCampos() {
    console.log('ya esta activo');
    document.addEventListener('DOMContentLoaded', () => {
      const forms = document.querySelectorAll(
        '.needs-validation'
      ) as NodeListOf<HTMLFormElement>;
      Array.from(forms).forEach((form) => {
        form.addEventListener('submit', (event: Event) => {
          if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
          }
          form.classList.add('was-validated');
        });
      });
    });
  }

  limpiarFormulario() {
    const forms = document.querySelectorAll(
      '.needs-validation'
    ) as NodeListOf<HTMLFormElement>;
    Array.from(forms).forEach((form) => {
      form.classList.remove('was-validated');
      form.querySelectorAll('.ng-invalid, .ng-dirty').forEach((input) => {
        input.classList.remove('ng-invalid', 'ng-dirty');
      });
      form.reset();
    });
  }
}
