import { Component, OnInit } from '@angular/core';
import { Voluntario } from 'src/app/Models/Voluntario';
import { Persona } from 'src/app/Models/Persona';
import { Usuario } from 'src/app/Models/Usuario';
import { FundacionService } from 'src/app/Services/fundacion.service';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { Router } from '@angular/router';
import { FotoService } from 'src/app/Services/imagen.service';
import { VoluntarioService } from 'src/app/Services/voluntario.service';
import { takeWhile } from 'rxjs';
import { PersonaService } from 'src/app/Services/persona.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import * as pdfMake from "pdfmake/build/pdfmake";
import { Fundacion } from 'src/app/Models/Fundacion';

@Component({
  selector: 'app-list-voluntario',
  templateUrl: './list-voluntario.component.html',
  styleUrls: ['./list-voluntario.component.css']
})
export class ListVoluntarioComponent implements OnInit {

  fundacion: Fundacion = new Fundacion;
  usuario: Usuario = new Usuario;
  persona: Persona = new Persona;
  voluntario: Voluntario = new Voluntario;
  pageActual: number = 1;
  loading: boolean = true;
  listaVoluntarios: Voluntario[] = [];
  public myCounter: number = 0;


  constructor(private toastrService: ToastrService,private personaService: PersonaService,private voluntarioService: VoluntarioService, private fundacionService: FundacionService, private usuarioService: UsuarioService, private router: Router, private fotoService: FotoService
  ) { }


  ngOnInit(): void {
    this.obtenerUsuario();
  }

  idUsuario: any;
  idFundacion: any;

   //VALIDACIONES

  // letras y espacios
  letrasEspace: RegExp = /^[a-zA-Z\sñÑáéíóúÁÉÍÓÚ]+$/;
  letrasEspaceNumbers: RegExp = /^[a-zA-Z0-9\s]+$/;

  // Validar que no igrese Guion medio
  onKeyPress(event: KeyboardEvent) {
    if (event.key === '-') {
      event.preventDefault();
    }
  }


  obtenerUsuario() {
    this.idUsuario = localStorage.getItem('idUsuario');
    if (this.idUsuario != '' && this.idUsuario != undefined) {
      this.usuarioService.getPorId(this.idUsuario).subscribe((data) => {
        console.log(data);
        this.usuario = data;
        this.idFundacion = data.fundacion?.idFundacion;
        this.obtenerVoluntarios();
        this.fundacionService.getPorId(this.idFundacion).subscribe((dataF) => {
          this.fundacion = dataF;
          console.log("fundacion name -> " + this.fundacion.nombre_fundacion)
        })
      })
    } else {
      console.log("Usuario not found => ")
    }
  }

  obtenerVoluntarios() {
    this.voluntarioService.getVoluntariosFundacion(this.idFundacion).subscribe(
      data => {
        this.listaVoluntarios = data.map(
          result => {
            let voluntario = new Voluntario;
            voluntario.idVoluntario = result.idVoluntario;
            voluntario.estado = result.estado;
            voluntario.area_trabajo = result.area_trabajo;
            voluntario.usuario = result.usuario;
            voluntario.usuario!.persona!.cedula = result.usuario?.persona?.cedula;
            return voluntario;
          }
        );
        this.loading = false;
      },
      error => (console.log(error))
    )
  }

  datainicialVoluntario: any;

  capParaEdicion(idVoluntario: any) {
    this.datainicialVoluntario = idVoluntario;
    console.log("idVoluntario -> " + idVoluntario)
    this.optenerDatos();
  }

  idPersonaCap: any;
  idUsuarioCap: any;

  optenerDatos() {
    this.voluntarioService.getPorId(this.datainicialVoluntario).subscribe(data => {
      this.voluntario = data
      this.persona.idPersona = this.voluntario.usuario?.persona?.idPersona;
      this.persona.cedula = this.voluntario.usuario?.persona?.cedula
      this.persona.nombres = this.voluntario.usuario?.persona?.nombres
      this.persona.apellidos = this.voluntario.usuario?.persona?.apellidos
      this.persona.correo = this.voluntario.usuario?.persona?.correo
      this.persona.telefono = this.voluntario.usuario?.persona?.telefono
      this.persona.celular = this.voluntario.usuario?.persona?.celular
      this.persona.direccion = this.voluntario.usuario?.persona?.direccion
      this.persona.genero = this.voluntario.usuario?.persona?.genero
      this.persona.fechaNacimiento = this.voluntario.usuario?.persona?.fechaNacimiento
      // CAPTURAR PERSONA
      this.idPersonaCap = this.voluntario.usuario?.persona?.idPersona;
      this.personaService.getPorId(this.idPersonaCap).subscribe(dataP => {
        this.persona = dataP
        this.idUsuarioCap = dataP.idPersona
        this.usuarioService.getPorIdPersona(this.idUsuarioCap).subscribe(dataU => {
          this.usuario = dataU
        })
      })
    })
  }
  

  actualizarVoluntarios() {
    if (!this.persona.cedula || !this.persona.apellidos || !this.persona.correo || !this.persona.direccion || !this.persona.telefono || !this.persona.celular
      || !this.voluntario.area_trabajo || !this.persona.nombres || !this.persona.fechaNacimiento || !this.persona.genero || !this.usuario.username || !this.usuario.password) {
      this.toastrService.error('Uno o más campos vacíos', 'Verifique los campos de texto', {
        timeOut: 2000,
      });
    } else {
      this.personaService.updatePersona(this.persona, this.persona.idPersona).subscribe(data => {
        console.log(data)
        this.usuarioService.updateUsuario(this.usuario, this.usuario.idUsuario).subscribe(data => {
          console.log(data)
          this.voluntarioService.updateVoluntario(this.voluntario, this.voluntario.idVoluntario).subscribe(data => {
            this.cargarImagenUsuario();
            this.toastrService.success('Se ha modificado el voluntario', 'Voluntario actualizado', {
              timeOut: 1500,
            });
            this.obtenerVoluntarios();
          })
        })
      })
    }
    
  }

  idValuntarioDelete: any;
  isUsuarioDesactivar:any
  desactivarVoluntario(idVoluntario: any) {
    this.voluntarioService.getPorId(idVoluntario).subscribe(data => {
      this.voluntario = data
      this.idValuntarioDelete = this.voluntario.idVoluntario;
      console.log("ES LA ID -> " + this.idValuntarioDelete);
      this.voluntario.estado = false;
      this.isUsuarioDesactivar =  this.voluntario.usuario?.idUsuario;
      console.log("ES LA ID USUARIO-> " + this.isUsuarioDesactivar);
      this.voluntarioService.descativarVoluntario(this.voluntario, this.idValuntarioDelete).subscribe(data => {
        this.usuarioService.getPorId(this.isUsuarioDesactivar).subscribe(dataUsuario => {
          this.usuario = dataUsuario
          this.usuario.idUsuario = dataUsuario.idUsuario;
          this.usuario.estado = false;
          this.usuarioService.descativarUsuario(this.usuario, this.isUsuarioDesactivar).subscribe(data => { 
            this.obtenerVoluntarios();
            this.toastrService.warning('El voluntario ha sido Inhabilitado!', 'Voluntario Desactivado!', {
              timeOut: 1000,
            });
          })
        });
      })
    })
  }

  activarVoluntario(idVoluntario: any) {
    this.voluntarioService.getPorId(idVoluntario).subscribe(data => {
      this.voluntario = data
      this.idValuntarioDelete = this.voluntario.idVoluntario;
      console.log("ES LA ID -> " + this.idValuntarioDelete);
      this.voluntario.estado = true;
      this.isUsuarioDesactivar =  this.voluntario.usuario?.idUsuario;
      console.log("ES LA ID USUARIO-> " + this.isUsuarioDesactivar);
      this.voluntarioService.descativarVoluntario(this.voluntario, this.idValuntarioDelete).subscribe(data => {
        this.usuarioService.getPorId(this.isUsuarioDesactivar).subscribe(dataUsuario => {
          this.usuario = dataUsuario
          this.usuario.idUsuario = dataUsuario.idUsuario;
          this.usuario.estado = true;
          this.usuarioService.descativarUsuario(this.usuario, this.isUsuarioDesactivar).subscribe(data => { 
            this.obtenerVoluntarios();
            this.toastrService.success('El voluntario se ha restablecido', 'Voluntario Habilitado', {
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


  fechaAct: Date =new Date();

  openPdfTables() {
    let fechaPrueba: Date = new Date();
    let fechaFormateada = fechaPrueba.toISOString().substr(0,10);
    console.log("es la fecha de hoy -> " + fechaFormateada);
    let tableBody = [];
    tableBody.push([
      { text: "ID", bold: true },
      { text: "CEDULA", bold: true },
      { text: "NOMBRE/APELLIDOS", bold: true },
      { text: "TELEFONO", bold: true },
      { text: "CORREO", bold: true },
      { text: "DIRECCIÓN", bold: true },
      { text: "ÁREA DE TRABAJO", bold: true },
    ]);
    this.listaVoluntarios.forEach(voluntario => {
      let fila = [];
      fila.push(voluntario.idVoluntario);
      fila.push(voluntario.usuario!.persona!.cedula);
      fila.push(voluntario.usuario!.persona!.nombres + ' ' + voluntario.usuario!.persona!.apellidos);
      fila.push(voluntario.usuario!.persona!.telefono);
      fila.push(voluntario.usuario!.persona!.correo);
      fila.push(voluntario.usuario!.persona!.direccion);
      fila.push(voluntario.area_trabajo);
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
          text: "Reporte de Voluntarios",
          style: "header",
          alignment: 'center',
          fillColor: 'lightblue'
        },
        {
          text: '\n',
        },
        {
          text: 'Listado de voluntarios registrados en la fundación ' + this.fundacion.nombre_fundacion + ' en el sistema de adopción de mascotas.',
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
            widths: [12, 68, 120, 64, 70, 65, 65, 60],
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
}
