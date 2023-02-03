import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class FotoService {


    constructor(
        private http: HttpClient
    ) {}

    private urlApiFoto: string = 'https://09fd-181-188-201-61.jp.ngrok.io/imagen';

    // NUEVOS METODOS
    guararImagenes(file:File) {
        const formData = new FormData();
        formData.append('image', file);
        this.http.post (this.urlApiFoto + '/subir', formData).subscribe();
    }

}