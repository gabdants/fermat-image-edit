import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NewImage } from 'src/typings/newImage';
import { ImageVariables } from 'src/typings/imageVariables';
import { Variavel } from 'src/typings/variavel';
import { Variables } from 'src/typings/variables';

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

  getImagensMock(){
    return this.http.get<any>('http://localhost:3000/imagens');
  }

  getVariaveisMock(){ 
    return this.http.get<Variavel[]>('http://localhost:3000/variaveis');
  }

  adminPostImageVariables(newImage: NewImage, imageID: string, imgBaseWidth: number, imgBaseHeight: number ){
    console.log('post variables!')
    let fields: Variables[] = [];
    //Necessidade de realizar um cast pois o idiota do dantas escreveu os parametro tudo em inglês
    newImage.variaveis.forEach(element => {
      let variable: Variables = new Variables(
                                              element.titulo, 
                                              element.cordX, 
                                              element.cordY, 
                                              element.obs, 
                                              element.fonte, 
                                              element.tamanho, 
                                              element.alinhamento, 
                                              element.cor, 
                                              element.obrigatorio,
                                              element.textoModelo,
                                              element.titulo
                                              );
      fields.push(variable);
    });

    console.log('Variaveis: ');
    console.log(fields);

    //Necessidade de realizar um cast pois o idiota do dantas escreveu os parametro tudo em inglês
    let variables: ImageVariables = new ImageVariables(
      newImage.editavel,
      newImage.aprovacao,
      "admin",
      !newImage.aprovacao,
      newImage.acabamento,
      newImage.categoria,
      newImage.fmtAberto,
      newImage.fmtFechado,
      imgBaseHeight,
      imgBaseWidth, 
      fields
    )

    console.log('final: ');
    console.log(variables);

    return this.http.post<any>(`http://52.43.50.97:8181/image/imageOpts?imageId=${imageID}`, variables);
  }

  getAllImages(){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(`http://52.43.50.97:8181/image/all`, {headers});
  }

}
