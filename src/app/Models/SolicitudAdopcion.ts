import { Mascota } from "./Mascota";
import { Usuario } from "./Usuario";

export class SolicitudAdopcion {

    idSolicitudAdopcion?: number;
    fecha_solicitud_adopcion?: Date;
    estado?: string;
    estadoDos?: string;
    mascota?: Mascota;
    usuario?: Usuario;
} 