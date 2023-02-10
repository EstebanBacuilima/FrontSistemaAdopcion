import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Seguimiento } from '../Models/Seguimiento';

@Injectable({
  providedIn: 'root'
})
export class SeguimientoService {

  constructor(private http: HttpClient) { }

  private URL = "http://localhost:5000/api/seguimiento/";

  getAllSeguimientos(){
    return this.http.get<Seguimiento[]>(this.URL+'listar');
  }

  getPorId(idSeguimiento: number){
    return this.http.get<Seguimiento>(this.URL+ 'porId/'+idSeguimiento);
  }


  postSeguimiento(seguimiento: Seguimiento){
    return this.http.post<Seguimiento>(this.URL+'?', seguimiento);
  }

  getAllSeguimientosPorMascota(idMascota: any){
    return this.http.get<Seguimiento[]>(this.URL+'listarSeguimientosPorMascota/' + idMascota);
  }

  verficarRegistro(idMascota: any, fechaSeguimiento:any){
    console.log("entro al service de verficar Registro")
    console.log("ruta => " + this.URL+'validarRegistros/' + idMascota + '/' + fechaSeguimiento)
    return this.http.get<Seguimiento[]>(this.URL+'validarRegistros/' + idMascota + '/' + fechaSeguimiento);
  }

  updateEstadoSeguimiento(seguimiento: Seguimiento, idSeguimiento: any){
    return this.http.put<Seguimiento>(this.URL+`actualizarEstadoSeguimiento/${idSeguimiento}`, seguimiento);
  }

}
