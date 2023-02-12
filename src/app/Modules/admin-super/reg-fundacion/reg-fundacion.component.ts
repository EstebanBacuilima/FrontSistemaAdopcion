import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Fundacion } from 'src/app/Models/Fundacion';
import { Persona } from 'src/app/Models/Persona';
import { Usuario } from 'src/app/Models/Usuario';
import { FundacionService } from 'src/app/Services/fundacion.service';
import { FotoService } from 'src/app/Services/imagen.service';
import { PersonaService } from 'src/app/Services/persona.service';
import { UsuarioService } from 'src/app/Services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reg-fundacion',
  templateUrl: './reg-fundacion.component.html',
  styleUrls: ['./reg-fundacion.component.css']
})
export class RegFundacionComponent implements OnInit {

  
  //VALIDACIONES

  // MAYUSCULAS
  formatInput(model: any) {
    model = model.toUpperCase();
  }

  // letras y espacios
  letrasEspace: RegExp = /^[a-zA-Z\s]+$/;
  letrasEspaceNumbers: RegExp = /^[a-zA-Z0-9\s]+$/;
  expCorreo: RegExp = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
  
  // verfRuc: string = '';
  // rucNum: any;

  // validarRuc() {
  //   this.rucNum = this.fundacion.ruc;
  //   if (this.rucNum.length == 13) {
  //     console.log("Ruc completo");
  //     this.verfRuc = 'form-control is-valid';
  //   } else {
  //     this.verfRuc = 'form-control is-invalid';
  //     console.log("Ruc falta");
  //   }
  // }

  ValidarCampos() {
    document.addEventListener('DOMContentLoaded', () => {
      const forms = document.querySelectorAll('.needs-validation') as NodeListOf<HTMLFormElement>;
      Array.from(forms).forEach(form => {
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
    const forms = document.querySelectorAll('.needs-validation') as NodeListOf<HTMLFormElement>;
    Array.from(forms).forEach(form => {
      form.classList.remove('was-validated');
      form.querySelectorAll('.ng-invalid, .ng-dirty').forEach((input) => {
        input.classList.remove('ng-invalid', 'ng-dirty');
      });
      form.reset();
      // this.verfRuc = '';
    });
  }
  //

  fundacion: Fundacion = new Fundacion;
  usuario: Usuario = new Usuario;
  persona: Persona = new Persona;
  verficarPassword:any;
  
  constructor(private toastrService: ToastrService,private fundacionService: FundacionService, private personaService: PersonaService, private usuarioService: UsuarioService, private router: Router, private fotoService: FotoService) { }

  ngOnInit(): void {
    this.ValidarCampos();
  }

  registrarFundacion() {
    if ( !this.fundacion.ruc || this.fundacion.ruc === null || !this.fundacion.acronimo || this.fundacion.acronimo === null || this.fundacion.telefono === null || !this.fundacion.direccion || !this.fundacion.correo || this.fundacion.correo === null || !this.fundacion.logo || this.fundacion.logo === null || !this.fundacion.mision || this.fundacion.mision === null || !this.fundacion.nombre_fundacion || this.fundacion.nombre_fundacion === null
      || !this.persona.apellidos  || this.persona.apellidos === null || !this.persona.cedula || this.persona.cedula === null || !this.persona.celular|| this.persona.celular === null || !this.persona.correo|| this.persona.correo === null || !this.persona.celular || this.persona.celular === null || !this.persona.correo|| this.persona.correo === null || !this.persona.direccion || this.persona.direccion === null || !this.persona.nombres || this.persona.nombres === null || !this.persona.telefono  || this.persona.telefono === null
      || !this.usuario.username || this.usuario.username === null || !this.usuario.password || this.usuario.password === null) {
        this.toastrService.error('Uno o más campos vacios', 'Verifique los Campos de texto', {
          timeOut: 3000,
        });
    } else {
      this.fundacionService.verfRuc(this.fundacion.ruc).subscribe(
        data => {
          if (!data) {
            this.personaService.getPorCedula(this.persona.cedula).subscribe(
              result => {
                if (result === null) {
                  this.usuarioService.verfUsername(this.usuario.username).subscribe(
                    data => {
                      if (!data) {
                        this.personaService.postPersona(this.persona).subscribe(
                          data => {
                            console.log(data);
                            this.persona.idPersona = data.idPersona;
                            this.fundacion.persona = this.persona;
                            this.fundacion.logo = this.foto_fundacion;
                            this.fundacion.estado = true;
                            this.cargarImagenFundacion();
                            this.fundacionService.postFundacion(this.fundacion).subscribe(
                              result => {
                                console.log(result)
                                Swal.fire({
                                  position: 'top-end',
                                  icon: 'success',
                                  title: 'Fundacion registrada correctamente',
                                  showConfirmButton: false,
                                  timer: 1500
                                })
                                this.fundacion.idFundacion = result.idFundacion;
                                this.cargarImagenUsuario();
                                this.usuario.persona = this.persona;
                                this.usuario.fundacion = this.fundacion;
                                this.usuario.rol = "ADMIN_FUDACION";
                                this.usuario.estado = true;
                                this.usuario.foto_perfil = this.foto_usuario;
                                this.usuarioService.postUsuario(this.usuario).subscribe(
                                  info => {
                                    console.log(info);
                                    Swal.fire({
                                      position: 'top-end',
                                      icon: 'success',
                                      title: 'Usuario registrado correctamente',
                                      showConfirmButton: false,
                                      timer: 1500
                                    })
                                    this.limpiarCampos();
                                  }
                                );
                              }
                            )
                          }
                        );
                      } else {
                        Swal.fire({
                          icon: 'error',
                          title: 'El username ya está en uso'
                        });
                      }
                    }
                  )
                } else {
                  Swal.fire({
                    icon: 'error',
                    title: 'La cédula ingresada ya está registrada!'
                  });
                }
              }
            )
          } else {
            Swal.fire({
              icon: 'error',
              title: 'El ruc ya está en uso'
            });
          }
        }
      )
    }
  }

  // IMAGEN USUARIO
  file: any = '';
  image!: any;
  retrievedImage: any;
  foto_usuario: string = "";
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
    console.log("Nombre imagen original => " + this.foto_usuario);
    this.usuario.foto_perfil = this.foto_usuario;
  }

  cargarImagenUsuario() {
    this.fotoService.guararImagenes(this.selectedFile);
  }

  // IMAGEN FUDACION
  imagen!: any;
  filem: any = '';
  foto_fundacion: string = "";
  cap_nombre_archivo_u: any;
  selectedFiles!: File;
  public imageSelectedl(event: any) {
    this.selectedFiles = event.target.files[0];
    // mostrar imagen seleccionada
    this.imagen = this.selectedFiles;
    const reader = new FileReader();
    reader.readAsDataURL(this.selectedFiles);
    reader.onload = () => {
      this.filem = reader.result;
    };
    this.cap_nombre_archivo_u = event.target.value;
    this.foto_fundacion = this.cap_nombre_archivo_u.slice(12);
    console.log("Nombre imagen original => " + this.foto_fundacion);
    this.fundacion.logo = this.foto_fundacion;
  }

  cargarImagenFundacion() {
    this.fotoService.guararImagenes(this.selectedFiles);
  }

  limpiarCampos() {
    console.log("Entro a limpiar")
    this.persona.cedula = '';
    this.persona.correo = '';

    // this.persona.genero = '';
    this.persona.fechaNacimiento = new Date;
    this.persona.direccion = '';
    this.persona.nombres = '';
    this.persona.apellidos = '';
    this.persona.telefono = '';

    this.fundacion.nombre_fundacion = '';
    this.fundacion.acronimo = '';
    this.fundacion.ruc = '';
    this.fundacion.direccion = '';
    this.fundacion.mision = '';
    this.fundacion.telefono = '';
    this.fundacion.correo = '';

    this.usuario.username = '';
    this.usuario.password = '';
    this.verficarPassword = '';

    this.file = '';
    this.filem = '';

    this.limpiarFormulario();
  
  }

}
