import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NewImage } from 'src/typings/newImage';
import { ImageVariables } from 'src/typings/imageVariables';
import { Variables } from 'src/typings/variables';
import { stringify } from 'querystring';

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

    return this.http.get<any>(`http://52.27.128.99:8181/image/approvalImages?imageId=${id}`, {headers});
  }

  postImage(file: File, nomeDaPeca: string){
    let headers = new HttpHeaders({
      'Accept': 'text/plain',
    });

    let formData: FormData = new FormData();

    formData.append('file', file, file.name);

    return this.http.post<any>(`http://52.27.128.99:8181/image/uploadFile?name=${nomeDaPeca}`, formData, {
      headers,
      responseType: "text" as "json"
    });

  }

  postImageThumb(file: File, nomeDaPeca: string){
    let headers = new HttpHeaders({
      'Accept': 'text/plain',
    });

    let formData: FormData = new FormData();

    formData.append('file', file, file.name);

    return this.http.post<any>(`http://52.27.128.99:8181/image/uploadFile?name=${nomeDaPeca}&type=thumb`, formData, {
      headers,
      responseType: "text" as "json"
    });

  }

  adminPostImageVariables(newImage: NewImage, imageID: string, imgBaseWidth: number, imgBaseHeight: number, s3UrlThumb: string){
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
      newImage.requester,
      !newImage.aprovacao,
      newImage.acabamento,
      newImage.categoria,
      newImage.fmtAberto,
      newImage.fmtFechado,
      imgBaseHeight,
      imgBaseWidth, 
      fields,
      s3UrlThumb
    )

    console.log('final: ');
    console.log(variables);

    return this.http.post<any>(`http://52.27.128.99:8181/image/imageOpts?imageId=${imageID}`, variables);
  }
  setImageRequester(id, requester){
    return this.http.post<any>(`http://52.27.128.99:8181/image/imageOpts?imageId=${id}`, {requester: requester});
  }

  postFinalImageOpts(infos, s3UrlThumb){

    let imageID = '';

    let variables: ImageVariables = new ImageVariables(
      false,
      false,
      infos.requester,
      false,
      "",
      "",
      "",
      "",
      100,
      100, 
      [],
      s3UrlThumb
    )

    console.log('final: ');
    console.log(variables);

    return this.http.post<any>(`http://52.27.128.99:8181/image/imageOpts?imageId=${imageID}`, variables);
  }
  

  getAllImages(){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(`http://52.27.128.99:8181/image/all`, {headers});
  }

  getByCategory(categoria){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(`http://52.27.128.99:8181/image/imagesByCategory?category=${categoria}`, {headers});
  }

  getFinalImages(){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(`http://52.27.128.99:8181/image/finalImages`, {headers});
  }

  getFinalImagesByRequester(requester){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(`http://52.27.128.99:8181/image/finalImagesByRequester?requester=${requester}`, {headers});
  }

  approveImage(id){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.put<any>(`http://52.27.128.99:8181/image/approvedImages?imageId=${id}`, {headers});
  }

  getFields(id){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(`http://52.27.128.99:8181/image/imageFields?imageId=${id}`, {headers});
  }
  getApproved(user){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(`http://52.27.128.99:8181/image/finalImageByRequester?imageId=${user}`, {headers});
  }

  setFinalImageToTrue(token: string){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.put<any>(`http://52.27.128.99:8181/image/finalImages?imageId=${token}`, {headers});
  }

}
