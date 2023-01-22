import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CargarScrpitsService } from 'src/app/cargar-scrpits.service';
import { Usuario } from 'src/app/Models/Usuario';
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

  files: any = [];
  image!: any;

  
  constructor(
    private _CargarScript: CargarScrpitsService,
    private toastr:ToastrService, 
    private usuarioService: UsuarioService, 
    private router: Router,
    
  ){
    _CargarScript.Cargar(["loginFunciones"]);
  }

  ngOnInit(): void {
    localStorage.removeItem('idUsuario');
    this.selectedGenero = 'nulo'
  }

  selectedGenero?: string;

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
            localStorage.setItem('idUsuario', String(this.usuario.idUsuario));
            localStorage.setItem('nameImagen', String(this.user));
            localStorage.setItem('nameLogo', String(this.fundacion));

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
    console.log("Seleciono una imagen: " + event.target.value);
    this.cap_nombre_archivo_u = event.target.value;
    console.log("Numero de datos del nombre del archivo => " + this.cap_nombre_archivo_u.length)
    this.nombre_orignal_u = this.cap_nombre_archivo_u.slice(12);
    console.log("Nombre imagen original => " + this.nombre_orignal_u);
    console.log(this.nombre_orignal_u);
    this.usuario.foto_perfil= this.nombre_orignal_u;
  }


}
