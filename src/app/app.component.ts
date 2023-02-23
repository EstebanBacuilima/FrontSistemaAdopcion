import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from './Models/Usuario';
import { UsuarioService } from './Services/usuario.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  // isPublico: boolean = false;

  // usuarioRol: string = "PUBLICO";

  // constructor(
  //   private usuarioService: UsuarioService,
  //   private router: Router,
  //   private http: HttpClient
  // ) { }

  // ngOnInit(): void {
  //   localStorage.setItem('rol', String(this.usuarioRol));
  //   console.log("ROL ->" + localStorage.getItem('rol'))
  // }
  // ngOnDestroy() {
  //   console.log("destruir");
  // }
}
