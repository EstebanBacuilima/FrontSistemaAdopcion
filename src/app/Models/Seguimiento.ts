import { Mascota } from "./Mascota";

export class Seguimiento {
    idSeguimiento?: number;
    fecha_seguimiento?: Date;
    descripcion_visita?: string;
    descripcion_mascota?: string;
    estado_comportamiento?: string;
    estado_salud?: string;
    foto_evidencia?: string;
    estado?: boolean;
    mascota!: Mascota;
    estadoInforme?:string;
} 