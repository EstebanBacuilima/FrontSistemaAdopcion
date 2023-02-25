import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Fundacion } from '../Models/Fundacion';

@Injectable({
  providedIn: 'root'
})
export class FundacionService {

  private URL = "http://localhost:5000/api/fundacion/";

  constructor(private http: HttpClient) { }
  

  getFundacion(){
    return this.http.get<Fundacion[]>(this.URL+'listar');
  }

  getPorId(idFundacion: number){
    return this.http.get<Fundacion>(this.URL+'porId/'+ idFundacion);
  }

  postFundacion(fundacion: Fundacion){
    return this.http.post<Fundacion>(this.URL+'?', fundacion);
  }

  descativarFundacion(fundacion: Fundacion, idFundacion: any){
    return this.http.put<Fundacion>(this.URL+`desactivar/${idFundacion}`, fundacion);
  }

  updateFundacion(fundacion: Fundacion, idFundacion: any){
    return this.http.put<Fundacion>(this.URL+`actualizar/${idFundacion}`, fundacion);
  }

  deleteFundacion(idFundacion: number){
    return this.http.delete<boolean>(this.URL+`eliminar/${idFundacion}`);
  }

  getPorPersona(idPersona: number){
    return this.http.get<Fundacion>(this.URL+`porPersona/${idPersona}`)
  }

  verfRuc(ruc: string){
    return this.http.get<boolean>(this.URL+`porRuc/${ruc}`);
  }
}