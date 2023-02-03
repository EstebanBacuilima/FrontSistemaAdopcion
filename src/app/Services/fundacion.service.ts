import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Fundacion } from '../Models/Fundacion';

const API= "https://09fd-181-188-201-61.jp.ngrok.io/api/fundacion/";
@Injectable({
  providedIn: 'root'
})
export class FundacionService {

  private URL = "https://09fd-181-188-201-61.jp.ngrok.io/api/fundacion/";

  constructor(private http: HttpClient) { }

  getFundacion(){
    return this.http.get<Fundacion[]>(API+'listar');
  }

  getFundacion1(){
    return this.http.get(API+'listar');
  }

  getPorId(idFundacion: number){
    return this.http.get<Fundacion>(this.URL+'porId/'+ idFundacion);
  }

  postFundacion(fundacion: Fundacion){
    return this.http.post<Fundacion>(this.URL+'?', fundacion);
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
