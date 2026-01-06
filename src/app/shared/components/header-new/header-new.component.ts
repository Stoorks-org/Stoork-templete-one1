import { Component, Inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FavoriteService } from '../../../favorities/favorite.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../../account/account.service';
import { DOCUMENT } from '@angular/common';
import { CartService } from '../../../cart/cart.service';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService } from '../../services/settings.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { ResponsiveService } from '../../services/responsive.service';

@Component({
  selector: 'app-header-new',
  templateUrl: './header-new.component.html',
  styleUrl: './header-new.component.scss',
  standalone:false
})
export class HeaderNewComponent {
storeLogo: any;
returnUrl: string = '';
currentLang:any;
  storeId: any;
  storeName: any;
  is_Admin: boolean = false;
  superAdmin: boolean = false;
  isResponsive=false;
  isResponsiveFav=false;
  isResponsiveCart=false;
  isResponsiveCategory=false;
  isResponsiveProfile=false;
   lang?: any = 'en';
 constructor(
    @Inject(DOCUMENT) private dom: Document,
    public accountService: AccountService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public fav: FavoriteService,
    //private HomeSer: HomeserviceService,
    public _aut: AuthService,
    
    public cartService: CartService,
    private translate: TranslateService,
    
    private _ResponsiveService:ResponsiveService,
    private _setting:SettingsService,
    private localStorageService:LocalStorageService,
  ) {
    // this.currentLang = localStorage.getItem('lang') || '';
    // this.currentLang = this._aut.lang.value;
    this.fav.itemsLength.subscribe();
    this.cartService.CartCount.subscribe();
    this.returnUrl =
      this.activatedRoute.snapshot.queryParams['returnUrl'] || '/home';
    this.currentLang = this.localStorageService.get('lang')
      ? this.localStorageService.get('lang')
      : 'en';
      
    //
  }
   ngOnInit(): void {
    this._setting.loadSettings().subscribe(data => {

      this.storeId = data.storeId;
      this.storeName = data.storeName;
      this.storeLogo=data.logoPath;
      
    
    });
   this._ResponsiveService.isProfile$.subscribe({next: (res) => {
    this.isResponsiveProfile = res;
  }, error: (err) => {
    console.log(err);
  },} )
    this._ResponsiveService.isCategory$.subscribe({next: (res) => {
      this.isResponsiveCategory = res;
      //this.isResponsive=res;
     },
     error: (err) => {
       console.log(err);
     },} )
      this._ResponsiveService.isProductDetails$.subscribe({next: (res) => {
        this.isResponsive = res;
      },
      error: (err) => {
        console.log(err);
      }} )
      this._ResponsiveService.isFavorites$.subscribe({next: (res) => {
        this.isResponsiveFav = res;
      },
      error: (err) => {
        console.log(err);
      }} )
      this._ResponsiveService.isCart$.subscribe({next: (res) => {
        this.isResponsiveCart = res;
      },
      error: (err) => {
        console.log(err);
      }} )
   // this.userData = JSON.parse(localStorage.getItem('userInfo') || '');
    

    //this.is_Admin = this._roles.getAdmin();
   // this.superAdmin = this._roles.getSuperAdmin();
  }
   changeLang(st: string) {
    this.currentLang = st;
    this._aut.lang.next(st);
   // localStorage.setItem('lang', st);
   this.localStorageService.set('lang', st)
    this.translate.use(st);
    //this._aut.lang.next(st);
    // this._aut.lang.subscribe(value => {
    //   this._aut.isValueEn.next(value === 'en');
    // });
    if (st == 'en') this._aut.isValueEn.next(true);
    else this._aut.isValueEn.next(false);
    //console.log(this._aut.isValueEn.value, 'his._aut.isValueEn');
  }
   signIn(){
  this.accountService.loginStatus(true);
}
signUp(){
  this.accountService.SingUpStatus(true);
}
}
