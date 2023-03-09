import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CargarScrpitsService } from 'src/app/cargar-scrpits.service';
import { Fundacion } from 'src/app/Models/Fundacion';
import { Mascota } from 'src/app/Models/Mascota';
import { Usuario } from 'src/app/Models/Usuario';
import { FundacionService } from 'src/app/Services/fundacion.service';
import { FotoService } from 'src/app/Services/imagen.service';
import { MascotaService } from 'src/app/Services/mascota.service';
import { UsuarioService } from 'src/app/Services/usuario.service';

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

  constructor(private _CargarScript: CargarScrpitsService, private toastrService: ToastrService, private mascotaService: MascotaService, private fundacionService: FundacionService, private usuarioService: UsuarioService, private router: Router, private fotoService: FotoService
  ) { _CargarScript.Cargar(["validaciones"]); }

  ngOnInit(): void {
    this.obtenerUsuario();
    this.limpiarCampos();
    this.ValidarCampos();
    this.limpiarFormulario();
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
    if (!this.mascota.chipMascota || this.mascota.chipMascota === null || !this.mascota.nombre_mascota || !this.mascota.sexo || !this.mascota.especie) {
      this.toastrService.error('Uno o más campos vacios', 'Verifique los Campos de texto', {
        timeOut: 2000,
      });
    } else {
      this.mascotaService.getPorChip(this.mascota.chipMascota).subscribe(


        result => {
          if (result === null) {

            if (this.mascota.chipMascota?.length === 10) {
              this.mascota.foto = this.foto_mascota;
              this.mascota.estado_adopcion = true;
              this.mascota.fundacion = this.fundacion;
              this.mascota.usuario = this.usuario;
              this.mascota.estado_seguimiento = false;
              this.mascota.foto = this.foto_mascota;
              this.mascota.estado = true;
              this.mascotaService.postMascota(this.mascota).subscribe(
                info => {
                  this.cargarImagenMascota();
                  this.toastrService.success('Su ha guardado la mascota', 'Mascota Registrada Exitosamente', {
                    timeOut: 1500,
                  });
                  this.limpiarCampos();
                }
              );

            } else {
              this.toastrService.error('El chip de la mascota debe contener 10 dígitos', 'Chip no procesado', {
                timeOut: 2000,
              });
              this.mascota.chipMascota = ''
            }
          } else {
            this.toastrService.error('Digite un nuevo chip!', 'Chip ya Existente', {
              timeOut: 2000,
            });
            this.mascota.chipMascota = ''
          }
        });
    }
  }

  // IMAGEN
  file: any = '';
  image!: any;
  retrievedImage: any;
  foto_mascota: string = "nodisponible.png";
  cap_nombre_archivo: any;
  selectedFile!: File;
  public imageSelected(event: any) {
    // VALIDAR SOLO IMAGENES
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const file = event.target.files[0];
    const extension = file.name.split('.').pop().toLowerCase();
    const fileSize = file.size / 1024; // tamaño en KB

    if (!allowedExtensions.includes(extension)) {
      // código para manejar archivos no válidos
    } else if (fileSize > 1000) {
      this.toastrService.error(
        'La imagen seleccionada es demasiado grande. El tamaño máximo permitido es de 1000 KB.',
        'Tamaño de archivo no válido!',
        {
          timeOut: 3000,
        }
      );
      return;
    }

    if (!allowedExtensions.includes(extension)) {
      this.toastrService.error(
        'Solo se permiten imágenes en formato JPG, PNG o GIF.',
        'Formato de archivo no válido!',
        {
          timeOut: 3000,
        }
      );
      return;
    }
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
  }

  cargarImagenMascota() {
    this.fotoService.guararImagenes(this.selectedFile);
  }

  limpiarCampos() {
    this.mascota.chipMascota = '';
    this.mascota.nombre_mascota = '';
    this.mascota.sexo = '';
    this.mascota.especie = '';
    this.mascota.raza = '';
    this.mascota.color = '';
    this.mascota.descripcion = '';
    this.mascota.chipMascota = '';
    this.file = '';
    this.limpiarFormulario();
  }

  //VALIDACIONES

  // letras y espacios
  letrasEspace: RegExp = /^[a-zA-Z\s.,ñÑáéíóúÁÉÍÓÚ]+$/;
  letrasEspaceNumbers: RegExp = /^[a-zA-Z0-9\s]+$/;
  // letrasEspeciales: RegExp = /^[a-zA-Z0-9\s.,]+$/;
  letrasEspeciales: RegExp = /^[a-zA-Z0-9\s.,ñÑáéíóúÁÉÍÓÚ]+$/;




  // Validar que no igrese Guion medio
  onKeyPress(event: KeyboardEvent) {
    if (event.key === '-') {
      event.preventDefault();
    }
  }

  ValidarCampos() {
    console.log("ya esta activo")
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
    });
  }
  //
}


