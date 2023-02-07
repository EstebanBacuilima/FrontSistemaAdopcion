import { Component, OnInit } from '@angular/core';
import { CargarScrpitsService } from 'src/app/cargar-scrpits.service';

@Component({
  selector: 'app-bienvenido',
  templateUrl: './bienvenido.component.html',
  styleUrls: ['./bienvenido.component.css']
})
export class BienvenidoComponent implements OnInit {

  constructor(private _CargarScript: CargarScrpitsService) {
    _CargarScript.Cargar(["formulario"]);
  }

  cargarScrip() {
    this._CargarScript.Cargar(["formulario"]);
    console.log("Esta activado scrip -> ");
  }

  ngOnInit(): void {
    this.cargarScrip();
  }

}
