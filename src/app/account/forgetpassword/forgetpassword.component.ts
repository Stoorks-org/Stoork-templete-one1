import { Component } from '@angular/core';
import { AccountService } from '../account.service';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SettingsService } from '../../shared/services/settings.service';

@Component({
  selector: 'app-forgetpassword',
  templateUrl: './forgetpassword.component.html',
  styleUrl: './forgetpassword.component.scss'
})
export class ForgetpasswordComponent {
  showMe: boolean = true;
  email: any | null;
  storeId: any;
  forgetForm:any;
  constructor(
    private accountService: AccountService,
    private _toast: MessageService,
    private translate:TranslateService,
    private localStorageService: LocalStorageService,
    private _setting:SettingsService

    
  ) {}
  ngOnInit() {
    this._setting.loadSettings().subscribe(data => {

      this.storeId = data.storeId;
     
   this.forgetForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    store_id:new FormControl(this.storeId),
  });
 
    
    });}
  
  onSubmit() {
    this.accountService.forgetpasssword(this.forgetForm.value).subscribe({
      next: (response) => {
        this._toast.add({
          severity: 'success',
          summary: this.translate.instant('success'),
          detail: this.translate.instant('emailhasbeensent'),
        });
        
        this.email = this.forgetForm.controls['email'].value;
        this.accountService.forgetpasswordStatus(false);
        this.accountService.checkforgetpassword$.subscribe();
        //this.accountService.verifypasswordStatus(true);
        this.accountService.createnewpasswordStatus(true);
        this.accountService.checkverifypassword$.subscribe();
        //localStorage.setItem('email', this.email);
        this.localStorageService.set('email', this.email);
      },
      error: (error) => {
        this._toast.add({
          severity: 'error',
          summary: this.translate.instant('error'),
          detail: this.translate.instant('retryagain'),
        });
        // if (error.status === 422)
       
      },
    });
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
    this.accountService.forgetpasswordStatus(false);
    this.accountService.loginStatus(true);
    this.accountService.checkforgetpassword$.subscribe();
    this.accountService.checkLogin$.subscribe();
  }
  closelogin() {
    this.showMe = false;
    this.accountService.forgetpasswordStatus(false);
    this.accountService.checkforgetpassword$.subscribe({
      next: (res) => {},
      error: (err) => {},
    });
  }
}
