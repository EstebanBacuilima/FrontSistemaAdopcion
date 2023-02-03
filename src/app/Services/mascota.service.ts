import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Mascota } from '../Models/Mascota';

@Injectable({
  providedIn: 'root'
})
export class MascotaService {

  private URL = "http://localhost:5000/api/mascota/";
  constructor(private http: HttpClient) { }

  getMascota(){
    return this.http.get<Mascota[]>(this.URL+'listar');
  }

  getMascotaDisonibles(){
    return this.http.get<Mascota[]>(this.URL+'listarDisponibles');
  }

  getMascotaFundacion(idFundacion: any){
    return this.http.get<Mascota[]>(this.URL+'listarMacotasPorFundacion/' + idFundacion);
  }

  getPorId(idMascota: number){
    return this.http.get<Mascota>(this.URL+ 'porId/'+idMascota);
  }

  postMascota(mascota: Mascota){
    return this.http.post<Mascota>(this.URL+'?', mascota);
  }

  updateMascota(mascota: Mascota, idMascota: any){
    return this.http.put<Mascota>(this.URL+`actualizar/${idMascota}`, mascota);
  }

  deleteMascota(idMascota: number){
    return this.http.delete<boolean>(this.URL+`eliminar/${idMascota}`);
  }

  
}