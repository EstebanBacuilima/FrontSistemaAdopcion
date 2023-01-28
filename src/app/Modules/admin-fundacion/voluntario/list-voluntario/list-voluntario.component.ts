import { Component } from '@angular/core';
import { Voluntario } from 'src/app/Models/Voluntario';
import { Persona } from 'src/app/Models/Persona';
import { Usuario } from 'src/app/Models/Usuario';

@Component({
  selector: 'app-list-voluntario',
  templateUrl: './list-voluntario.component.html',
  styleUrls: ['./list-voluntario.component.css']
})
export class ListVoluntarioComponent {

  usuario: Usuario = new Usuario;
  persona: Persona = new Persona;
  voluntario: Voluntario = new Voluntario;
  pageActual: number = 1;
  public myCounter: number = 0;
  listaVoluntarios: Voluntario[] = [];
}
