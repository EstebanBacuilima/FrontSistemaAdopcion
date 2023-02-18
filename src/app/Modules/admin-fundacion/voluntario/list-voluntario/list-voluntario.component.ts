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

@Component({
  selector: 'app-list-voluntario',
  templateUrl: './list-voluntario.component.html',
  styleUrls: ['./list-voluntario.component.css']
})
export class ListVoluntarioComponent implements OnInit {

  usuario: Usuario = new Usuario;
  persona: Persona = new Persona;
  voluntario: Voluntario = new Voluntario;
  pageActual: number = 1;
  loading: boolean = true;
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
  letrasEspace: RegExp = /^[a-zA-Z\s]+$/;
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
      })
    } else {
      console.log("Usuario not found => ")
    }
  }

  voluntarios: any
  obtenerVoluntarios() {
    this.voluntarioService.getVoluntariosFundacion(this.idFundacion).subscribe(
      data => {
        this.voluntarios = data
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
      this.toastrService.error('Uno o más campos vacios', 'Verifique los Campos de texto', {
        timeOut: 2000,
      });
    } else {
      this.personaService.updatePersona(this.persona, this.persona.idPersona).subscribe(data => {
        console.log(data)
        this.usuarioService.updateUsuario(this.usuario, this.usuario.idUsuario).subscribe(data => {
          console.log(data)
          this.voluntarioService.updateVoluntario(this.voluntario, this.voluntario.idVoluntario).subscribe(data => {
            this.cargarImagenUsuario();
            this.toastrService.success('Su ha modificado el voluntario', 'Voluntario Actualizado', {
              timeOut: 1500,
            });
            this.obtenerVoluntarios();
          })
        })
      })
    }
    
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


}
