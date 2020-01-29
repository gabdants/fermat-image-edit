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
export class FonteService {

  constructor(private http: HttpClient) { }

  postFonte(file: File){
    let headers = new HttpHeaders({
      'Accept': 'text/plain',
    });

    let formData: FormData = new FormData();

    formData.append('file', file, file.name);

    return this.http.post<any>(`http://54.203.70.192:8181/font/uploadFont`, formData, {
      headers,
      responseType: "text" as "json"
    });

  }

  updateFontFile(){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(`http://54.203.70.192:8181/font/getCss`, {headers});
  }

  getFonts(){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(`http://54.203.70.192:8181/font/getFonts`, {headers});
  }

  

  getAllImages(){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(`http://54.203.70.192:8181/image/all`, {headers});
  }

  getByCategory(categoria){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(`http://54.203.70.192:8181/image/imagesByCategory?category=${categoria}`, {headers});
  }

  getFinalImages(){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(`http://54.203.70.192:8181/image/finalImages`, {headers});
  }

  getFinalImagesByRequester(requester){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(`http://54.203.70.192:8181/image/finalImagesByRequester?requester=${requester}`, {headers});
  }

  approveImage(id){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.put<any>(`http://54.203.70.192:8181/image/approvedImages?imageId=${id}`, {headers});
  }

  getFields(id){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(`http://54.203.70.192:8181/image/imageFields?imageId=${id}`, {headers});
  }
  getApproved(user){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(`http://54.203.70.192:8181/image/finalImageByRequester?imageId=${user}`, {headers});
  }

  setFinalImageToTrue(token: string){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.put<any>(`http://54.203.70.192:8181/image/finalImages?imageId=${token}`, {headers});
  }

}
