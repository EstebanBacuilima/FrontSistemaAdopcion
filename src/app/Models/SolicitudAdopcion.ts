import { Mascota } from "./Mascota";
import { Usuario } from "./Usuario";

export class SolicitudAdopcion {

    idSolicitudAdopcion?: number;
    fecha_solicitud_adopcion?: Date;
    descripcion?: string;
    razon?: string;
    estado?: boolean;

    mascota?: Mascota;
    usuario?: Usuario;
} 