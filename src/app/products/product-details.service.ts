import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
//import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductDetailsService {
  constructor(private http: HttpClient) {}
  baseUrl = environment.apiUrl;

  GetProductDetailsByVarationID(ID: number | any) {
    return this.http.get(this.baseUrl + '/api/v1/variants-resource/' + ID);
  }
}
