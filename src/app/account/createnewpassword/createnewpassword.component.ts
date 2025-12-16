import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { passwordMatch } from '../../shared/validetors/passwordMatch';
import { AccountService } from '../account.service';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../shared/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { SettingsService } from '../../shared/services/settings.service';

@Component({
  selector: 'app-createnewpassword',
  templateUrl: './createnewpassword.component.html',
  styleUrl: './createnewpassword.component.scss'
})
export class CreatenewpasswordComponent {
 showpassword: boolean = false;
  showpassword1: boolean = false;
  email: string | null | undefined;
  code: string | null | undefined;
  showPassStr: boolean = false;
  storeId:any;
  newpassword = new FormGroup(
    {
      code: new FormControl('', 
        [Validators.required]),
      password: new FormControl('', [
        Validators.required,
        // Validators.pattern(
        //   '^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'
        // ),
      ]),
      confirm_password: new FormControl('', [
        Validators.required,
        // Validators.pattern(
        //   '^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'
        // ),
      ]),
    },
    //[passwordMatch('password','confirm_password')]
  );
  showMe: boolean = true;
  toggleShow() {
    this.showpassword = !this.showpassword;
  }
  toggleShow1() {
    this.showpassword1 = !this.showpassword1;
  }
  constructor(
    private accountService: AccountService,
    private _toast: MessageService,
    public _auth: AuthService,
    private translate:TranslateService,private localStorageService: LocalStorageService,
    private _setting:SettingsService

  ) {}
ngOnInit() {
    this._setting.loadSettings().subscribe(data => {
      this.storeId = data.storeId;
    });}
  onSubmit() {
    //this.email = this.localStorageService.get('email');
    //this.email = localStorage.getItem('email');
   if (this.newpassword?.controls.password.value != this.newpassword?.controls.confirm_password.value) {
      this._toast.add({
        severity: 'error',
        summary: this.translate.instant('OOPS'),
        detail: this.translate.instant('CantUpdatePasswordNotMatching'),
      });

   }
   else{
    this.accountService
      .createnewpassword({
       // token: this.localStorageService.get('tokennew'),
        code:this.newpassword.controls.code.value ,
        password: this.newpassword.controls.password.value,
        ///////
        // "current_password": "oldpassword123",
        // "new_password": "newpassword456",
        // "new_password_confirmation": "newpassword456",
        // "store_id": 1
      })
      .subscribe({
        next: (response) => {
          if (response) 
            this._toast.add({
              severity: 'success',
              summary: this.translate.instant('success'),
              detail: this.translate.instant('passwordhasbeenChange'),
            });
            
           
          this.accountService.createnewpasswordStatus(false);
          this.accountService.checkcreatenewpassword$.subscribe();
        },
        error: (error) => {
          this._toast.add({
            severity: 'error',
            summary: this.translate.instant('error'),
            detail:error.error.message,
          });
        },
      });
          
       }   
  }

  // showmessage(m: string | any, s: string | any) {
  //   this.messageService.add({
  //     severity: s,
  //     summary: s,
  //     detail: m,
  //   });
  // }

  BackBtn() {
    this.showMe = false;
    this.accountService.createnewpasswordStatus(false);
    this.accountService.verifypasswordStatus(true);
    this.accountService.checkcreatenewpassword$.subscribe({
      next: (res) => {
        // console.log(res, 'close');
      },
      error: (err) => {
        this._toast.add({
          severity: 'error',
          summary: this.translate.instant('error'),
          detail: err.error.message,
        });
      },
    });
    this.accountService.checkcreatenewpassword$.subscribe({
      next: (res) => {
        //  console.log(res, 'close');
      },
      error: (err) => {
        this._toast.add({
          severity: 'error',
          summary: this.translate.instant('error'),
          detail: err.error.message,
        });
       
        //console.log(err);
      },
    });
  }
  closelogin() {
    this.accountService.createnewpasswordStatus(false);
    this.accountService.checkcreatenewpassword$.subscribe({
      next: (res) => {
        //console.log(res, 'close');
      },
      error: (err) => {
        this._toast.add({
          severity: 'error',
          summary: this.translate.instant('error'),
          detail: err.error.message,
        });
        
      },
    });

    // this.showMe = false;
    // this.accountService.forgetpasswordStatus(false);
    // this.accountService.checkforgetpassword$.subscribe({
    //   next: (res) => {
    //     console.log(res, 'close');
    //   },
    //   error: (err) => {
    //     console.log(err);
    //   },
    // });
  }
  get passwordMismatch(): boolean|any {
  return (
    this.newpassword.get('password')?.value !== this.newpassword.get('confirm_password')?.value &&
    this.newpassword.get('confirm_password')?.touched
  );
}
}