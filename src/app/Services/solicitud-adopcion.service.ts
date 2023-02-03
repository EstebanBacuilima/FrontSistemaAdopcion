import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SolicitudAdopcion } from '../Models/SolicitudAdopcion';

@Injectable({
  providedIn: 'root'
})
export class SolicitudAdopcionService {

  constructor(private http: HttpClient) { }

  private URL = "http://localhost:5000/api/solicitudAdopcion/";

  getSolicitudesFundacion(idFundacion: any){
    return this.http.get<SolicitudAdopcion[]>(this.URL+'listarSolicitudesPorFundacion/' + idFundacion);
  }
}
