import { Component } from '@angular/core';
import { AccountService } from '../account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../shared/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { CartService } from '../../cart/cart.service';
import { ResponsiveService } from '../../shared/services/responsive.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../shared/models/user';
import { SettingsService } from '../../shared/services/settings.service';
import { Location } from '@angular/common';
import { FCMServiceService } from '../../shared/services/fcmservice.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone:false
})
export class LoginComponent {
 showMe: boolean = true;
  supplierID!: number;
  showpassword: boolean = false;
  supplier: any;
  storeId: any;
  loginForm:any;
  constructor(
    private accountService: AccountService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _toast: MessageService,
    public _auth: AuthService,
    private translate: TranslateService,
    private cartSer:CartService,
    private localStorageService: LocalStorageService,
    private _ResponsiveService:ResponsiveService,
    private _setting:SettingsService,
    private location: Location,
private _fcm:FCMServiceService
    //private _fcm:FCMService

  ) {
    this.returnUrl =
      this.activatedRoute.snapshot.queryParams['returnUrl'] || '/home';
  }
  returnUrl: string = '';

  cats: any;
  token: string = '';
  user?: User;
ngOnInit() {
    this._setting.loadSettings().subscribe(data => {

      this.storeId = data.storeId;
      this.loginForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    rememberMe: new FormControl(false),
    store_id: new FormControl(this.storeId),
  });
    
    });}
toggleShow() {
    this.showpassword = !this.showpassword;
}
onSubmit() {
    this.accountService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.cats = res;
        
        this.token = this.cats.token;
        this.localStorageService.set('userInfo', JSON.stringify(this.cats.currUserDetails));
        //console.log(res.data.user,'res.data.user')
        // this.accountService.loginStatus(true);
        this.localStorageService.set('token', this.cats.token);
        this.accountService.currentUserSource.next(this.cats.currUserDetails);
         // this.router.navigateByUrl(this.accountService.redirectUrl);
        this.accountService.loginStatus(false);
        this._fcm.requestPermission(this.cats.id);
        this.cartSer.updateUserByCardId(this.storeId);
        this._auth.updateUserByFavorities(this.storeId);
        this.cartSer.CartFromToken=true;
        this.cartSer.getCart(this.storeId);
        this._auth.getfaviorites(this.storeId);
       this._ResponsiveService.isFavorites$.subscribe({
          // next: (res) => {
          //   if(res==true)
          //   this.router.navigateByUrl('home');
          // },
          // error: (err) => {
          //  console.log(err);
           
          // },
           
        })
       
        //console.log(this.router.navigateByUrl(this.accountService.redirectUrl),'this.router.navigateByUrl(this.accountService.redirectUrl);');
        const currentPath = this.location.path();
      if (currentPath === '/cart'||currentPath === '/favorites/Items'
        ||currentPath ==='/favorites/lists'||currentPath ==='/profile/Order') {
        location.reload();
        return;
      }

        },
      error: (error) => {
        //this.showError(error.data.message);
        if (error.status === 401) {
          this._toast.add({
            severity: 'error',
            summary: this.translate.instant('error'),
            detail: this.translate.instant('Invalidcredentials'),
          });
         
          if (error.status === 422)
            this._toast.add({
              severity: 'error',
              summary: this.translate.instant('error'),
              detail: this.translate.instant('Thegivendatawasinvalid'),
            });
           
        }
      },
    });
}
OpenSignUp() {
    this.showMe = false;
    this.accountService.loginStatus(false);
    this.accountService.SingUpStatus(true);
    this.accountService.checkSignUp$.subscribe({
      next: (res) => {},
      error: (err) => {
        this._toast.add({
          severity: 'error',
          summary: this.translate.instant('error'),
          detail: err.error.message,
        });
       
      },
    });
}
closelogin() {
    this.showMe = false;
    this.accountService.loginStatus(false);
    this.accountService.checkLogin$.subscribe({
      next: (res) => {},
      error: (err) => {
        this._toast.add({
          severity: 'error',
          summary: this.translate.instant('error'),
          detail: err.error.message,
        });
       
      },
    });
}
openforgetpassword() {
    this.accountService.loginStatus(false);
    this.accountService.forgetpasswordStatus(true);
    //this.accountService.createnewpasswordStatus(true);
    this.accountService.checkforgetpassword$.subscribe({
      next: (res) => {
      },
      error: (err) => {
        this._toast.add({
          severity: 'error',
          summary: this.translate.instant('error'),
          detail: err.error.message,
        });
       
      },
    });
    this.accountService.checkLogin$.subscribe({
      next: (res) => {},
      error: (err) => {
        this._toast.add({
          severity: 'error',
          summary: this.translate.instant('error'),
          detail: err.error.message,
        });
       
      },
    });
}
}

