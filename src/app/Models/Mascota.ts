import { Fundacion } from "./Fundacion";
import { Usuario } from "./Usuario";


export class Mascota {

    idMascota?: number;
    chip_mascota?: string;
    nombre_mascota?: string;
    sexo?: string;
    especie?: Date;
    raza?: string;
    color?: string;
    descripcion?: string;
    foto?: string;
    estado_mascota?: boolean;
    estado_adopcion?: boolean;
    
    fundacion?: Fundacion;
    usuario?: Usuario;
} 