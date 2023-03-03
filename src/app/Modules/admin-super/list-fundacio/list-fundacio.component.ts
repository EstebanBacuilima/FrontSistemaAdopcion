import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Fundacion } from 'src/app/Models/Fundacion';
import { Persona } from 'src/app/Models/Persona';
import { Usuario } from 'src/app/Models/Usuario';
import { FundacionService } from 'src/app/Services/fundacion.service';
import { FotoService } from 'src/app/Services/imagen.service';
import { PersonaService } from 'src/app/Services/persona.service';
import { UsuarioService } from 'src/app/Services/usuario.service';
import * as pdfMake from "pdfmake/build/pdfmake";
import { ToastrService } from 'ngx-toastr';
import { Header } from 'primeng/api';

@Component({
  selector: 'app-list-fundacio',
  templateUrl: './list-fundacio.component.html',
  styleUrls: ['./list-fundacio.component.css']
})
export class ListFundacioComponent implements OnInit {

  usuario: Usuario = new Usuario;
  persona: Persona = new Persona;
  fundacion: Fundacion = new Fundacion;
  // Validacion de Campos de Caracteres
  // letras y espacios
  letrasEspace: RegExp = /^[a-zA-Z\s]+$/;
  letrasEspaceNumbers: RegExp = /^[a-zA-Z0-9\s]+$/;
  // letrasEspace: RegExp = /^[a-zA-Z0-9\s^!#$%&*]+$/;
  // letrasEspaceNumbers: RegExp = /^[a-zA-Z0-9\s^!#$%&*-]+$/;

  // Validar que no igrese Guion medio
  onKeyPress(event: KeyboardEvent) {
    if (event.key === '-') {
      event.preventDefault();
    }
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


  pageActual: number = 1;
  public myCounter: number = 0;
  listaFundaciones: Fundacion[] = [];
  loading: boolean = true;

  constructor(private toastrService: ToastrService, private fundacionService: FundacionService, private personaService: PersonaService, private usuarioService: UsuarioService, private router: Router, private fotoService: FotoService) { }

  ngOnInit(): void {
    this.obtenerFundaciones()
  }


  obtenerFundaciones() {
    this.fundacionService.getFundacion().subscribe(
      data => {
        this.listaFundaciones = data.map(
          result => {
            let fundacion = new Fundacion;
            fundacion.idFundacion = result.idFundacion;
            fundacion.ruc = result.ruc;
            fundacion.persona = result.persona;
            fundacion.nombre_fundacion = result.nombre_fundacion
            fundacion.acronimo = result.acronimo;
            fundacion.mision = result.mision;
            fundacion.direccion = result.direccion;
            fundacion.correo = result.correo;
            fundacion.telefono = result.telefono;
            fundacion.estado = result.estado;
            return fundacion;
          }
        );
        this.loading = false;
      }
    )
  }

  datainicialFundacion: any;

  capParaEdicion(idFundacion: any) {
    this.datainicialFundacion = idFundacion;
    console.log("idFundacion " + idFundacion)
    this.optenerDatos();
  }

  idPersonaCap: any;
  idUsuarioCap: any;

  optenerDatos() {
    this.fundacionService.getPorId(this.datainicialFundacion).subscribe(data => {
      this.fundacion = data
      this.persona.idPersona = this.fundacion.persona.idPersona
      this.persona.cedula = this.fundacion.persona?.cedula
      this.persona.nombres = this.fundacion.persona?.nombres
      this.persona.apellidos = this.fundacion.persona?.apellidos
      this.persona.correo = this.fundacion.persona?.correo
      this.persona.telefono = this.fundacion?.persona?.telefono
      this.persona.celular = this.fundacion.persona?.celular
      this.persona.direccion = this.fundacion.persona?.direccion
      this.persona.genero = this.fundacion.persona?.genero
      this.persona.fechaNacimiento = this.fundacion.persona?.fechaNacimiento
      // CAPTURAR PERSONA
      this.idPersonaCap = this.fundacion.persona.idPersona;
      this.personaService.getPorId(this.idPersonaCap).subscribe(dataP => {
        this.persona = dataP
        this.idUsuarioCap = dataP.idPersona
        this.usuarioService.getPorIdPersona(this.idUsuarioCap).subscribe(dataU => {
          this.usuario = dataU
        })
      })
    })
  }

  actualizarFundacion() {
    if (!this.fundacion.ruc || this.fundacion.ruc === null || !this.fundacion.acronimo || this.fundacion.acronimo === null || this.fundacion.telefono === null || !this.fundacion.direccion || !this.fundacion.correo || this.fundacion.correo === null || !this.fundacion.logo || this.fundacion.logo === null || !this.fundacion.mision || this.fundacion.mision === null || !this.fundacion.nombre_fundacion || this.fundacion.nombre_fundacion === null
      || !this.persona.apellidos || this.persona.apellidos === null || !this.persona.cedula || this.persona.cedula === null || !this.persona.celular || this.persona.celular === null || !this.persona.correo || this.persona.correo === null || !this.persona.celular || this.persona.celular === null || !this.persona.correo || this.persona.correo === null || !this.persona.direccion || this.persona.direccion === null || !this.persona.nombres || this.persona.nombres === null || !this.persona.telefono || this.persona.telefono === null
      || !this.usuario.username || this.usuario.username === null || !this.usuario.password || this.usuario.password === null) {
      this.toastrService.error('Uno o más campos vacios', 'Verifique los Campos de texto', {
        timeOut: 3000,
      });
    } else {
      // if (this.validarEdad == true) {

        this.personaService.updatePersona(this.persona, this.persona.idPersona).subscribe(data => {
          console.log(data)
          this.usuarioService.updateUsuario(this.usuario, this.usuario.idUsuario).subscribe(data => {
            console.log(data)
            this.fundacionService.updateFundacion(this.fundacion, this.fundacion.idFundacion).subscribe(data => {
              console.log(data)
              this.obtenerFundaciones();
              this.cargarImagenFundacion();
              this.cargarImagenUsuario();
              this.toastrService.success('Cambios realizados con exito', 'Actualizado Correctamente', {
                timeOut: 1000,
              });
              const miModal: any = document.getElementById('modalUpdate');
              miModal?.modal('hide');
            })
          })
        })
      // } else {
      //   this.toastrService.warning('Verifique su fecha de nacimiento!', 'Aviso!', {
      //     timeOut: 1000,
      //   });
      // }
    }
  }

  idFundacionDelete: any;
  isUsuarioDesactivar: any;

  descativarFundacion(idFundacion: any) {
    this.fundacionService.getPorId(idFundacion).subscribe(data => {
      this.fundacion = data
      this.idFundacionDelete = this.fundacion.idFundacion;
      console.log("ES LA ID -> " + this.idFundacionDelete);
      this.isUsuarioDesactivar = this.fundacion.persona.idPersona;
      this.fundacion.estado = false;
      this.fundacionService.descativarFundacion(this.fundacion, idFundacion).subscribe(data => {
        this.usuarioService.getPorIdPersona(this.isUsuarioDesactivar).subscribe(dataUsuario => {
          this.usuario = dataUsuario
          this.usuario.idUsuario = dataUsuario.idUsuario;
          this.usuario.estado = false;
          this.usuarioService.descativarUsuario(this.usuario, this.isUsuarioDesactivar).subscribe(data => {
            this.obtenerFundaciones();
            this.toastrService.warning('La fundación ha sido desactivada!', 'Fundación Desactivada!', {
              timeOut: 4000,
            });
          })
        });
      })
    })
  }

  ativarFundacion(idFundacion: any) {
    this.fundacionService.getPorId(idFundacion).subscribe(data => {
      this.fundacion = data
      this.idFundacionDelete = this.fundacion.idFundacion;
      console.log("ES LA ID -> " + this.idFundacionDelete);
      this.isUsuarioDesactivar = this.fundacion.persona.idPersona;
      this.fundacion.estado = true;
      this.fundacionService.descativarFundacion(this.fundacion, idFundacion).subscribe(data => {
        this.usuarioService.getPorIdPersona(this.isUsuarioDesactivar).subscribe(dataUsuario => {
          this.usuario = dataUsuario
          this.usuario.idUsuario = dataUsuario.idUsuario;
          this.usuario.estado = true;
          this.usuarioService.descativarUsuario(this.usuario, this.isUsuarioDesactivar).subscribe(data => {
            this.obtenerFundaciones();
            this.toastrService.success('La fundación se ha habilitado', 'Fundación Activada', {
              timeOut: 1000,
            });
          })
        });
      })
    })
  }

  // IMAGEN
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

  // IMAGEN USUARIO
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


  fechaAct: Date = new Date();

  // PDF
  openPdfTables() {
    let fechaPrueba: Date = new Date();
    let fechaFormateada = fechaPrueba.toISOString().substr(0, 10);
    console.log("es la fecha de hoy -> " + fechaFormateada);
    let tableBody = [];
    tableBody.push([
      { text: "ID", bold: true, background: '' },
      { text: "RUC", bold: true, background: ''},
      { text: "FUNDACIÓN", bold: true, background: ''},
      { text: "ACRÓNIMO", bold: true, background: ''},
      { text: "MISIÓN", bold: true, background: ''},
      { text: "DIRECCIÓN", bold: true, background: ''},
      { text: "CORREO", bold: true, background: ''},
      { text: "TELÉFONO", bold: true, background: ''},
    ]);
    this.listaFundaciones.forEach(fundacion => {
      let fila = [];
      fila.push(fundacion.idFundacion);
      fila.push(fundacion.ruc);
      fila.push(fundacion.nombre_fundacion);
      fila.push(fundacion.acronimo);
      fila.push(fundacion.mision);
      fila.push(fundacion.direccion);
      fila.push(fundacion.correo);
      fila.push(fundacion.telefono);
      tableBody.push(fila);
    });

    const documentDefinition: any = {
      content: [
        {
          text: "Sistema de Adopción de Mascotas",
          fontSize: 10,
          style: "header",
          alignment: 'right',
          fillColor: 'violet'
        },
        {
          text: fechaFormateada,
          fontSize: 10,
          style: "header",
          alignment: 'left',
          fillColor: 'violet'
        },
        "-----------------------------------------------------------------------------------------------------------------------------------------------------------",
        {
          text: this.fechaAct,
          style: "header",
          alignment: 'right',
          fillColor: 'lightblue'
        },
        {
          text: '\n\n',
        },
        {
          text: "Reporte de Fundaciones",
          style: "header",
          alignment: 'center',
          fillColor: 'lightblue'
        },
        {
          text: '\n',
        },
        {
          text: 'Listado de fundaciones registradas en el sistema de adopción de mascotas.',
          alignment: 'center',
          Color: 'green',
        },
        {
          text: '\n',
        },
        {
          table: {
            layout: 'landscape',
            fontSize: 5,
            headerRows: 1,
            widths: [12, 65, 70, 65, 67, 65, 65, 60],
            body: tableBody
          }
        }

      ],
      styles: {
        header: {
          fontSize: 20,
          bold: true,
          fillColor: 'white'
        },
        tableHeader: {
          fillColor: 'lightblue'
        }
      }
    };

    pdfMake.createPdf(documentDefinition).open();
  }
  
  //Validar Campos
  // ValidarCampos() {
  //   console.log("ya esta activo")
  //   document.addEventListener('DOMContentLoaded', () => {
  //     const forms = document.querySelectorAll('.needs-validation') as NodeListOf<HTMLFormElement>;
  //     Array.from(forms).forEach(form => {
  //       form.addEventListener('submit', (event: Event) => {
  //         if (!form.checkValidity()) {
  //           event.preventDefault();
  //           event.stopPropagation();
  //         }
  //         form.classList.add('was-validated');
  //       });
  //     });
  //   });
  // }

  limpiarFormulario() {
    const forms = document.querySelectorAll('.needs-validation') as NodeListOf<HTMLFormElement>;
    Array.from(forms).forEach(form => {
      form.classList.remove('was-validated');
      form.querySelectorAll('.ng-invalid, .ng-dirty').forEach((input) => {
        input.classList.remove('ng-invalid', 'ng-dirty');
      });
      form.reset();
    });
  }


}

