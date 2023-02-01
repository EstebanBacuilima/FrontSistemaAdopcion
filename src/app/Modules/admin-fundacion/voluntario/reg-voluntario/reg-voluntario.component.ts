import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reg-voluntario',
  templateUrl: './reg-voluntario.component.html',
  styleUrls: ['./reg-voluntario.component.css']
})
export class RegVoluntarioComponent implements OnInit {

  voluntario: Voluntario = new Voluntario;
  fundacion: Fundacion = new Fundacion;
  usuario: Usuario = new Usuario;
  user: any
  persona: Persona = new Persona;
  idUsuario: any;
  idFundacion: any;
  verficarPassword: any;

  constructor(private voluntarioService: VoluntarioService, private personaService: PersonaService, private mascotaService: MascotaService, private fundacionService: FundacionService, private usuarioService: UsuarioService, private router: Router, private fotoService: FotoService
  ) { }

  ngOnInit(): void {
    this.obtenerUsuario();
  }
  obtenerUsuario() {
    this.idUsuario = localStorage.getItem('idUsuario');
    if (this.idUsuario != '' && this.idUsuario != undefined) {
      this.usuarioService.getPorId(this.idUsuario).subscribe((data) => {
        console.log(data);
        this.user = data;
        this.idFundacion = data.fundacion?.idFundacion;
        this.obtenerFundacionDelUsuario(this.idFundacion);
      })
    } else {
      console.log("Usuario no foun => ")
    }
  }

  obtenerFundacionDelUsuario(idFundacion: any) {
    if (this.idFundacion != '' && this.idFundacion != undefined) {
      this.fundacionService.getPorId(this.idFundacion).subscribe((data) => {
        console.log(data);
        this.fundacion = data;
      })
    } else {
      console.log("Fundacion no found o esta vacio esa variable=> ")
    }
  }

  registrarVoluntario() {

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
                  console.log("persona: "  + data);
                  this.persona.idPersona = data.idPersona;
                  this.usuario.persona = this.persona;
                  this.usuario.fundacion = this.fundacion;
                  this.usuario.estado = true;
                  this.usuario.rol = "VOLUNTARIO";
                  this.voluntario.estado = true;
                  this.usuarioService.postUsuario(this.usuario).subscribe(
                    result => {
                      console.log("usuario: " + result);
                      this.usuario = result;
                      this.voluntario.usuario = this.usuario
                      this.voluntarioService.postVoluntario(this.voluntario).subscribe(
                        dataP => {
                          console.log("personal: " + dataP);
                          Swal.fire({
                            position: 'top-end',
                            icon: 'success',
                            title: 'Registrado Exitosamente',
                            showConfirmButton: false,
                            timer: 1500
                          })
                        }
                      )
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

  // IMAGEN
  file: any = '';
  image!: any;
  retrievedImage: any;
  foto_mascota: string = "";
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
    this.foto_mascota = this.cap_nombre_archivo.slice(12);
    console.log("Nombre imagen original => " + this.foto_mascota);
    this.usuario.foto_perfil = this.foto_mascota;
  }

  cargarImagenMascota() {
    this.fotoService.guararImagenes(this.selectedFile);
  }
}