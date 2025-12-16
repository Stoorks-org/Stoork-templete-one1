import { CanActivate, Router } from '@angular/router';

import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, map } from 'rxjs';
import { MessageService } from 'primeng/api';

import { TranslateService } from '@ngx-translate/core';
import { AccountService } from '../../account/account.service';


@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  // ______________properties_____________
  _token: string = localStorage.getItem('token') || '';
  // ______________properties_____________
  constructor(private accSer: AccountService, private toast: MessageService,private translate:TranslateService,private _router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.accSer.currentUser$.pipe(
      map((auth) => {
        if (auth) {
          //alert(auth)
          return true;
        } else {
          this.toast.add({
            severity: this.translate.instant('error'),
            summary:this.translate.instant('AnErrorOccurred') ,
            detail: this.translate.instant('YouMustRegisterFirst'),
          });

          setTimeout(() => {
            this._router.navigateByUrl('/auth');
          }, 1500);
          return false;
        }
      })
    );
  }
}
