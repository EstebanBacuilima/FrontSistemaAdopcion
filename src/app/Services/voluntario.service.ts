import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Voluntario } from '../Models/Voluntario';

@Injectable({
  providedIn: 'root'
})
export class VoluntarioService {

  constructor(private http: HttpClient) { }

  private URL = "http://localhost:5000/api/voluntario/";

  getVoluntario(){
    return this.http.get<Voluntario[]>(this.URL+'/listar');
  }

  getVoluntariosFundacion(idFundacion: any){
    return this.http.get<Voluntario[]>(this.URL+'listarVoluntariosPorFundacion/' + idFundacion);
  }

  getPorId(idVoluntario: number){
    return this.http.get<Voluntario>(this.URL+'porId/'+idVoluntario);
  }

  postVoluntario(voluntario: Voluntario){
    return this.http.post<Voluntario>(this.URL+'?', voluntario);
  }

  updateVoluntario(voluntario: Voluntario, idVoluntario: any){
    return this.http.put<Voluntario>(this.URL+`actualizar/${idVoluntario}`, voluntario);
  }

  deleteVoluntarioa(idVoluntario: number){
    return this.http.delete<boolean>(this.URL+`eliminar/${idVoluntario}`);
  }
}
