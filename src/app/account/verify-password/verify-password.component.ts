import { Component, ElementRef, ViewChild } from '@angular/core';
import { AccountService } from '../account.service';
import { AuthService } from '../../shared/services/auth.service';
import { MessageService } from 'primeng/api';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-verify-password',
  templateUrl: './verify-password.component.html',
  styleUrl: './verify-password.component.scss',
  standalone:false
})
export class VerifyPasswordComponent {
 @ViewChild('input0') input0!: ElementRef;
  @ViewChild('input1') input1!: ElementRef;
  @ViewChild('input2') input2!: ElementRef;
  @ViewChild('input3') input3!: ElementRef;
  @ViewChild('input4') input4!: ElementRef;
  @ViewChild('input5') input5!: ElementRef;
  inputBoxes = [
    this.input0,
    this.input1,
    this.input2,
    this.input3,
    this.input4,
    this.input5,
  ];
  
  handleInputChange(index: number) {
    if (
      index < this.inputBoxes.length - 1 &&
      this.inputBoxes[index].nativeElement.value.length === 1
    ) {
      this.inputBoxes[index + 1].nativeElement.focus();
    }
  }
  handlePaste(event: ClipboardEvent, index: number) {
    const clipboardData = event.clipboardData || (window as any).clipboardData;
    const pastedText = clipboardData.getData('text');
    const lines = pastedText.split('\n');
    const letters: string[] = [];
    
    for (let line of lines) {
      const lineLetters = line.split('');
      letters.push(...lineLetters);
    }
  
    for (let i = 0; i < letters.length && i + index < this.code.length; i++) {
      this.code[i + index] = letters[i].trim();
      //this.codeData+=this.code[i + index];
      // alert(this.code[i + index]);
    }
    // for (let i = 0; i < lines.length && i + index < this.code.length; i++) {
    //   this.code[i + index] = lines[i].trim();
      
    // }

    event.preventDefault();
  }
  handleKeyDown(event: KeyboardEvent, index: number) {
    if (
      event.key === 'Backspace' &&
      index > 0 &&
      this.inputBoxes[index].nativeElement.value.length === 0
    ) {
      event.preventDefault();
      this.inputBoxes[index - 1].nativeElement.focus();
    }
  }
  showMe: boolean = true;
  txt1: any;
  txt2: any;
  txt3: any;
  txt4: any;
  txt5: any;
  txt6: any;
  code: string[] = ['', '', '','','',''];
  codeData: any='';
  email: any;
  isEnterPressed: boolean = true;
  constructor(
    private accountService: AccountService,
    private _auth: AuthService,
    private messageService: MessageService,
    private _toast: MessageService,
    private translate:TranslateService
    ,private localStorageService: LocalStorageService

  ) {
    this.email = this.localStorageService.get('email');
  }
  // verifyForm = new FormGroup({
  //   txt1: new FormControl('', Validators.required),
  //   txt2: new FormControl('', Validators.required),
  //   txt3: new FormControl('', Validators.required),
  //   txt4: new FormControl('', Validators.required),
  //   txt5: new FormControl('', Validators.required),
  //   txt6: new FormControl('', Validators.required),
  // });
  onEnter(event: any) {
    this.isEnterPressed = true;
    // Perform any additional logic here
  }
  onSubmit() {
    for (let i = 0; i < this.code.length ; i++) {
     
      this.codeData+=this.code[i];
      // alert(this.code[i + index]);
    }
    this._auth.get('v4/api/verfiy-code/' + this.codeData).subscribe({
      next: (response) => {
        this.localStorageService.set('tokennew', response.token.token);
        // console.log(response, 'response');
        this.accountService.verifypasswordStatus(false);
        this.accountService.createnewpasswordStatus(true);
        this.accountService.checkverifypassword$.subscribe();
        this.accountService.checkcreatenewpassword$.subscribe();
      },
      error: (error) => {
        this._toast.add({
          severity: 'error',
          summary: this.translate.instant('error'),
          detail: this.translate.instant('thiscodeisnotcorrect'),
        });
      },
    });
  }
  ResendCode() {
    this.accountService.forgetpasssword({ email: this.email }).subscribe({
      next: (response) => {
        this._toast.add({
          severity: 'success',
          summary: this.translate.instant('success'),
          detail: this.translate.instant('emailhasbeensent'),
        });
        
      },
      error: (error) => {
        this._toast.add({
          severity: 'error',
          summary: this.translate.instant('error'),
          detail: this.translate.instant('retryagain'),
        });
        
      },
    });
  }
  showmessage(m: string | any, s: string | any) {
    this.messageService.add({
      severity: s,
      summary: s,
      detail: m,
    });
  }

  BackBtn() {
    this.showMe = false;
    this.accountService.forgetpasswordStatus(true);
    this.accountService.verifypasswordStatus(false);
    this.accountService.checkforgetpassword$.subscribe();
    this.accountService.checkverifypassword$.subscribe();
  }
  closelogin() {
    this.showMe = false;
    this.accountService.verifypasswordStatus(false);
    this.accountService.checkverifypassword$.subscribe({
      next: (res) => {
        // console.log(res, 'close');
      },
      error: (err) => {
        this._toast.add({
          severity: 'error',
          summary: this.translate.instant('error'),
          detail:err.error.message,
        });
        
       
      },
    });
  }

  move(e: any, p: any, c: any, n: any) {
    // this.isEnterPressed = true;
    var val = '';
    var lenght = c.value.length;

    var maxlenght = c.getAttribute('maxlength');

    if (lenght == maxlenght)
      if (n != '') {
        n.focus();

        c.classList.add('active');

        n.classList.add('active');
      }
    if (lenght != maxlenght) {
      if (n != '') {
        n.classList.remove('active');
      }
      c.classList.remove('active');
    }
    if (e.key === 'Backspace') {
      if (p != '') {
       // console.log(p, 'p');
        p.focus();
      }
    }
  }
}
