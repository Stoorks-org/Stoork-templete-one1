import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { NavMenuComponent } from './shared/components/nav-menu/nav-menu.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderCartComponent } from './cart/header-cart/header-cart.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { LoginComponent } from "./account/login/login.component";
import { RegisterComponent } from './account/register/register.component';
import { PasswordStrComponent } from './account/password-str/password-str.component';
import { ForgetpasswordComponent } from './account/forgetpassword/forgetpassword.component';
import { CreatenewpasswordComponent } from './account/createnewpassword/createnewpassword.component';
import { VerifyPasswordComponent } from './account/verify-password/verify-password.component';
import { FavoritiesModule } from './favorities/favorities.module';
import { PageComponent } from './shared/components/page/page.component';
import { HeaderNewComponent } from './shared/components/header-new/header-new.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/');
}
@NgModule({
  declarations: [
    AppComponent,HeaderComponent,FooterComponent,NavMenuComponent,
    HeaderCartComponent,
    LoginComponent,
    RegisterComponent,
    PasswordStrComponent,
    ForgetpasswordComponent,
    CreatenewpasswordComponent,
    VerifyPasswordComponent,
    PageComponent,
    HeaderNewComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    OverlayPanelModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    ToastModule,
    BrowserAnimationsModule,
    FavoritiesModule,
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
        }
    }),
    
],
  providers: [MessageService,{ provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule { }
