import { ToastModule } from 'primeng/toast';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CartRoutingModule } from './cart-routing.module';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
//import { FinishCheckoutComponent } from './checkout/finish-checkout/finish-checkout.component';
//import { SelectModule } from 'primeng/select';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { FinishCheckoutComponent } from './checkout/finish-checkout/finish-checkout.component';
import { CheckoutWithoutRegisterComponent } from './checkout-without-register/checkout-without-register.component';
import { FinishCeckouyWithoutRegisterComponent } from './checkout-without-register/finish-ceckouy-without-register/finish-ceckouy-without-register.component';
import { DropdownModule } from 'primeng/dropdown';
@NgModule({
  declarations: [
    CartComponent,
    CheckoutComponent,
    FinishCheckoutComponent,
    CheckoutWithoutRegisterComponent,
    FinishCeckouyWithoutRegisterComponent,
    //FinishCheckoutComponent,
    //HeaderCartComponent
  ],
  imports: [
    CommonModule,
  FormsModule,
  DropdownModule,
    CartRoutingModule,
    BreadcrumbModule,
    ToastModule,
    DialogModule,
    ReactiveFormsModule,
    PaginatorModule,
    TranslateModule.forChild({ extend: true }),
  ]
})
export class CartModule { }
