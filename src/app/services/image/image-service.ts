import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NewImage } from 'src/typings/newImage';
import { ImageVariables } from 'src/typings/imageVariables';
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

    return this.http.get<any>(`http://54.218.22.220:8181/image/approvalImages?imageId=${id}`, {headers});
  }

  adminPostImage(file: File, nomeDaPeca: string){
    let headers = new HttpHeaders({
      'Accept': 'text/plain',
    });

    let formData: FormData = new FormData();

    formData.append('file', file, file.name);

    return this.http.post<any>(`http://54.218.22.220:8181/image/uploadFile?name=${nomeDaPeca}`, formData, {
      headers,
      responseType: "text" as "json"
    });

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

    return this.http.post<any>(`http://54.218.22.220:8181/image/imageOpts?imageId=${imageID}`, variables);
  }

  getAllImages(){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(`http://54.218.22.220:8181/image/all`, {headers});
  }

  getFields(id){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(`http://54.218.22.220:8181/image/imageFields?imageId=${id}`, {headers});
  }

}
