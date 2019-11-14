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

    return this.http.get<any>(`${API_URL}:8181/image/approvedImages?imageId=${id}`, {headers});
  }

  getImagensMock(){
    return this.http.get<any>('http://localhost:3000/imagens');
  }

  getVariaveisMock(){
    return this.http.get<Variavel[]>('http://localhost:3000/variaveis');
  }

  adminPostImage(file: File, nomeDaPeca: string){
    let headers = new HttpHeaders({
      'Content-Type': 'multipart/form-data'
    });

    let formData: FormData = new FormData();

    formData.append('file', file);

    return this.http.post<any>(`http://52.43.34.172:8181/image/uploadFile?name=${nomeDaPeca}`, formData, {headers});

  }

  adminPostImageVariables(newImage: NewImage, imageID: string){
    let headers = new HttpHeaders({
      'Content-Type': 'multipart/form-data'
    });
    
    return this.http.post<any>(`http://52.43.34.172:8181/image/imageOpts?imageId=${imageID}`, newImage, {headers});
  }

}
