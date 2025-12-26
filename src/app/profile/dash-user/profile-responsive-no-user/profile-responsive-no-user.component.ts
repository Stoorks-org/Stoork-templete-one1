import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../shared/services/auth.service';
import { AccountService } from '../../../account/account.service';
import { ResponsiveService } from '../../../shared/services/responsive.service';
import { LocalStorageService } from '../../../shared/services/local-storage.service';

@Component({
  selector: 'app-profile-responsive-no-user',
  templateUrl: './profile-responsive-no-user.component.html',
  styleUrl: './profile-responsive-no-user.component.scss',
  standalone:false
})
export class ProfileResponsiveNoUserComponent {
showLang=false;
  langEn:boolean;
  strLangEn="en";
  strLangAr="ar";

  constructor(
    private translate: TranslateService,
    public _auth: AuthService,
    public accountService: AccountService,
    private _ResponsiveService:ResponsiveService,
    private localStorageService:LocalStorageService){
      this.langEn=_auth.isValueEn.value;
    }
    ngOnInit() {
      this._ResponsiveService.FavoriteStatus(true); 
    }
    changeLang() {
      if(this.langEn){
      this._auth.lang.next('en');
      this.localStorageService.set('lang', this.strLangEn);
      this.translate.use('en');
       this._auth.isValueEn.next(true);}
      else {
        this._auth.lang.next('ar');
      this.localStorageService.set('lang',this.strLangAr);
      this.translate.use('ar');
        this._auth.isValueEn.next(false);}
        this.showLang=false;
    }
    signIn(){
      this.accountService.loginStatus(true);
    }
    signUp(){
      this.accountService.SingUpStatus(true);
    }
    ngOnDestroy() {
    this._ResponsiveService.FavoriteStatus(false);
     }
}
