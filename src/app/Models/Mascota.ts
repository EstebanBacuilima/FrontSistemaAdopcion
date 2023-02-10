import { Fundacion } from "./Fundacion";
import { Usuario } from "./Usuario";


export class Mascota {

    idMascota?: number;
    chipMascota?: string;
    nombre_mascota?: string;
    sexo?: string;
    especie?: Date;
    raza?: string;
    color?: string;
    descripcion?: string;
    foto?: string;
    estado_mascota?: boolean;
    estado_adopcion?: boolean;
    estado_seguimiento?: boolean;
    
    fundacion?: Fundacion;
    usuario?: Usuario;
} 