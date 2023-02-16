import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CargarScrpitsService } from 'src/app/cargar-scrpits.service';
import { Fundacion } from 'src/app/Models/Fundacion';
import { Mascota } from 'src/app/Models/Mascota';
import { Persona } from 'src/app/Models/Persona';
import { Pregunta } from 'src/app/Models/Pregunta';
import { Respuesta } from 'src/app/Models/Respuesta';
import { SolicitudAdopcion } from 'src/app/Models/SolicitudAdopcion';
import { Usuario } from 'src/app/Models/Usuario';
import { FundacionService } from 'src/app/Services/fundacion.service';
import { MascotaService } from 'src/app/Services/mascota.service';
import { PersonaService } from 'src/app/Services/persona.service';
import { SolicitudAdopcionService } from 'src/app/Services/solicitud-adopcion.service';
import { UsuarioService } from 'src/app/Services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-catalgo-mascotas',
  templateUrl: './catalgo-mascotas.component.html',
  styleUrls: ['./catalgo-mascotas.component.css']
})
export class CatalgoMascotasComponent implements OnInit {

  loading: boolean = true;
  mascota: Mascota = new Mascota;
  fundacion: Fundacion = new Fundacion;
  usuario: Usuario = new Usuario;
  idUsuario: any;
  idFundacion: any;

  

  constructor(private _CargarScript: CargarScrpitsService,private toastrService: ToastrService, private solicitudService: SolicitudAdopcionService, private mascotaService: MascotaService, private fundacionService: FundacionService, private personaService: PersonaService, private usuarioService: UsuarioService, private router: Router) {
    // _CargarScript.Cargar(["formulario"]);
  }


  ngOnInit(): void {
    this.obtenerMasotas();
    this.obtenerUsuario();
    this.cargarScrip();
    this.obtenerPreguntas();
  }

  cargarScrip(){
    let allStepBtn = document.querySelectorAll('[tab-target]');
    let allStepItem = document.querySelectorAll('.step-item');
    let allTabs = document.querySelectorAll('.step-tab');
    let firstStepItem = document.querySelector('.step-item:nth-child(1)');

    if (firstStepItem) {
        firstStepItem.classList.add('active');
    }

    allStepBtn.forEach(item => {
      item.addEventListener('click', () => {
        let currentTabId = item.getAttribute('tab-target');
        let currentTab = document.getElementById(`${currentTabId}`);
  
        allStepItem.forEach(item => {
          item.classList.remove('active');
        });
  
        allTabs.forEach((tab, i) => {
          if (currentTab && currentTab.id === currentTab.id)  {
            for (let l = 0; i >= 0; i--) {
              allStepItem[i].classList.add('active');
            }
          }
        });
  
        allTabs.forEach(item => {
          item.classList.remove('active');
        });
  
        if (currentTab) {
          currentTab.classList.add('active');
          item.classList.add('active');
        }
        
      });
    });
  }

  personas: any;
  persona: Persona = new Persona;

  obtenerUsuario() {
    this.idUsuario = localStorage.getItem('idUsuario');
    if (this.idUsuario != '' && this.idUsuario != undefined) {
      this.usuarioService.getPorId(this.idUsuario).subscribe((data) => {
        console.log(data);
        this.usuario = data;
        this.personas = this.usuario.persona;
        this.persona = this.personas;
      })
    } else {
      console.log("Usuario no foun => ")
    }
  }


  listaMascotas: Mascota[] = [];

  obtenerMasotas() {
    this.mascotaService.getMascotaDisonibles().subscribe(
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
            mascota.foto = result.foto;
            mascota.especie = result.especie;
            mascota.descripcion = result.descripcion;
            mascota.estado_mascota = result.estado_mascota;
            mascota.estado_adopcion = result.estado_adopcion;
            return mascota;
          }
        );
        this.loading = false;
      }
    )
  }

  datainicialMascota: any;

  capParaSolicitudAdopcion(idMascota: any) {
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
      this.mascota.usuario;
      console.log("img = " + this.mascota.foto)
    })
  }

  solicitudAdopcion: SolicitudAdopcion = new SolicitudAdopcion;
  capIdSolicitud: any;

  pregunta:any;

  enviarSolicitud() {
    // if (!this.pregunta.respuestas) {
    //   this.toastrService.error('Revise las preguntas!', 'Preguntas Vacias', {
    //     timeOut: 2000,
    //   });
    // } else {
      let fechaPrueba: Date = new Date();
      this.solicitudAdopcion.estado = 'P';
      this.solicitudAdopcion.fecha_solicitud_adopcion = fechaPrueba;
      this.solicitudAdopcion.mascota = this.mascota;
      this.solicitudAdopcion.usuario = this.usuario;
      this.mascota.estado_adopcion = false;
      console.log("Mascota enviar -> " + this.mascota.nombre_mascota);
      console.log("Usuario enviar -> " + this.usuario.persona?.nombres);
      this.solicitudService.postSolicitud(this.solicitudAdopcion).subscribe(
        info => {
          this.mascotaService.updateEstadoAdopcion(this.mascota, this.mascota.idMascota).subscribe(
            data => {
              console.log("Se cambio a " + data.estado_adopcion);
              this.capIdSolicitud = info.idSolicitudAdopcion;
              this.enviarRespuestas();
              console.log(info);
              this.obtenerMasotas();
              this.toastrService.success('Espera la respuesta', 'Formualario Enviado', {
                timeOut: 1500,
              });
              // this.limpiar();
            })
        }
      );
    // }
  }

  // FORMULARIO
  listaPreguntas: any[] = [];
  obtenerPreguntas() {
    this.solicitudService.listarPreguntas().subscribe(
      data => {
        this.listaPreguntas = data.map(result => {
          let pregunta = new Pregunta();
          pregunta.idPregunta = result.idPregunta;
          pregunta.pregunta = result.pregunta;
          pregunta.estado = result.estado;
          return pregunta;
        });
        this.loading = false;
      }
    );
  }


  enviarRespuestas() {
    this.listaPreguntas.forEach(pregunta => {
      let respuesta = {
        "respuestas": pregunta.respuesta,
        "pregunta": {
          "idPregunta": pregunta.idPregunta
        },
        "solicitudAdopcion": {
          "idSolicitudAdopcion": this.capIdSolicitud
        }
      }
      this.solicitudService.responderPreguntasConRespuesta(respuesta).subscribe(
        info => {
          console.log("Preguntas ->" + info);
        }
      );
    });
  }

}
