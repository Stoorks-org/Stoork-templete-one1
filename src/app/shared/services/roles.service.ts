import { Injectable } from '@angular/core';
import { IUserRole } from '../interfaces/userInfo';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  constructor() {}

  // getSuperAdmin(): boolean {
  //   // let userData: IUserRole = JSON.parse(
  //   //   localStorage.getItem('userInfo') || ''
  //   // );

  //   // if (!userData || !userData.super_admin) {
  //   //   return false;
  //   // }

  //   // return true;
  // }

  getAdmin(): boolean {
    let userData: IUserRole = JSON.parse(
      localStorage.getItem('userInfo') || ''
    );

    if (!userData || !userData.is_admin) {
      return false;
    }

    return true;
  }

  getSuplier(): boolean {
    let userData: IUserRole = JSON.parse(
      localStorage.getItem('userInfo') || ''
    );

    if (!userData || !userData.supplier) {
      return false;
    }

    return true;
  }
}
