import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  Inject,
  HostListener,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
//import { AccountService } from 'src/app/account/account.service';
import { User } from '../../models/user';

//import { HomeserviceService } from 'src/app/home/homeservice.service';
import { AuthService } from '../../services/auth.service';
import { SearchService } from '../../services/search.service';
//import { CartService } from 'src/app/add-to-cart/cart.service';
//import { FavoriteService } from 'src/app/favoritenew/favorite.service';
import { DOCUMENT } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
//import { utils } from 'src/app/shared/utils/utils';
import { RolesService } from '../../services/roles.service';
import { ResponsiveService } from '../../services/responsive.service';

import { FavoriteService } from '../../../favorities/favorite.service';
import { CartService } from '../../../cart/cart.service';
import { environment } from '../../../environments/environment';
import { SettingsService } from '../../services/settings.service';
import { AccountService } from '../../../account/account.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { filter, Observable, take } from 'rxjs';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone:false
})
export class HeaderComponent implements OnInit, OnChanges {
  //*_________________properties__________________
  baseLinkUrl: string = environment.apiUrl;
  showRegister: boolean | undefined;
  currentLang: string | null;
  visiblesignup: boolean = false;
  searchVal: any;

  openSideVal: boolean = false;
  EmailValue: string = '';
  PasswordValue: string = '';
  userData: any;
  lang?: any = 'en';
  is_Admin: boolean = false;
  superAdmin: boolean = false;
  isResponsive=false;
  isResponsiveFav=false;
  isResponsiveCart=false;
  isResponsiveCategory=false;
  isResponsiveProfile=false;
  NavCategory:any;
  FooterData:any;
  storeId:any;
  storeName:any;
  storeLogo: any;
  //visible:boolean = false;//for sing in dialog
  //*_________________properties__________________
  constructor(
    @Inject(DOCUMENT) private dom: Document,
    public accountService: AccountService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public fav: FavoriteService,
    //private HomeSer: HomeserviceService,
    public _aut: AuthService,
    private searchSer: SearchService,
    public cartService: CartService,
    private translate: TranslateService,
    private _roles: RolesService,
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
  returnUrl: string = '';
  res: any;
  navCat: any;
  categories: any;
  cart: any;
  SearchProducts: any = [];
  Search = false;
  productItems: any;
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
    this.getNavCategory();

    //this.is_Admin = this._roles.getAdmin();
   // this.superAdmin = this._roles.getSuperAdmin();
  }
   

navigateToProfile() {
  this.accountService.currentUser$.pipe(
    filter(user => !!user),
    take(1)
  ).subscribe(() => {
    this.router.navigate(['/profile']);
  });
}

navigateToOrder(){
  this.accountService.currentUser$.pipe(
    filter(user => !!user),
    take(1)
  ).subscribe(() => {
    alert(this.user?.id)
    this.router.navigate(['/profile/Order']);
  });
}

  ngOnChanges(): void {}
  getFooterNavData() {
    this._aut.get('api/v1/home/body').subscribe({
      next: (response) => {
       
            this.NavCategory=response.data.navigation.sort((a:any, b:any) => a.order - b.order);;
            
            this.FooterData=response.data.footer.sort((a:any, b:any) => a.order - b.order);;;
            console.log(this.FooterData,'this.FooterData');
       
      },
      error: (error) => console.log(error),
    });
  }
  //*_________________[Methodss]_________________
  //?____________________________________________
  //scrolling Method
  @HostListener('window:scroll', ['$event']) onscroll(e: Event | any) {
    let header = this.dom.querySelector('.header');
    if (window.scrollY >= 600) {
      header?.classList.add('fixedHeader');
    } else {
      header?.classList.remove('fixedHeader');
    }
    if (window.scrollY >= 30) {
      header?.classList.add('fixedHeaderRes');
    } 
    else {
      header?.classList.remove('fixedHeaderRes');
    }
  }
  
  //____________________________________________

  showSearch() {
    this.Search = !this.Search;
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
  openSideFunc() {
    this.openSideVal = !this.openSideVal;
  }
  // openloginfun() {
  //   this.showMe = true;
  // }
  // applyFilter(e: Event) {
  //   this.searchVal = (e.target as HTMLInputElement).value;
  //   this.searchSer.search.next(this.searchVal);
  //   //console.log(this.searchVal);
  // }
  applyFilter(e: Event) {
    this.searchVal = (e.target as HTMLInputElement).value;
    this.Search = true;
    this.searchSer.search.next(this.searchVal);
    this._aut.get(`v3/api/${this.storeId}/products?q=${this.searchVal}`).subscribe({
      next: (response) => {
        this.res = response;
        this.SearchProducts = this.res.data.items;
      },
      error: (error) => console.log(error),
    });
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

  //-----dioalog sin in-----

  showDialogsignup() {
    this.visiblesignup = true;
  }

  cats: any;
  token: string = '';
  user?: User;
  logOut() {

     this.accountService.logout();
    //this._aut.getCartnumber();
    this._aut.getfaviorites(this.storeId);
  }

  // signinfun() {
  //   //alert('enter');
  //   window.scrollTo(0, 0);

  //   this.accountService.loginStatus(true);

  //   this.accountService.checkLogin$.subscribe({
  //     next: (res) => {
  //       // console.log(res, 'siginfun');
  //     },
  //     error: (err) => {
  //       console.log(err);
  //     },
  //   });
  // }
  getNavCategory() {
    this._aut.get('api/v1/navbar/cateogries', true).subscribe({
      next: (response) => {
        this.res = response;
        this.categories = this.res?.data;
        this.navCat = this.categories?.slice(0, 9);
      },
      error: (error) => {
        console.log(error.message);
      },
    });
  }
signinfun() {
    //alert('enter');
    

    this.accountService.loginStatus(true);
    window.scrollTo(0, 0);
    this.accountService.checkLogin$.subscribe({
      next: (res) => {
        // console.log(res, 'siginfun');
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  signIn(){
  this.accountService.loginStatus(true);
}
signUp(){
  this.accountService.SingUpStatus(true);
}
  // for test
  // reloadPage() {
  //   console.log('reload');

  //   this._aut.reload();
  // }
}
