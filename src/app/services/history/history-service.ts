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
export class HistoryService {

  constructor(private http: HttpClient) { }

  getHistory(){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(`http://34.220.136.85:8181/history/getAll`, {headers});
  }

  postHistory(history){
    let headers = new HttpHeaders({
      'Accept': 'text/plain',
    });

    return this.http.post<any>(`http://34.220.136.85:8181/image/uploadFile`, history);

  }

  getHistoryBySolicitor(solicitor){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(`http://34.220.136.85:8181/history/by?type=solicitor&value=${solicitor}`, {headers});
  }

}
