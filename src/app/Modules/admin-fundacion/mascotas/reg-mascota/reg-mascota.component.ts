import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Mascota } from 'src/app/Models/Mascota';
import { MascotaService } from 'src/app/Services/mascota.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reg-mascota',
  templateUrl: './reg-mascota.component.html',
  styleUrls: ['./reg-mascota.component.css']
})
export class RegMascotaComponent implements OnInit{
  mascota: Mascota = new Mascota;
  
  constructor(private mascotaService: MascotaService){ }
  
  ngOnInit(): void {
    
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
      
    }
  }

}







// IMAGEN
/*file: any = '';
image!: any;
retrievedImage: any;
foto_usuario: string = "";
cap_nombre_archivo: any;
selectedFile!: File;
public imagSelected(event: any) {
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
}*/

