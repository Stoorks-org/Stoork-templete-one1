import { CanActivate, Router } from '@angular/router';

import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, map } from 'rxjs';
import { MessageService } from 'primeng/api';
import { AccountService } from 'src/app/account/account.service';
import { IUserRole } from '../interfaces/userInfo';

@Injectable({
  providedIn: 'root',
})
export class SupplierGuard implements CanActivate {
  // ______________properties_____________
  userData: IUserRole = JSON.parse(localStorage.getItem('userInfo') || '');
  
  // ______________properties_____________

  constructor(
    private _router: Router,
    private accSer: AccountService,
    private toast: MessageService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
      return this.accSer.currentUser$.pipe(
        map((auth) => {
          if (auth.supplier!=null||auth.is_admin||auth.super_admin) {
            return true ;
          } else {
            this.toast.add({
                  severity: 'error',
                  summary: 'Not Allowed ..!!',
                  detail: "Sorry... You don't have a supplier account ",
                });
  
            setTimeout(() => {
              this._router.navigateByUrl('/profile/Be_supplier');
                }, 3000);
            return false;
          }
        })
      );
    // if (

    //   this.userData.supplier !== null ||
    //   this.userData.is_admin ||
    //   this.userData.super_admin
    // ) {
    //   return true;
    // } else {
    //   this.toast.add({
    //     severity: 'error',
    //     summary: 'Not Allowed ..!!',
    //     detail: "Sorry... You don't have a supplier account ",
    //   });

    //   setTimeout(() => {
    //     this._router.navigateByUrl('/profile/Be_supplier');
    //   }, 3000);

    //   return false;
    // }
  }
}
