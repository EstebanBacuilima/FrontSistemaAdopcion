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

  constructor(private _CargarScript: CargarScrpitsService, private toastrService: ToastrService, private solicitudService: SolicitudAdopcionService, private mascotaService: MascotaService, private fundacionService: FundacionService, private personaService: PersonaService, private usuarioService: UsuarioService, private router: Router) {
    // _CargarScript.Cargar(["formulario"]);
  }

  filtroPost = '';

  ngOnInit(): void {
    this.obtenerMasotas();
    this.obtenerUsuario();
    this.cargarScrip();
    this.obtenerPreguntas();
  }



  personas: any;
  persona: Persona = new Persona;
  fotoUsuario: any;

  obtenerUsuario() {
    this.idUsuario = localStorage.getItem('idUsuario');
    this.fotoUsuario = localStorage.getItem('nameImagen');
    console.log("img usuario " + this.fotoUsuario)
    if (this.idUsuario != '' && this.idUsuario != undefined) {
      this.usuarioService.getPorId(this.idUsuario).subscribe((data) => {
        console.log(data);
        this.usuario = data;
        this.usuario.foto_perfil = data.foto_perfil
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

  capIdFundacion:any;
  capIdRepresentante:any;
  fundacion2: Fundacion = new Fundacion;
  persona2: Persona = new Persona;
  mascota2: Mascota = new Mascota;
  
  optenerDatos() {
    this.mascotaService.getPorId(this.datainicialMascota).subscribe(dataM => {
      this.mascota2 = dataM
      this.mascota2.idMascota = dataM.idMascota
      this.mascota2.chipMascota = dataM.chipMascota 
      this.mascota2.nombre_mascota= dataM.nombre_mascota
      this.mascota2.color= dataM.color
      this.mascota2.sexo= dataM.sexo
      this.mascota2.raza= dataM.raza
      this.mascota2.especie= dataM.especie
      this.mascota2.descripcion= dataM.descripcion
      this.mascota2.estado_mascota= dataM.estado_mascota
      this.mascota2.estado_adopcion= dataM.estado_adopcion
      this.mascota2.foto;
      this.capIdFundacion = this.mascota2.fundacion?.idFundacion;
      this.fundacionService.getPorId(this.capIdFundacion).subscribe(data =>{
        this.fundacion2 = data;
        this.fundacion2.nombre_fundacion;
        this.fundacion2.logo;
        this.capIdRepresentante = this.fundacion2.persona.idPersona;
        this.personaService.getPorId(this.capIdRepresentante).subscribe(dataP =>{
          this.persona2 = dataP;
          this.persona2.nombres = dataP.nombres;;
          this.persona2.apellidos = dataP.apellidos;
        })
      })
    })
  }

  solicitudAdopcion: SolicitudAdopcion = new SolicitudAdopcion;
  capIdSolicitud: any;

  validarRespuestas(): boolean {
    for (const pregunta of this.listaPreguntas) {
        if (!pregunta.respuesta) {
            return false;
        }
    }
    return true;
  }

  limpiarInputs() {
    this.listaPreguntas.forEach(pregunta => {
      pregunta.respuesta = '';
    });
  }

  enviarSolicitud() {
    if (!this.validarRespuestas()) {
      this.toastrService.error('Revise las preguntas!', 'Preguntas Vacias', {
        timeOut: 2000,
      });
    } else {
      console.log("todo lleno")
    let fechaPrueba: Date = new Date();
    this.solicitudAdopcion.estado = 'P';
    this.solicitudAdopcion.fecha_solicitud_adopcion = fechaPrueba;
    this.solicitudAdopcion.mascota = this.mascota2;
    this.solicitudAdopcion.usuario = this.usuario;
    this.solicitudAdopcion.estadoDos = false;
    this.mascota2.estado_adopcion = false;
    console.log("Mascota enviar -> " + this.mascota2.nombre_mascota);
    console.log("Usuario enviar -> " + this.usuario.persona?.nombres);
    this.solicitudService.postSolicitud(this.solicitudAdopcion).subscribe(
      info => {
        this.mascotaService.updateEstadoAdopcion(this.mascota2, this.mascota2.idMascota).subscribe(
          data => {
            console.log("Se cambio a " + data.estado_adopcion);
            this.capIdSolicitud = info.idSolicitudAdopcion;
            this.enviarRespuestas();
            console.log(info);
            this.obtenerMasotas();
            this.toastrService.success('Espera la respuesta', 'Formualario Enviado', {
              timeOut: 1500,
            });
            this.reiniciarSteps()
            this.limpiarInputs();
          })
      }
    );
    }
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

  cargarScrip() {
    // for form steps
    const allStepBtn = document.querySelectorAll('[tab-target]');
    const allStepItem = document.querySelectorAll('.step-item');
    const allTabs = document.querySelectorAll('.step-tab');

    allStepBtn.forEach((item: Element) => {
      item.addEventListener('click', () => {
        const currentTabId = item.getAttribute('tab-target');
        let currentTab = document.getElementById(`${currentTabId}`);
        allStepItem.forEach((item: Element) => {
          item.classList.remove('active');
        });

        allTabs.forEach((tab: Element, i: number) => {
          if (tab.id === currentTab!.id) {
            for (let l = 0; i >= 0; i--) {
              allStepItem[i].classList.add('active');
            }
          }
        });

        allTabs.forEach((item: Element) => {
          item.classList.remove('active');
        });

        currentTab!.classList.add('active');
        item.classList.add('active');
      });
    });
  }

  reiniciarSteps() {
    this.limpiarInputs();
    const allStepItem = document.querySelectorAll('.step-item');
    const allTabs = document.querySelectorAll('.step-tab');
    
    allStepItem.forEach((item: Element, i: number) => {
      if (i === 0) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  
    allTabs.forEach((item: Element, i: number) => {
      if (i === 0) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

}
