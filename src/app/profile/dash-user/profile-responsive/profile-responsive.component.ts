import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../shared/services/auth.service';
import { Router } from '@angular/router';
import { AccountService } from '../../../account/account.service';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { ResponsiveService } from '../../../shared/services/responsive.service';

@Component({
  selector: 'app-profile-responsive',
  templateUrl: './profile-responsive.component.html',
  styleUrl: './profile-responsive.component.scss'
})
export class ProfileResponsiveComponent {
 userData:any;
  generalInfo!: FormGroup;
  chanagePassForm!: FormGroup;
  showLang:boolean=false;
  langEn:boolean;
  strLangEn="en";
  strLangAr="ar";
  constructor(
    private _fb: FormBuilder,
    private _toast: MessageService,
    public _auth: AuthService,
    private _route: Router,
    public accountService: AccountService,
    private translate: TranslateService,
    private router: Router,
    private localStorageService:LocalStorageService,
    private _ResponsiveService:ResponsiveService,
  ) {
    this.generalInfo = this._fb.group({
      lang: [''],
      name: [''],
      email: [''],
      password: [''],
      phone_number: [''],
    });
    this.langEn=_auth.isValueEn.value;
  }
  ngOnInit() {
    this._ResponsiveService.FavoriteStatus(true);
    this.getUserData();
    
  }
  ngOnDestroy() {
    this._ResponsiveService.FavoriteStatus(false);
  }
  changeLang() {
    if(this.langEn){
    this._auth.lang.next('en');
    this.localStorageService.set('lang',this.strLangEn);
    this.translate.use('en');
     this._auth.isValueEn.next(true);}
    else {
      this._auth.lang.next('ar');
    this.localStorageService.set('lang', this.strLangAr);
    this.translate.use('ar');
      this._auth.isValueEn.next(false);}
      this.showLang=false;
  }
  capitalizedLetters(name: string | undefined): string {
    if (name) {
      const words = name.split(' ');
      const firstLetters = words
        .filter((word) => word.length > 0)
        .map((word) => word.charAt(0).toUpperCase());
      return firstLetters.join(' ');
    }
    return '';
  }
  getUserData(): void {
    let url = 'auth/my/profile';
    this._auth.get(url, true).subscribe({
      next: (res) => {
        this.localStorageService.set('userInfo', JSON.stringify(res.data));

        this.userData = res.data;
        //this.accountService.loadCurrentUser(localStorage.getItem('token'));
       // console.log(this.userData, 'from get func');
        this.generalInfo.patchValue({
          name: this.userData?.name,
          email: this.userData?.email,
          phone_number: this.userData.phone_number,
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  logOut(){
    this.accountService.logout();
    this.router.navigateByUrl('/home');
  }
}
