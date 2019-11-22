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
      'Accept': 'text/plain',
    });

    let formData: FormData = new FormData();

    formData.append('file', file, file.name);

    return this.http.post<any>(`http://52.43.50.97:8181/image/uploadFile?name=${nomeDaPeca}`, formData, {
      headers,
      responseType: "text" as "json"
    });

  }

  adminPostImageVariables(newImage: NewImage, imageID: string){
    
    return this.http.post<any>(`http://52.11.195.30:8181/image/approvedImages?imageId=${imageID}`, newImage);
  }

  getAllImages(){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(`https://nswn2k45r4.execute-api.us-west-2.amazonaws.com/dev/image/all`, {headers});
  }

}
