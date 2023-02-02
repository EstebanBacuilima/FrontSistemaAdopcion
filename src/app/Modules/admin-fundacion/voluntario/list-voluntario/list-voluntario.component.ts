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


  constructor(private personaService: PersonaService,private voluntarioService: VoluntarioService, private fundacionService: FundacionService, private usuarioService: UsuarioService, private router: Router, private fotoService: FotoService
  ) { }


  ngOnInit(): void {
    this.obtenerUsuario();
  }

  idUsuario: any;
  idFundacion: any;

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

  // listaVoluntarios: Voluntario[] = [];

  // obtenerVoluntarios1() {
  //   this.voluntarioService.getVoluntariosFundacion(this.idFundacion).subscribe(
  //     data => {
  //       console.log(data);
  //       this.listaVoluntarios = data.map(
  //         result => {
  //           let voluntario = new Voluntario;
  //           voluntario = result;
  //           return voluntario;
  //         }
  //       )
  //     }
  //   )
  // }


  // obtenerVoluntarios() {
  //   this.voluntarioService.getVoluntariosFundacion(this.idFundacion).subscribe(
  //     data => {
  //       this.listaVoluntarios = data.map(
  //         result => {
  //           let voluntario = new Voluntario;
  //           voluntario.idVoluntario = result.idVoluntario;
  //           voluntario.cargo = result.cargo;
  //           voluntario.area_trabajo = result.area_trabajo;
  //           voluntario.estado = result.estado;
  //           voluntario.usuario = result.usuario!;
  //           console.log("Data Usuario -> " + voluntario.usuario)
  //           return voluntario;
  //         }
  //       );
  //       this.loading = false;
  //     }
  //   )
  // }


  
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
      // this.voluntario.idVoluntario = this.voluntario.idVoluntario;
      // this.voluntario.cargo = this.voluntario.cargo;
      // this.voluntario.area_trabajo = this.voluntario.area_trabajo;
      // this.voluntario.estado = this.voluntario.estado;
      // this.voluntario.usuario = this.voluntario.usuario;
      // this.usuario.idUsuario =  this.voluntario.usuario!.idUsuario
      // this.usuario.username =  this.voluntario.usuario!.username
      // this.usuario.password =  this.voluntario.usuario!.password
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
    this.personaService.updatePersona(this.persona, this.persona.idPersona).subscribe(data => {
      console.log(data)
      this.usuarioService.updateUsuario(this.usuario, this.usuario.idUsuario).subscribe(data => {
        console.log(data)
        this.voluntarioService.updateVoluntario(this.voluntario, this.voluntario.idVoluntario).subscribe(data => {
          console.log(data)
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Actualizado Correctamente',
            showConfirmButton: false,
            timer: 1500
          })
        })
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


}
