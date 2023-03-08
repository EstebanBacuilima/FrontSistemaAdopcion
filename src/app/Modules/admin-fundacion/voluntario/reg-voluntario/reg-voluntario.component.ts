import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CargarScrpitsService } from 'src/app/cargar-scrpits.service';
import { Fundacion } from 'src/app/Models/Fundacion';
import { Persona } from 'src/app/Models/Persona';
import { Usuario } from 'src/app/Models/Usuario';
import { Voluntario } from 'src/app/Models/Voluntario';
import { FundacionService } from 'src/app/Services/fundacion.service';
import { FotoService } from 'src/app/Services/imagen.service';
import { MascotaService } from 'src/app/Services/mascota.service';
import { PersonaService } from 'src/app/Services/persona.service';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { VoluntarioService } from 'src/app/Services/voluntario.service';

@Component({
  selector: 'app-reg-voluntario',
  templateUrl: './reg-voluntario.component.html',
  styleUrls: ['./reg-voluntario.component.css'],
})
export class RegVoluntarioComponent implements OnInit {
  voluntario: Voluntario = new Voluntario();
  fundacion: Fundacion = new Fundacion();
  usuario: Usuario = new Usuario();
  user: any;
  persona: Persona = new Persona();
  idUsuario: any;
  idFundacion: any;
  verficarPassword: any;

  constructor(
    private _CargarScript: CargarScrpitsService,
    private toastrService: ToastrService,
    private voluntarioService: VoluntarioService,
    private personaService: PersonaService,
    private mascotaService: MascotaService,
    private fundacionService: FundacionService,
    private usuarioService: UsuarioService,
    private router: Router,
    private fotoService: FotoService
  ) {
    _CargarScript.Cargar(['validaciones']);
  }

  ngOnInit(): void {
    this.obtenerUsuario();
    this.ValidarCampos();
    this.limpiarCampos();
  }


  //Validar Edad en el Campo de De fecha
  edad: any;
  validarEdad: boolean = false;
  //Validar Edad
  calcularEdad() {
    if (this.persona && this.persona.fechaNacimiento) {
      let fechaPrueba: any = new Date(this.persona.fechaNacimiento);
      let fechaFormateada = fechaPrueba.toISOString().substr(0, 10);
      let anio = parseInt(fechaFormateada.substr(0, 4));
      console.log('fecha formateada ->' + fechaFormateada)
      console.log('año elejido ->' + anio)
      let fechaHoy: Date = new Date();
      let fechaFormateadaHoy = fechaHoy.toISOString().substr(0, 10);
      let anioA = parseInt(fechaFormateadaHoy.substr(0, 4));
      console.log('año actual ->' + anioA)
      let edad = anioA - anio;
      console.log('Edad:' + edad);
      if (edad < 18) {
        this.toastrService.error('Prohibido el registro', 'Usted es menor de edad', {
          timeOut: 3000,
        });
        this.validarEdad = false;
        console.log("dato -> " + this.validarEdad)
      } else {
        console.log('El usuario es mayor de edad');
        this.validarEdad = true;
        console.log("dato -> " + this.validarEdad)
      }
    }
  }
  obtenerUsuario() {
    this.idUsuario = localStorage.getItem('idUsuario');
    if (this.idUsuario != '' && this.idUsuario != undefined) {
      this.usuarioService.getPorId(this.idUsuario).subscribe((data) => {
        console.log(data);
        this.user = data;
        this.idFundacion = data.fundacion?.idFundacion;
        this.obtenerFundacionDelUsuario(this.idFundacion);
      });
    } else {
      console.log('Usuario no foun => ');
    }
  }

  obtenerFundacionDelUsuario(idFundacion: any) {
    if (this.idFundacion != '' && this.idFundacion != undefined) {
      this.fundacionService.getPorId(this.idFundacion).subscribe((data) => {
        console.log(data);
        this.fundacion = data;
      });
    } else {
      console.log("Fundación no encontrada o esta vacío esa variable=> ")
    }
  }

  registrarVoluntario() {
    if (
      !this.persona.cedula ||
      !this.persona.apellidos ||
      !this.persona.nombres ||
      !this.voluntario.area_trabajo ||
      !this.persona.fechaNacimiento ||
      !this.usuario.username ||
      !this.usuario.password ||
      !this.verficarPassword
    ) {
      this.toastrService.error(
        'Uno o más campos vacios',
        'Verifique los Campos de texto',
        {
          timeOut: 2000,
        }
      );
      return;
    }
    if (this.usuario.password !== this.verficarPassword) {
      this.toastrService.error(
        'Contraseñas son distintas!',
        'Verifique su contraseñ',
        {
          timeOut: 2000,
        }
      );
      return;
    }

    this.usuarioService
      .verfUsername(this.usuario.username)
      .subscribe((data) => {
        if (data) {
          this.toastrService.error('Usuario ya en uso', 'Digite otro usuario', {
            timeOut: 3000,
          });
          this.usuario.username = '';
          return;
        }

        this.personaService
          .getPorCedula(this.persona.cedula)
          .subscribe((result) => {
            if (this.persona.cedula?.length === 10) {
              if (this.validarEdad == true) {

              if (result != null) {
                this.toastrService.error(
                  'Digite otra cedula',
                  'Cedula Existente',
                  {
                    timeOut: 3000,
                  }
                );
                this.persona.cedula = '';
                return;
              }

              this.personaService
                .postPersona(this.persona)
                .subscribe((personaData) => {
                  this.persona.idPersona = personaData.idPersona;
                  this.usuario.persona = this.persona;
                  this.usuario.fundacion = this.fundacion;
                  this.usuario.estado = true;
                  this.usuario.rol = 'VOLUNTARIO';
                  this.usuario.foto_perfil = this.foto_usuario;
                  this.voluntario.estado = true;
                  this.usuarioService
                    .postUsuario(this.usuario)
                    .subscribe((usuarioData) => {
                      this.usuario = usuarioData;
                      this.voluntario.usuario = this.usuario;
                      this.cargarImagenVoluntario();
                      this.voluntarioService
                        .postVoluntario(this.voluntario)
                        .subscribe(() => {
                          this.toastrService.success(
                            'Su ha guardado el voluntario',
                            'Voluntario Registrada Exitosamente',
                            {
                              timeOut: 1500,
                            }
                          );
                          this.limpiarCampos();
                        });
                    });
                });
              } else {
                this.toastrService.warning('Verifique su fecha de nacimiento!', 'Aviso!', {
                  timeOut: 1000,
                });
              }
            } else {
              this.toastrService.error('La cédula debe de tener 10 dígitos', 'cédula no procesada', {
                timeOut: 3000,
              });
              this.persona.cedula = '';
            }
          });
      });
  }

  // IMAGEN
  file: any = '';
  image!: any;
  retrievedImage: any;
  foto_usuario: string = "nodisponible.png";
  cap_nombre_archivo: any;
  selectedFile!: File;
  public imageSelected(event: any) {
    this.selectedFile = event.target.files[0];
    // mostrar imagen seleccionada
    this.image = this.selectedFile;
    const reader = new FileReader();
    reader.readAsDataURL(this.selectedFile);
    reader.onload = () => {
      this.file = reader.result;
    };
    this.cap_nombre_archivo = event.target.value;
    this.foto_usuario = this.cap_nombre_archivo.slice(12);
    console.log('Nombre imagen original => ' + this.foto_usuario);
  }

  cargarImagenVoluntario() {
    this.fotoService.guararImagenes(this.selectedFile);
  }

  //VALIDACIONES

  // letras y espacios
  letrasEspace: RegExp = /^[a-zA-Z\s.,áéíóúÁÉÍÓÚ]+$/;
  letrasEspaceNumbers: RegExp = /^[a-zA-Z0-9\s]+$/;
  letrasEspeciales: RegExp = /^[a-zA-Z0-9\s.,áéíóúÁÉÍÓÚ]+$/;


  // Validar que no igrese Guion medio
  onKeyPress(event: KeyboardEvent) {
    if (event.key === '-') {
      event.preventDefault();
    }
  }

  ValidarCampos() {
    console.log("Ya esta activo")
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
  //

  limpiarCampos() {
    console.log('Entro a limpiar');
    this.persona.cedula = '';
    this.persona.correo = '';
    this.persona.genero = '';
    this.persona.fechaNacimiento = new Date();
    this.persona.direccion = '';
    this.persona.nombres = '';
    this.persona.apellidos = '';
    this.persona.telefono = '';
    this.voluntario.area_trabajo = '';
    this.usuario.username = '';
    this.usuario.password = '';
    this.verficarPassword = '';
    this.file = '';
    this.limpiarFormulario();
  }
}
