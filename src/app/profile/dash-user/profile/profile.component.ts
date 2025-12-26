import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../shared/services/auth.service';
import { Router } from '@angular/router';
import { AccountService } from '../../../account/account.service';
import { ResponsiveService } from '../../../shared/services/responsive.service';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { SettingsService } from '../../../shared/services/settings.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  standalone:false
})
export class ProfileComponent {
 generalInfo: FormGroup;
  chanagePassForm: FormGroup;
  userData!:  any;
  updateUrl: string = '';
  chanagePassDialog: boolean = false;
  storeId:any;
  showPass: any = {
    showOne: false,
    showTwo: false,
    showThree: false,
    showFour: false,
  };

  // ______________properties_________________

  constructor(
    private _fb: FormBuilder,
    private _toast: MessageService,
    public _auth: AuthService,
    private _route: Router,
    private accountService: AccountService,
    private _ResponsiveService:ResponsiveService,
    private translate:TranslateService
    ,private localStorageService:LocalStorageService,
     private _setting:SettingsService,
  ) {
    // general info
    this.generalInfo = this._fb.group({
      lang: [''],
      name: [''],
      email: [''],
      password: [''],
      phone_number: [''],
    });

    // chanage password info
    this.chanagePassForm = this._fb.group({
      old_password: [''],
      newPassword: [''],
      confirm_password: [''],
    });

    // get user data
   // this.userData = JSON.parse(this.localStorageService.get('userInfo') || '');
  }

  ngOnInit(): void {
   

    this.updateUrl = `v3/api/auth/update-profile`;
    this.getUserData();
    this.getPhoto();
   
    this._ResponsiveService.ProfileStatus(true);
    this._setting.loadSettings().subscribe(data => {

      this.storeId = data.storeId;
       
   
    });
  }
  ngOnDestroy() {
    this._ResponsiveService.ProfileStatus(false);
  }
  // todo_____________________ [ get methods ]______________________
  // ?______________________________________________________________

  get fName() {
    return this.generalInfo.get('fName');
  }

  get name() {
    return this.generalInfo.get('name');
  }

  // security info
  get email() {
    return this.generalInfo.get('email');
  }

  get password() {
    return this.generalInfo.get('password');
  }

  get phone_number() {
    return this.generalInfo.get('phone_number');
  }

  // update password
  get old_password() {
    return this.chanagePassForm.get('old_password');
  }

  get newPassword() {
    return this.chanagePassForm.get('newPassword');
  }

  get confirm_password() {
    return this.chanagePassForm.get('confirm_password');
  }

  // *_____________________ [ other methods ]______________________
  // ?_____________________________________________________________
  getUserData(): void {
   
    let url = 'auth/my/profile';
    this._auth.get(url, true).subscribe({
      next: (res) => {
        this.localStorageService.set('userInfo', JSON.stringify(res.data));

        this.userData = res.data;
       // this.accountService.loadCurrentUser(localStorage.getItem('token'));
       // console.log(this.userData, 'from get func');
        this.generalInfo.patchValue({
          name: this.userData.name,
          email: this.userData?.email,
          phone_number: this.userData.phone_number,
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getPhoto(): string {
    if (this.userData.image?.startsWith('http')) {
      return this.userData.image;
    }

    return '/assets/images/profile/userProfile/person.png';
  }

  chanageProfilePhoto(e: Event | any) {
    let file_form = new FormData();
    file_form.append('image', e.target.files[0]);
    file_form.append('store_id', this.storeId);
    this.updateUrl += '?_method=put';
    this._auth.postfile(this.updateUrl, file_form).subscribe({
      next: (res) => {
        this._toast.add({
          severity: 'success',
          summary: this.translate.instant('success'),
          detail: res.data,
        });

        this.getUserData();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  deleteProfilePhoto() {}

  showChanagePassDialog(): void {
    this.chanagePassDialog = !this.chanagePassDialog;
  }

  showPassWord(str: string): void {
    this.showPass[str] = !this.showPass[str];
    this.getType(str);
  }

  getType(str: string): string {
    if (!this.showPass[str]) {
      return 'password';
    }
    return 'text';
  }

  updateInfo(): void {
    let url: string = `v3/api/auth/update-profile`;
  
    let upData: any = this.generalInfo.value;
    let data: FormData = new FormData();

    for (const key in upData) {
      let item = upData[key];
      if (item != '' && item != this.userData[key]) {
        data.append(key, `${item}`);
      }
    }

    url += '?_method=put';
    this._auth.postfile(url, data).subscribe({
      next: (res) => {
        this.getUserData();
        this._toast.add({
          severity: 'success',
          summary: this.translate.instant('success'),
          detail: res.data,
        });
      },
      error: (err) => {
        let error: any = err.error.errors;
        let errMessage: string = '';
        for (const key in error) {
          let item = error[key][0];
          errMessage += '\n ' + item;
        }

        this._toast.add({
          severity: 'error',
          summary: this.translate.instant('error'),
          detail: errMessage,
        });
        console.log(err);
      },
    });
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
  // deleteAccount() {
  //   let url = `api/v1/user/profile`;

  //   this._auth.delete(url, true).subscribe({
  //     next: (res) => {
  //     //  console.log(res);
  //       this._toast.add({
  //         severity: 'success',
  //         summary: this.translate.instant('success'),
  //         detail: this.translate.instant('profileHasbeenDeletedSuccessfuly'),
  //       });

  //       this._route.navigateByUrl('/home');
  //     },
  //     error: (err) => {
  //       console.log(err);
  //       this._toast.add({
  //         severity: 'error',
  //         summary: this.translate.instant('error'),
  //         detail: this.translate.instant('profilecantremovednowpleasetryagain'),
  //       });
  //     },
  //   });
  // }

  // update pass
  updatePass() {
    let url: string = 'v3/api/auth/change-password';
    let data= {
      current_password: this.old_password?.value,
      new_password: this.newPassword?.value,
      new_password_confirmation:this.newPassword?.value,
      store_id:this.storeId
    };

    if (this.newPassword?.value != this.confirm_password?.value) {
      this._toast.add({
        severity: 'error',
        summary: this.translate.instant('OOPS'),
        detail: this.translate.instant('CantUpdatePasswordNotMatching'),
      });
    } else {
      this._auth.post(url, data).subscribe({
        next: (res) => {
          this._toast.add({
            severity: 'success',
            summary: this.translate.instant('success'),
            detail: this.translate.instant('ThePasswordhasbeenUpdatedsuccessfuly'),
          });
          this.chanagePassDialog = false;
        },
        error: (err) => {
          let error: any = err.error.errors;
          let errMessage: string = '';
          for (const key in error) {
            let item = error[key][0];
            errMessage += '\n ' + item;
          }

          this._toast.add({
            severity: 'error',
            summary: this.translate.instant('error'),
            detail: errMessage,
          });
          console.log(err);
        },
      });
    }
  }
}
