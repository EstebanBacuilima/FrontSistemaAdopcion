import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

  getSolicitudesFundacionNotificaciones(idFundacion: any){
    return this.http.get<SolicitudAdopcion[]>(this.URL+'listarSolicitudesPorFundacionNotificaciones/' + idFundacion);
  }

  getSolicitudesUsuarioNotificaciones(idUsuario: any){
    return this.http.get<SolicitudAdopcion[]>(this.URL+'listarSolicitudesPorUsuaroNotificaciones/' + idUsuario);
  }

  getSolicitudesFiltrado(estado: any,idFundacion:any){
    return this.http.get<SolicitudAdopcion[]>(this.URL+'listarPorEstados/' + estado + '/'+ idFundacion);
  }

  getSolicitudesUsuario(idUsuario: any):Observable<SolicitudAdopcion[]>{
    return this.http.get<SolicitudAdopcion[]>(this.URL+'listarSolicitudesPorUsuario/' + idUsuario);
  }

  getSolicitudesUsuarioAndMascota(idMascota:any, idUsuario: any){
    return this.http.get<SolicitudAdopcion[]>(this.URL+'listarSolicitudesPorMascotaUsuario/' + idMascota +'/' + idUsuario);
  }

  listarPreguntas(){
    return this.http.get<Pregunta[]>(this.URL+'listarPreguntasOrdenadas');
  }

  listarRespuestasPreguntasPorSolicitud(idSolicitudAdopcion: number){
    return this.http.get<Respuesta[]>(this.URL+'listarRespuestasSolicitanteOrdenadas/' + idSolicitudAdopcion);
  }

  getPorId(idSolicitudAdopcion: number){
    return this.http.get<SolicitudAdopcion>(this.URL+ 'porId/'+idSolicitudAdopcion);
  }

  updateEstadoSolicitud(solicitud: SolicitudAdopcion, idSolicitudAdopcion: any){
    // console.log("ruta a enovar -> " + this.URL+`actualizarEstadoSolicitud/${idSolicitudAdopcion}`, solicitud);
    return this.http.put<SolicitudAdopcion>(this.URL+`actualizarEstadoSolicitud/${idSolicitudAdopcion}`, solicitud);
  }
  postSolicitud(solicitudAdopcion: SolicitudAdopcion){
    return this.http.post<SolicitudAdopcion>(this.URL+'?', solicitudAdopcion);
  }

  responderPreguntasConRespuesta(respuesta: any){
    return this.http.post<any>(this.URL+'responderPreguntas/', respuesta);
  }

}
