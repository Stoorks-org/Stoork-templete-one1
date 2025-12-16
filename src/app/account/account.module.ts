import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
//import { LoginComponent } from './login/login.component';
//import { RegisterComponent } from './register/register.component';
import { TranslateModule } from '@ngx-translate/core';
import { ToastModule } from 'primeng/toast';
import { PasswordStrComponent } from './password-str/password-str.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ForgetpasswordComponent } from './forgetpassword/forgetpassword.component';
import { CreatenewpasswordComponent } from './createnewpassword/createnewpassword.component';
import { VerifyPasswordComponent } from './verify-password/verify-password.component';


@NgModule({
  declarations: [
   // LoginComponent,
    //RegisterComponent,
    //PasswordStrComponent
  
    //ForgetpasswordComponent
  
    //CreatenewpasswordComponent
  
    //VerifyPasswordComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    TranslateModule,ToastModule,
    ReactiveFormsModule
  ]
})
export class AccountModule { }
