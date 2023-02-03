import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CargarScrpitsService } from 'src/app/cargar-scrpits.service';
import { Fundacion } from 'src/app/Models/Fundacion';
import { Mascota } from 'src/app/Models/Mascota';
import { Usuario } from 'src/app/Models/Usuario';
import { FundacionService } from 'src/app/Services/fundacion.service';
import { MascotaService } from 'src/app/Services/mascota.service';
import { PersonaService } from 'src/app/Services/persona.service';
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

  persona:any;
  constructor( private _CargarScript: CargarScrpitsService,private mascotaService: MascotaService,private fundacionService: FundacionService, private personaService: PersonaService, private usuarioService: UsuarioService, private router: Router) 
  { 
    //_CargarScript.Cargar(["formulario"]);

  }
  cargarScrip(){
    this._CargarScript.Cargar(["formulario"]);
  }
  
  ngOnInit(): void {
    this.obtenerMasotas();
    this.obtenerUsuario();
    this.cargarScrip();
  }

  personas:any;

  obtenerUsuario() {
    this.idUsuario = localStorage.getItem('idUsuario');
    if (this.idUsuario != '' && this.idUsuario != undefined) {
      this.usuarioService.getPorId(this.idUsuario).subscribe((data) => {
        console.log(data);
        this.usuario = data;
        this.personas = this.usuario.persona;
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
      this.mascota.usuario;
      console.log("img = " + this.mascota.foto)
    })
  }

}
