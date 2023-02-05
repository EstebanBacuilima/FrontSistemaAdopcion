import { Pregunta } from "./Pregunta";
import { SolicitudAdopcion } from "./SolicitudAdopcion";

export class Respuesta {
    
    idRespuesta?: number;
    respuestas?: string;

    pregunta?: Pregunta;
    solicituAdopcion?: SolicitudAdopcion;
}