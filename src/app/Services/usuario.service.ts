import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Usuario } from '../Models/Usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) { }

  private URL = "http://localhost:5000/api/usuario/";

  login(username: string, password: string){
    return this.http.get<Usuario>(this.URL+`login/${username}/${password}`)
  }
  
}
