import { Component } from '@angular/core';
import { AccountService } from '../account.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { HomeserviceService } from '../../home/homeservice.service';
import { AuthService } from '../../shared/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { CartService } from '../../cart/cart.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../shared/models/user';
import { IUserInfo } from '../../shared/models/dashboard/profile';
import { SettingsService } from '../../shared/services/settings.service';
import { AccSerService } from '../../shared/services/acc-ser.service';
import { ToastMesssageService } from '../../shared/services/toast-messsage.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  standalone:false
})
export class RegisterComponent {
  storeId: any;
  showPassSt: boolean = false;
  registerForm!: FormGroup;
  
constructor(
    private accountService: AccountService,
    private router: Router,
    private fb: FormBuilder,
    private messageService: MessageService,
    private home: HomeserviceService,
    public _auth: AuthService,
    public translate:TranslateService,
    private cartSer:CartService,
    private localStorageService: LocalStorageService,
    private _setting:SettingsService,
    private _accountSer:AccountService,
    private _accSer: AccSerService,
    private toast: ToastMesssageService,
    private location: Location,
    
    

  ) { this._setting.loadSettings().subscribe(data => {

      this.storeId = data.storeId;
      this.registerForm = 
    this.fb.group({
      name: ['', Validators.required],
      email: [
        '',
        [
          Validators.required,
          // Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(8)]],
      agreeTerms: [false, Validators.required],
      store_id:[this.storeId],
      password_confirmation:[]
   
  });
    
    });}
  passwordIsValid = false;
  // stateOptions: any[] = [
  //   { label: 'Buyer', value: 'Buyer' },
  //   { label: 'Seller', value: 'Seller' },
  // ];
  showpassword: boolean = false;
  token: any;
  res: any;
  user?: User;
  showPassStr: boolean = false;

 
  showRegister: boolean = true;
  toggleShow() {
    this.showpassword = !this.showpassword;
  }
  onInputChange(e: Event) {
    if ((e.target as HTMLInputElement).value.toString() == '') {
      this.showPassStr = false;
      // console.log((e.target as HTMLInputElement).value, 'value');
      // console.log(this.showPassStr, ' this.showPassStr');
    }
  }
  closelogin() {
    this.showRegister = false;
    this.accountService.SingUpStatus(false);
  }
  onSubmitregister() {
    this.accountService.register(this.registerForm.value).subscribe({
      next: (res) => {
        this.res=res;
        
          let userData = JSON.stringify(this.res.user);
        // localStorage.setItem('userInfo', userData);
        // localStorage.setItem('token', this.res.token);
        this.localStorageService.set('userInfo', userData);
        this.localStorageService.set('token', this.res.token);
        this._accSer.updateUser(true);
        this._accountSer.loadCurrentUser(this.res.token);
         this.toast.showToast(
            'custom',
            'Success',
            "sign up success",
            'pi-thumbs-up',
            false
          );
          // this.toast.showToast(
          //   'custom',
          //   'Success',
          //   "sign up success",
          //   'pi-thumbs-up',
          //   false
          // );

        // //this.router.navigateByUrl('/home');
        // this.showSuccess(this.translate.instant('accountaddsuccessfully'));
        // this.accountService.SingUpStatus(false);
        // this.accountService.checkSignUp$.subscribe();
        // this.res = res;
        // this.token = this.res.data.token;
        // this.user = this.res.data.info;
        // //set user info into local storage
        // let userInfo: IUserInfo = {
        //   id: this.user?.id,
        //   full_name: this.user?.full_name,
        //   email: this.user?.email,
        //   phone_number: this.user?.phone_number,
        //   address: this.user?.address,
        //   image: this.user?.image,
        //   username: this.user?.username,
        // };

        // this.localStorageService.set('userInfo', JSON.stringify(userInfo));
        // this.localStorageService.set('token', this.token);
         this.accountService.currentUserSource.next(this.res.user);
        // console.log(this.res.data.info,'this.res.data.info');
        // //this.accountService.loadCurrentUser(this.token);
         this.cartSer.updateUserByCardId(this.storeId);
         this._auth.updateUserByFavorities(this.storeId);
          this.accountService.SingUpStatus(false);
          const currentPath = this.location.path();
      if (currentPath === '/cart'||currentPath === '/favorites/Items'||currentPath ==='/favorites/lists') {
        location.reload();
        return;
      }
        // this.router.navigateByUrl('home');
        // //this.router.navigateByUrl(this.accountService.redirectUrl);
      },
      error: (error) => {
       //console.log(error,'error');
       
        this.toast.showToast(
              'error',
              'OOops !',
              
              error.error.message,
              'pi-thumbs-down',
              false
            );
       // this.showError(error.error.message);
      },
    });
  }
  showSuccess(m: string | any) {
    this.messageService.add({
      severity: 'success',
      summary: this.translate.instant('success'),
      detail: m,
    });
  }
  showError(m: string | any) {
    this.messageService.add({
      severity: 'error',
      summary: this.translate.instant('error'),
      detail: m,
    });
  }
  OpenSignIn() {
    this.showRegister = false;
    this.accountService.loginStatus(true);
    this.accountService.SingUpStatus(false);
  }
  passwordValid(event: any) {
    this.passwordIsValid = event;
  }
  
}

