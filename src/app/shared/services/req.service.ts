import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
//import { environment } from 'src/app/shared/utils/env';

@Injectable({
  providedIn: 'root',
})
export class ReqService {
  NoSizeID = 6;
  // __________________Obs______________________
  private logScreen = new BehaviorSubject<boolean>(false);
  logScreen$ = this.logScreen.asObservable();

  private loginSub = new Subject<any>();
  login$ = this.loginSub.asObservable();

  // __________________Props______________________
  apiV1 = environment.apiUrl;
  // ________________________________________

  constructor(private http: HttpClient) {}

  islogedScreen(st: boolean) {
    this.logScreen.next(st);
  }

  isLogin() {
    if (this.getToken()) {
      return true;
    }
    return false;
  }

  // ________________________________________

  getHeaders(sendFile: boolean): HttpHeaders {
    if (!sendFile) {
      return new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + this.getToken(),
      });
    }

    return new HttpHeaders({
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + this.getToken(),
    });
  }

  getToken(): string | null {
    let token: string | null = localStorage.getItem('token');
    return token;
  }

  // isLogout(){
  //   if () {

  //   }
  // }

  // *________________________ Other Functions____________________

  // ?___get_____
  get(apiUrl: string): Observable<any> {
    return this.http.get(this.apiV1 + apiUrl);
  }

  // ?___post_____
  post(
    apiUrl: string,
    data: any = {},
    sendFile: boolean = false
  ): Observable<any> {
    if (!sendFile) {
      return this.http.post(this.apiV1 + apiUrl, data, {
        headers: this.getHeaders(sendFile),
      });
    }

    return this.http.post(this.apiV1 + apiUrl, data, {
      headers: this.getHeaders(sendFile),
    });
  }

  // ?___put_____
  put(
    apiUrl: string,
    data: any = {},
    sendFile: boolean = false
  ): Observable<any> {
    if (!sendFile) {
      return this.http.put(this.apiV1 + apiUrl, data, {
        headers: this.getHeaders(sendFile),
      });
    }

    return this.http.put(this.apiV1 + apiUrl, data, {
      headers: this.getHeaders(sendFile),
    });
  }

  // ?___delete_____
  delete(apiUrl: string, id: any): Observable<any> {
    return this.http.delete(`${this.apiV1 + apiUrl + id}`);
  }
}
