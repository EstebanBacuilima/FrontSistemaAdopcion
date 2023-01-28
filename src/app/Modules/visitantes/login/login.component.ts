import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CargarScrpitsService } from 'src/app/cargar-scrpits.service';
import { Persona } from 'src/app/Models/Persona';
import { Usuario } from 'src/app/Models/Usuario';
import { PersonaService } from 'src/app/Services/persona.service';
import { UsuarioService } from 'src/app/Services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  usuario: Usuario = new Usuario;
  tipoUser: any;
  user: any;
  fundacion:any;
  nombreUsuario:any;
  persona: Persona = new Persona;

  constructor(
    private _CargarScript: CargarScrpitsService,
    private usuarioService: UsuarioService, 
    private personaService: PersonaService,
    private router: Router,
    
  ){
    _CargarScript.Cargar(["loginFunciones"]);
  }

  ngOnInit(): void {
    localStorage.removeItem('idUsuario');
    this.persona.nombres = '';
    this.persona.apellidos = '';
    this.persona.correo = '';
    this.usuario.username = '';
    this.usuario.password = '';
    localStorage.removeItem('idUsuario');
  }


  login(){
    this.usuarioService.login(this.usuario.username, this.usuario.password).subscribe(
      data => {
        console.log(data);
        if (data != null){

          if (data.estado) {
            this.usuario.idUsuario = data.idUsuario;
            this.user = data.foto_perfil;
            this.fundacion = data.fundacion?.logo;

            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Bienvenido ' + data.username,
              showConfirmButton: false,
              timer: 1500
            })
            localStorage.setItem('rol', String(this.usuario.rol));
            //localStorage.setItem('fundacion', String(this.usuario.fundacion?.idFundacion));
            localStorage.setItem('idUsuario', String(this.usuario.idUsuario));
            localStorage.setItem('nameImagen', String(this.user));
            localStorage.setItem('nameLogo', String(this.fundacion));
            location.replace('/bienvenido');
          } else {
            console.log("Desactivo")
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Usuario inhabilitado'
            })
            this.usuario = new Usuario;
          }
          
        }else{
          console.log("no encontrado")

          Swal.fire({
            icon: 'error',
            title: 'Username o password incorrectos!',
            text: 'Revise sus credenciales porfavor'
          })
          this.usuario = new Usuario;
        
        }
        
      }
    )
  }
  
  imagen!: any;
  nombre_orignal_u: string = "";
  cap_nombre_archivo_u: any;
  selectedFiles!: File;
  file: any = '';

  public imageSelected(event: any) {
    this.selectedFiles = event.target.files[0];
    // mostrar imagen seleccionada
    this.imagen = this.selectedFiles;
    const reader = new FileReader();
    reader.readAsDataURL(this.selectedFiles);
    reader.onload = () => {
      this.file = reader.result;
    };
    this.cap_nombre_archivo_u = event.target.value;
    this.nombre_orignal_u = this.cap_nombre_archivo_u.slice(12);
    console.log("Nombre imagen original => " + this.nombre_orignal_u);
    this.usuario.foto_perfil= this.nombre_orignal_u;
  }

  // REGISTRARSE //

  verficarPassword: any;


  registrarUsuario(){

    if (this.verficarPassword == this.usuario.password) {
      
      if(this.persona.nombres === '' || this.persona.apellidos === '' || this.persona.correo === '' || this.usuario.username === '' || this.usuario.password === ''
      || this.persona.nombres === null || this.persona.apellidos === null || this.persona.correo === null || this.usuario.username === null || this.usuario.password === null){
        Swal.fire({
          icon: 'error',
          title: 'Verifique los Campos!'
        })
    }else{
      this.usuarioService.verfUsername(this.usuario.username).subscribe(
        data => {
          if (!data){
            this.personaService.postPersona(this.persona).subscribe(
              data => {
                console.log(data);
                this.persona.idPersona = data.idPersona;
                this.usuario.persona = this.persona;
                this.usuario.fundacion = this.fundacion;
                this.usuario.estado = true;
                this.usuario.rol = "CLIENTE";
                    this.usuarioService.postUsuario(this.usuario).subscribe(
                      result => {
                        console.log(result);
                        this.usuario = result;  
                        //localStorage.setItem('idUsuario', String(this.usuario.idUsuario));
                        Swal.fire({
                          position: 'top-end',
                          icon: 'success',
                          title: 'Registrado Exitosamente',
                          showConfirmButton: false,
                          timer: 1500
                        })       
                        //location.replace('/bienvenido');
                      }
                    )               
              }
            )
          } else{
            Swal.fire({
              icon: 'error',
              title: 'El username que eligio ya está en uso!',
              text: 'Cambie su username'
            })
            this.usuario.username = '';
          }   
        }     
      )      
    }    
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Contraseñas son distintas!',
        text: 'Verifique su contraseña'
      })
    }
    
  }

}
