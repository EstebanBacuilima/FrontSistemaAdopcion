import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pregunta } from '../Models/Pregunta';
import { Respuesta } from '../Models/Respuesta';
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

  getSolicitudesUsuario(idUsuario: any){
    return this.http.get<SolicitudAdopcion[]>(this.URL+'listarSolicitudesPorUsuario/' + idUsuario);
  }

  listarPreguntas(){
    return this.http.get<Pregunta[]>(this.URL+'listarPreguntas');
  }

  listarRespuestasPreguntasPorSolicitud(idSolicitudAdopcion: number){
    return this.http.get<Respuesta[]>(this.URL+'listarRespuestasSolicitante/' + idSolicitudAdopcion);
  }

  getPorId(idSolicitudAdopcion: number){
    return this.http.get<SolicitudAdopcion>(this.URL+ 'porId/'+idSolicitudAdopcion);
  }

  updateEstadoSolicitud(solicitud: SolicitudAdopcion, idSolicitudAdopcion: any){
    return this.http.put<SolicitudAdopcion>(this.URL+`actualizarEstadoSolicitud/${idSolicitudAdopcion}`, solicitud);
  }
  postSolicitud(solicitudAdopcion: SolicitudAdopcion){
    return this.http.post<SolicitudAdopcion>(this.URL+'?', solicitudAdopcion);
  }

  responderPreguntasConRespuesta(respuesta: any){
    return this.http.post<any>(this.URL+'responderPreguntas/', respuesta);
  }

}
