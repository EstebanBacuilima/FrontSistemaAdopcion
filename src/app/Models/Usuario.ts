import { Fundacion } from "./Fundacion";
import { Persona } from "./Persona";

export class Usuario{
    idUsuario?: number;
    username!: string;
    password!: string;
    estado!: boolean;
    rol!: string;
    foto_perfil?: string;

    persona?: Persona;
    fundacion?: Fundacion;
}