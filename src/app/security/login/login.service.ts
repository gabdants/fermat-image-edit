import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  showHeader = new EventEmitter<boolean>();
  constructor(private http: HttpClient) { }

  login() {
    this.showHeader.emit(true);
    // let headers = new HttpHeaders({
    //   'Content-Type': 'application/json'
    // });
    // return this.http.post<User>(`${this.API_URL}login`, { email: email, password: password });
    // return this.http.get<any>(`${API_URL}:8080/category/get`, {headers});
  }
  logout() {
    this.showHeader.emit(false);
  }
}
