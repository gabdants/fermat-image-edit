import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  getLogin(){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(`${API_URL}:8080/category/get`, {headers});
  }

}
