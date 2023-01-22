import { Fundacion } from "./Fundacion";
import { Persona } from "./Persona";

export class Usuario{
    idUsuario?: number;
    username!: string;
    password!: string;
    estado!: boolean;
    foto_perfil?: string;

    persona?: Persona;
    fundacion?: Fundacion;
}