import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  getCategory(){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(`${API_URL}:8080/category/get`, {headers});
  }

  addCategory(categoria: string){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(`${API_URL}:8080/category/new?name=${categoria}`,{headers});
  }
  addSubCategory(categoria: string, subcategoria: string){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(`${API_URL}:8080/category/subcategory/new?name=${subcategoria}&category=${categoria}`, {headers});
  }

  addFinalCategory(categoria: string, subcategoria: string, finalCategory: string){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(`${API_URL}:8080/category/subcategory/finalcategory/new?name=${finalCategory}&category=${categoria}&subCategory=${subcategoria}`, {headers});
  }

}
