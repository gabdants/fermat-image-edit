import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

const googleApiKey = environment.googleApiKey;

@Injectable({
  providedIn: 'root'
})
export class GoogleApiService {

  constructor(private http: HttpClient) { }

  getGoogleFonts(){
    return this.http.get(`https://www.googleapis.com/webfonts/v1/webfonts?key=${googleApiKey}`);
  }
}
