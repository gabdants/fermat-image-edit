import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Variavel } from 'src/typings/variavel';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient) { }

  getImageById(id){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(`${API_URL}:8181/image/approvedImages?imageId=${id}`, {headers});
  }

  getImagensMock(){
    return this.http.get<any>('http://localhost:3000/imagens');
  }

  getVariaveisMock(){
    return this.http.get<Variavel[]>('http://localhost:3000/variaveis');
  }

}
