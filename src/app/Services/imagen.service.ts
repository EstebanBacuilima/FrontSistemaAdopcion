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

    private urlApiFoto: string = 'http://localhost:5000/imagen';

    // NUEVOS METODOS
    guararImagenes(file:File) {
        const formData = new FormData();
        formData.append('image', file);
        this.http.post (this.urlApiFoto + '/subir', formData).subscribe();
    }

}