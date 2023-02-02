import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Fundacion } from 'src/app/Models/Fundacion';
import { Persona } from 'src/app/Models/Persona';
import { Usuario } from 'src/app/Models/Usuario';
import { FundacionService } from 'src/app/Services/fundacion.service';
import { FotoService } from 'src/app/Services/imagen.service';
import { PersonaService } from 'src/app/Services/persona.service';
import { UsuarioService } from 'src/app/Services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-fundacio',
  templateUrl: './list-fundacio.component.html',
  styleUrls: ['./list-fundacio.component.css']
})
export class ListFundacioComponent implements OnInit {

  usuario: Usuario = new Usuario;
  persona: Persona = new Persona;
  fundacion: Fundacion = new Fundacion;
  
  pageActual: number = 1;
  public myCounter: number = 0;
  listaFundaciones: Fundacion[] = [];
  loading: boolean = true;

  constructor(private fundacionService: FundacionService, private personaService: PersonaService, private usuarioService: UsuarioService, private router: Router, private fotoService: FotoService) { }
  
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
    this.personaService.updatePersona(this.persona, this.persona.idPersona).subscribe(data => {
      console.log(data)
      this.usuarioService.updateUsuario(this.usuario, this.usuario.idUsuario).subscribe(data => {
        console.log(data)
        this.fundacionService.updateFundacion(this.fundacion, this.fundacion.idFundacion).subscribe(data => {
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
}

