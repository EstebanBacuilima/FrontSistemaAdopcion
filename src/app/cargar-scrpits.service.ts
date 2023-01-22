import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CargarScrpitsService {

  constructor() { }

  Cargar( archivos: String[]){
    for (let archivo of archivos) {
      let script = document.createElement("script");
      script.src = "./assets/Js/" + archivo + ".js";
      let body = document.getElementsByTagName("body")[0];
      body.appendChild( script );
    }
  }
}
