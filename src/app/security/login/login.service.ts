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

  getLogin(login, senha){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let user = {
      username: login,
      password: senha

    }
    return this.http.post<any>(`http://52.40.167.24:8282/user/login`, user, {headers});
  }
  logout() {
    this.showHeader.emit(false);
  }
}
