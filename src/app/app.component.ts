import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from './Models/Usuario';
import { UsuarioService } from './Services/usuario.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title: any = "FAA";

  // usuario: Usuario = new Usuario;

  // idUsuario: any;
  // nombreUsuario: any;
  // nombreFoto: any;
  // nombreLogo: any;

  // isSuperAdmin: boolean = false;
  // isFundacionAdmin: boolean = false;
  // isClient: boolean = false;
  // isVoluntario: boolean = false;
  // isPublico: boolean = false;
  // isLogin: boolean = false;


  // constructor(
  //   private usuarioService: UsuarioService,
  //   private router: Router,
  //   private http: HttpClient
  // ) { }

  // ngOnInit(): void {
  //   this.obtenerUsuario();
  // }
  // ngOnDestroy() {
  //   console.log("destruir");
  // }

  // obtenerUsuario() {
  //   this.idUsuario = localStorage.getItem('idUsuario');
  //   if (this.idUsuario != '' && this.idUsuario != undefined) {
  //     this.usuarioService.getPorId(this.idUsuario).subscribe((data) => {
  //       console.log(data);
  //       this.usuario = data;
  //       if (data != null) {
  //         this.isLogin = true;
  //         this.nombreUsuario = data.persona?.nombres + ' ' + data.persona?.apellidos;
  //         switch (this.usuario.rol) {
  //           case 'PUBLICO':
  //             this.isSuperAdmin = false;
  //             this.isFundacionAdmin = false;
  //             this.isClient = false;
  //             this.isVoluntario = false;
  //             this.isPublico = true;
  //             break;
  //           case 'CLIENTE':
  //             this.isSuperAdmin = false;
  //             this.isFundacionAdmin = false;
  //             this.isClient = true;
  //             this.isVoluntario = false;
  //             this.isPublico = false;
  //             break;
  //           case 'ADMIN_FUDACION':
  //             this.isSuperAdmin = false;
  //             this.isFundacionAdmin = true;
  //             this.isClient = false;
  //             this.isVoluntario = false;
  //             this.isPublico = false;
  //             //this.verificaVoluntario(data.idUsuario);
  //             break;
  //           case 'SUPER_ADMINISTRADOR':
  //             this.isSuperAdmin = true;
  //             this.isFundacionAdmin = false;
  //             this.isClient = false;
  //             this.isVoluntario = false;
  //             this.isPublico = false;
  //             break;
  //           default:
  //             alert('Rol desconocido');
  //             break;
  //         };

  //       } else {
  //         this.isLogin = false;
  //         this.nombreUsuario = 'NULL';
  //       }
  //     });
  //   }
  // }

  /*verificaVoluntario(idUsuario: any) {
    console.log('Comprobando los cargos del usuario ...')
    this.personalCargoService.getByUsuario(idUsuario).subscribe(
      data => {
        if (data != null && data.length > 0) {
          data.forEach(personal => {
            if (personal.cargo?.nombre === 'Bodega') {
              this.isVoluntario = true;
            } 
          });
        } else {
          this.isVoluntario = true;
        }
      }
    )
  }*/
}
