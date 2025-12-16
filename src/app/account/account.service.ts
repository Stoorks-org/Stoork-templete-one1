import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { User } from '../shared/models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { FavoriteService } from '../favorities/favorite.service';
import { CartService } from '../cart/cart.service';
import { BehaviorSubject, Observable, of, ReplaySubject } from 'rxjs';
import { SettingsService } from '../shared/services/settings.service';
import { LocalStorageService } from '../shared/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
baseUrl = environment.apiUrl;
  cats: any;
  token: string = '';
  user?: User | null;
  public redirectUrl: string='';
  allAddress:any;
  storeId:any;
  constructor(
    private http: HttpClient,
    private router: Router,
    private fav: FavoriteService,
    private cartSer: CartService ,
    private _router: Router,
    private localStorageService: LocalStorageService,
    private _setting:SettingsService
    //private localStorageService: LocalStorageService,

   // @Inject(PLATFORM_ID) private platformId: any // Injecting platform ID
  ) {
    // if (isPlatformBrowser(this.platformId)) {
    //   this.token = this.localStorageService.get('token') || '';
    // }
    //this.loadCurrentUser(this.token);
     this.token = this.localStorageService.get('token')|| '';
     this._setting.loadSettings().subscribe(data => {

      this.storeId = data.storeId;
      
    });
  }

  // *___________________observables___________________________________
  // *_________________________________________________________________

  public currentUserSource = new ReplaySubject<any | null>(1);
  currentUser$ = this.currentUserSource.asObservable();

  // for login
  private isUserLogin = new BehaviorSubject<boolean>(false);
  checkLogin$ = this.isUserLogin.asObservable();

  private isUserLoginCart = new BehaviorSubject<boolean>(false);
  checkLoginCart$ = this.isUserLoginCart.asObservable();

  // for create account (sin-up )
  private isUserSingUp = new BehaviorSubject<boolean>(false);
  checkSignUp$ = this.isUserSingUp.asObservable();

  // for forget password
  private isUserforgetpassword = new BehaviorSubject<boolean>(false);
  checkforgetpassword$ = this.isUserforgetpassword.asObservable();

  // for user verifypassword
  private isUserverifypassword = new BehaviorSubject<boolean>(false);
  checkverifypassword$ = this.isUserverifypassword.asObservable();

  // for create new password
  private isUsercreatenewpassword = new BehaviorSubject<boolean>(false);
  checkcreatenewpassword$ = this.isUsercreatenewpassword.asObservable();

  // *_____________________ [ methods ]______________________
  // ?_______________________________________________________

  loginStatus(status: boolean): void {
    this.isUserLogin.next(status);
  }
  loginCartStatus(status: boolean): void {
    this.isUserLoginCart.next(status);
  }
  SingUpStatus(status: boolean): void {
    this.isUserSingUp.next(status);
  }

  forgetpasswordStatus(status: boolean): void {
    this.isUserforgetpassword.next(status);
  }

  verifypasswordStatus(status: boolean): void {
    this.isUserverifypassword.next(status);
  }

  createnewpasswordStatus(status: boolean): void {
    this.isUsercreatenewpassword.next(status);
  }

  register(values: any) {
    return this.http.post(this.baseUrl + '/v3/api/auth/register', values);
  }

  login(values: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/v3/api/auth/login', values);

  }

  

  loadCurrentUser(token: any) {
    if (token != null&&token != '') {
      console.log('loadCurrentUser');
      
      let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    return this.http
      .get<any>(this.baseUrl + `/auth/my/profile`, { headers })
      .subscribe({
        next: (res) => {
          console.log(res.data,'current user');
           this.localStorageService.set('userInfo', JSON.stringify(res.data));
          //localStorage.setItem('userInfo', JSON.stringify(res.data));
          this.currentUserSource.next(res.data);
          // this.allAddress=res.data.address;
          // const defaultAddress = this.allAddress.find((address: any) => address.is_default == true);
          // console.log(defaultAddress, 'address');
          // if (defaultAddress) {
          //'/auth/my/profile'
          //   this.cartSer.Shipping = defaultAddress.governorate.extra_charge;
  
  
          // }
          
          //this.router.navigateByUrl(this.redirectUrl);
          return res.data;
        },
        error: (error) => 
        console.log(error),
      });

    }
      
    
   else{
   
      this.currentUserSource.next(null);
      return of(null);
 
    
  }}
  logout() {
    // this.localStorageService.remove('token');
   localStorage.removeItem('token');
    this.currentUserSource.next(null);

    this.fav.itemsLength.next(0);
    this.cartSer.SetCartCount(0,0);
    this.loginStatus(false);
   this.cartSer.getCart(this.storeId);
 
  this.cartSer.deleteLocalBasket();
  //  this.localStorageService.remove('userInfo'); 
   localStorage.removeItem('userInfo'); 
   this.router.navigateByUrl('\home');
    
    
  }

  forgetpasssword(values: any) {
    return this.http.post(this.baseUrl + '/v3/api/auth/reset-password', values);
  }
  createnewpassword(values: any) {
    return this.http.post(this.baseUrl + '/v4/api/reset-password', values);
  }
  
}
