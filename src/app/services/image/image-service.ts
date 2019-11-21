import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Variavel } from 'src/typings/variavel';
import { NewImage } from 'src/typings/newImage';

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

    return this.http.get<any>(`http://52.43.34.172:8181/image/approvedImages?imageId=${id}`, {headers});
  }

  getImagensMock(){
    return this.http.get<any>('http://localhost:3000/imagens');
  }

  getVariaveisMock(){
    return this.http.get<Variavel[]>('http://localhost:3000/variaveis');
  }

  adminPostImage(file: File, nomeDaPeca: string){
    let headers = new HttpHeaders({
      'Content-Type': 'multipart/form-data; boundary=--------------------------212049611664365973243604'
    });

    let formData: FormData = new FormData();

    formData.append('file', file, nomeDaPeca);

    return this.http.post<any>(`http://52.11.195.30:8181/image/uploadFile?name=${nomeDaPeca}`, formData, {headers});

  }

  adminPostImageVariables(newImage: NewImage, imageID: string){
    let headers = new HttpHeaders({
      'Content-Type': 'multipart/form-data'
    });
    
    return this.http.post<any>(`http://52.11.195.30:8181/image/approvedImages?imageId=${imageID}`, newImage, {headers});
  }

}
