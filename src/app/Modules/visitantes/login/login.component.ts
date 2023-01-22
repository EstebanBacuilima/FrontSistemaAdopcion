import { Component, OnInit } from '@angular/core';
import { CargarScrpitsService } from 'src/app/cargar-scrpits.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  
  constructor(
    private _CargarScript: CargarScrpitsService
  ){
    _CargarScript.Cargar(["loginFunciones"]);
  }
  ngOnInit(): void {
  }
}
