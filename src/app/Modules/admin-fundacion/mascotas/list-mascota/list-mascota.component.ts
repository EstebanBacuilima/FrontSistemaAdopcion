import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Fundacion } from 'src/app/Models/Fundacion';
import { Mascota } from 'src/app/Models/Mascota';
import { Usuario } from 'src/app/Models/Usuario';
import { FundacionService } from 'src/app/Services/fundacion.service';
import { FotoService } from 'src/app/Services/imagen.service';
import { MascotaService } from 'src/app/Services/mascota.service';
import { UsuarioService } from 'src/app/Services/usuario.service';
import * as pdfMake from "pdfmake/build/pdfmake";

@Component({
  selector: 'app-list-mascota',
  templateUrl: './list-mascota.component.html',
  styleUrls: ['./list-mascota.component.css']
})
export class ListMascotaComponent implements OnInit {

  pageActual: number = 1;
  public myCounter: number = 0;
  listaMascota: Mascota[] = [];
  loading: boolean = true;

  //VALIDACIONES

  // letras y espacios
  letrasEspace: RegExp = /^[a-zA-Z\s.,áéíóúÁÉÍÓÚ]+$/;
  letrasEspaceNumbers: RegExp = /^[a-zA-Z0-9\s]+$/;


  // Validar que no igrese Guion medio
  onKeyPress(event: KeyboardEvent) {
    if (event.key === '-') {
      event.preventDefault();
    }
  }

  constructor(private toastrService: ToastrService, private mascotaService: MascotaService, private fundacionService: FundacionService, private usuarioService: UsuarioService, private router: Router, private fotoService: FotoService
  ) { }

  ngOnInit(): void {
    this.obtenerUsuario();
  }


  mascota: Mascota = new Mascota;
  fundacion: Fundacion = new Fundacion;
  usuario: Usuario = new Usuario;
  idUsuario: any;
  idFundacion: any;



  obtenerUsuario() {
    this.idUsuario = localStorage.getItem('idUsuario');
    if (this.idUsuario != '' && this.idUsuario != undefined) {
      this.usuarioService.getPorId(this.idUsuario).subscribe((data) => {
        console.log(data);
        this.usuario = data;
        this.idFundacion = data.fundacion?.idFundacion;
        this.obtenerMasotas();
        this.fundacionService.getPorId(this.idFundacion).subscribe((dataF) => {
          this.fundacion = dataF;
          console.log("fundacion name -> " + this.fundacion.nombre_fundacion)
        })
      })
    } else {
      console.log("Usuario no encontrado => ")
    }
  }

  listaMascotas: Mascota[] = [];

  obtenerMasotas() {
    this.mascotaService.getMascotaFundacion(this.idFundacion).subscribe(
      data => {
        this.listaMascotas = data.map(
          result => {
            let mascota = new Mascota;
            mascota.idMascota = result.idMascota;
            mascota.chipMascota = result.chipMascota;
            mascota.nombre_mascota = result.nombre_mascota;
            mascota.color = result.color
            mascota.sexo = result.sexo;
            mascota.raza = result.raza;
            mascota.especie = result.especie;
            mascota.descripcion = result.descripcion;
            mascota.estado_mascota = result.estado_mascota;
            mascota.estado_adopcion = result.estado_adopcion;
            mascota.foto = result.foto;
            mascota.estado = result.estado
            return mascota;
          }
        );
        this.loading = false;
      }
    )
  }

  obtenerEstado(estado_adopcion: any): string {
    let estado: string = '';
    if (estado_adopcion == true) {
      estado = 'NO ADOPTADO';
    } else if (estado_adopcion == false) {
      estado = 'ADOPTADO';
    }
    return estado;
  }

  datainicialMascota: any;

  capParaEdicion(idMascota: any) {
    this.datainicialMascota = idMascota;
    console.log("idMascota " + idMascota)
    this.optenerDatos();
  }

  optenerDatos() {
    this.mascotaService.getPorId(this.datainicialMascota).subscribe(data => {
      this.mascota = data
      this.mascota.idMascota = this.mascota.idMascota
      this.mascota.chipMascota
      this.mascota.nombre_mascota;
      this.mascota.color;
      this.mascota.sexo;
      this.mascota.raza;
      this.mascota.especie;
      this.mascota.descripcion;
      this.mascota.estado_mascota;
      this.mascota.estado_adopcion;
      this.mascota.foto;
      console.log("img = " + this.mascota.foto)
    })
  }

  actualizarMascota() {
    if (!this.mascota.chipMascota  || !this.mascota.nombre_mascota || !this.mascota.sexo ||  !this.mascota.especie  ) {
      this.toastrService.error('Uno o más campos vacíos', 'Verifique los campos de texto', {
        timeOut: 2000,
      });
    } else {
      this.cargarImagenMascota();
      this.mascotaService.updateMascota(this.mascota, this.mascota.idMascota).subscribe(data => {
        this.toastrService.success('Se han guardado los cambios', 'Actualizado', {
          timeOut: 1500,
        });
        this.obtenerMasotas();
      })
    }
  }

  idMascotaDelete: any;

  descativarMascota(idMascota: any) {
    this.mascotaService.getPorId(idMascota).subscribe(data => {
      this.mascota = data
      this.idMascotaDelete = this.mascota.idMascota;
      console.log("ES LA ID -> " + this.idMascotaDelete);
      this.mascota.estado = false;
      this.mascotaService.descativarMascota(this.mascota, idMascota).subscribe(data => {
        console.log(data)
        this.obtenerMasotas();
        this.toastrService.warning('La mascota ha sido eliminada!', 'Mascota Eliminada!', {
          timeOut: 1000,
        });
      })
    })
  }

  ativarMascota(idMascota: any) {
    this.mascotaService.getPorId(idMascota).subscribe(data => {
      this.mascota = data
      this.idMascotaDelete = this.mascota.idMascota;
      console.log("ES LA ID -> " + this.idMascotaDelete);
      this.mascota.estado = true;
      this.mascotaService.descativarMascota(this.mascota, idMascota).subscribe(data => {
        console.log(data)
        this.obtenerMasotas();
        this.toastrService.success('La mascota se ha restablecido', 'Mascota Restaurada', {
          timeOut: 1000,
        });
      })
    })
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

  fechaAct: Date =new Date();

  async openPdfTables() {
    // console.log("nombre imagen ->" + this.fundacion.logo)
    // let imagenFundacion = await new Promise((resolve, reject) => {
    //   let imagen = new Image();
    //   imagen.onload = () => resolve(imagen);
    //   imagen.onerror = reject;
    //   imagen.src = 'http://localhost:5000/imagen/images/' + this.fundacion.logo;
    // });
  
    let fechaPrueba: Date = new Date();
    let fechaFormateada = fechaPrueba.toISOString().substr(0,10);
    console.log("es la fecha de hoy -> " + fechaFormateada);
    console.log("nombre empresa -> " + this.fundacion.nombre_fundacion)

    let tableBody = [];
    tableBody.push([
      { text: "ID", bold: true },
      { text: "CHIP", bold: true },
      { text: "NOMBRE", bold: true },
      { text: "RAZA", bold: true },
      { text: "ESPECIE", bold: true },
      { text: "DESCRIPCION", bold: true },
      { text: "ESTADO DE ADOPCIÓN", bold: true },
    ]);
    this.listaMascotas.forEach(mascota => {
      let estadoAdopcion 
      if (mascota.estado_adopcion == true) {
        estadoAdopcion = "No"
      } else {
        estadoAdopcion = "Si"
      }

      let fila = [];
      fila.push(mascota.idMascota);
      fila.push(mascota.chipMascota);
      fila.push(mascota.nombre_mascota);
      fila.push(mascota.raza);
      fila.push(mascota.especie);
      fila.push(mascota.descripcion);
      fila.push(estadoAdopcion);
      tableBody.push(fila);
    });

    const documentDefinition: any = {
      // image: () => {
      //   return imagenFundacion.then((imagen) => {
      //     return {
      //       image: imagen,
      //       width: 200, // ajuste el ancho según sea necesario
      //       alignment: 'center'
      //     };
      //   });
      // },
      content: [
        // {
        //   image: await imagenFundacion,
        //   width: 100,
        //   alignment: 'center',
        //   margin: [0, 20]
        // },
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
          text: "Reporte de Mascotas",
          style: "header",
          alignment: 'center',
          fillColor: 'lightblue',
          color: 'green'
        },
        {
          text: '\n',
        },
        {
          text: 'Listado de mascotas registradas de la fundación ' + this.fundacion.nombre_fundacion + ' en el sistema de adopción de mascotas.',
          alignment: 'center',
          color: 'black',
        },
        {
          text: '\n',
        },
        {
          table: {
            layout: 'landscape',
            alignment: 'center',
            fontSize: 5,
            headerRows: 1,
            widths: [12, 70, 65, 65, 60, 100, 80],
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

  // VALIDAR CAMPOS
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
