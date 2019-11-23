import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Variavel } from 'src/typings/variavel';
import { NewImage } from 'src/typings/newImage';
import { ImageVariables } from 'src/typings/imageVariables';

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

    return this.http.get<any>(`http://api.petlandtech.com/v1/image/approvedImages?imageId=${id}`, {headers});
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

    return this.http.post<any>(`http://api.petlandtech.com/v1/image/uploadFile?name=${nomeDaPeca}`, formData, {
      headers,
      responseType: "text" as "json"
    });

  }

  adminPostImageVariables(newImage: NewImage, imageID: string){

    //Necessidade de realizar um cast pois o idiota do dantas escreveu os parametros tudo em inglês
    let variables: ImageVariables = new ImageVariables(
      newImage.editavel,
      newImage.aprovacao,
      "admin",
      !newImage.aprovacao,
      newImage.acabamento,
      newImage.categoria,
      newImage.fmtAberto,
      newImage.fmtFechado,
      "",
      "",
      newImage.variaveis
    )

    return this.http.post<any>(`http://api.petlandtech.com/v1/image/imageOpts?imageId=${imageID}`, {
      
    });
  }

  getAllImages(){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(`http://api.petlandtech.com/v1/image/all`, {headers});
  }

}
