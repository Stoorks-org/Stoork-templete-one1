import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//import { environment } from 'src/environments/environment';
import { brands } from '../shared/models/brands/brands';
import { MessageService } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HomeserviceService {
  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}
  baseUrl = environment.apiUrl;

  getall() {
    return this.http.get(this.baseUrl + '/api/v1/home');
  }
  showmessage(m: string | any, s: string | any) {
    this.messageService.add({
      severity: s,
      summary: s,
      detail: m,
    });
  }
  //public search = new BehaviorSubject<string>('');
}
