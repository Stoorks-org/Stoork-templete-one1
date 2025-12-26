import { Component } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { SettingsService } from '../../shared/services/settings.service';

@Component({
  selector: 'app-dash-user',
  templateUrl: './dash-user.component.html',
  styleUrl: './dash-user.component.scss',
  standalone:false
})
export class DashUserComponent {
 logInProfile: string = '';
  userData: any;
  openSideVal: boolean = false;
  lang?: any = 'en';
  noUser: boolean=false;
  strLangEn="en";
  strLangAr="ar";
  storeId:any;
  storeName:any;
  storeLogo:any;
  // ____________properties_______________

  constructor(
    //private _proSer: ProfileService,
    public _aut: AuthService
    ,private localStorageService:LocalStorageService,
    private _setting:SettingsService
  ) {
    JSON.stringify(this.localStorageService.set('logDash', 'logInDash'));
    const user=this.localStorageService.get('userInfo');
    if(user){
    this.userData = JSON.parse(this.localStorageService.get('userInfo') || '');}
    else{this.noUser=true;}
    this.lang = this.localStorageService.get('lang')
      ? this.localStorageService.get('lang')
      : 'en';
  }

  ngOnInit(): void {
    this._setting.loadSettings().subscribe(data => {

      this.storeId = data.storeId;
      this.storeName = data.storeName;
      this.storeLogo=data.logoPath;
      
    
    });
    //this.showNavMenu();
  }

  // *_____________________ [ methods ]______________________
  // ?_______________________________________________________

  // showNavMenu(): void {
  //   this.logInProfile = this.localStorageService.get('logDash') || '';
  //   if (this.logInProfile != '') {
  //     this._proSer.logged(true);
  //   } else {
  //     this._proSer.logged(false);
  //   }
  // }

  // ngOnDestroy(): void {
  //   this._proSer.logged(false);
  //   this.localStorageService.remove('logDash');
  // }

  // openSideFunc(): void {
  //   this.openSideVal = !this.openSideVal;
  // }
}
