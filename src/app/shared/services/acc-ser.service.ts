import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
//import { IuserInfo } from '../models/auth/user';

@Injectable({
  providedIn: 'root',
})
export class AccSerService {
  curtUser = new BehaviorSubject<boolean | null>(null);
  user$ = this.curtUser.asObservable();

  // __________________________________________________
  constructor() {}

  // __________________________________________________

  updateUser(status: boolean) {
    this.curtUser.next(status);
  }

  getUser() {
    let token: string | null = localStorage.getItem('token') || null;
    if (token) {
      return JSON.parse(localStorage.getItem('userInfo') || '');
    }
    return null;
  }
}
