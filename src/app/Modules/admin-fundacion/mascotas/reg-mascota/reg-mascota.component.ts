import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Fundacion } from 'src/app/Models/Fundacion';
import { Mascota } from 'src/app/Models/Mascota';
import { Usuario } from 'src/app/Models/Usuario';
import { FundacionService } from 'src/app/Services/fundacion.service';
import { FotoService } from 'src/app/Services/imagen.service';
import { MascotaService } from 'src/app/Services/mascota.service';
import { UsuarioService } from 'src/app/Services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reg-mascota',
  templateUrl: './reg-mascota.component.html',
  styleUrls: ['./reg-mascota.component.css']
})
export class RegMascotaComponent implements OnInit {

  mascota: Mascota = new Mascota;
  fundacion: Fundacion = new Fundacion;
  usuario: Usuario = new Usuario;
  idUsuario: any;
  idFundacion: any;

  constructor(private mascotaService: MascotaService, private fundacionService: FundacionService, private usuarioService: UsuarioService, private router: Router, private fotoService: FotoService
  ) { }

  ngOnInit(): void {
    this.obtenerUsuario();
  }
  obtenerUsuario() {
    this.idUsuario = localStorage.getItem('idUsuario');
    if (this.idUsuario != '' && this.idUsuario != undefined) {
      this.usuarioService.getPorId(this.idUsuario).subscribe((data) => {
        console.log(data);
        this.usuario = data;
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

  registraMascota() {

    if (this.mascota.chip_mascota === '' || this.mascota.chip_mascota === null
      || this.mascota.nombre_mascota === '' || this.mascota.sexo === '' || this.mascota.raza === ''
      || this.mascota.color === '' || this.mascota.estado_adopcion === null) {
      Swal.fire({
        icon: 'error',
        title: 'Posee campo/s vacio/s en el formulario!'
      });
    } else {

      this.mascota.foto = this.foto_mascota;
      this.mascota.estado_adopcion = true;
      this.mascota.fundacion = this.fundacion;
      this.mascota.usuario = this.usuario;

      console.log("es la mascota =>" + this.mascota.foto);

      this.mascotaService.postMascota(this.mascota).subscribe(
        info => {
          this.cargarImagenMascota();
          console.log(info);
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Mascota registrado correctamente',
            showConfirmButton: false,
            timer: 1500
          })
          //this.limpiar();
        }
      );
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
    this.mascota.foto = this.foto_mascota;
  }

  cargarImagenMascota() {
    this.fotoService.guararImagenes(this.selectedFile);
  }

}


