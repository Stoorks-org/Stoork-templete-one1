import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { FinishCheckoutComponent } from './checkout/finish-checkout/finish-checkout.component';
import { CheckoutWithoutRegisterComponent } from './checkout-without-register/checkout-without-register.component';
import { FinishCeckouyWithoutRegisterComponent } from './checkout-without-register/finish-ceckouy-without-register/finish-ceckouy-without-register.component';
//import { CheckoutWithoutRegisterComponent } from './checkout-without-register/checkout-without-register.component';
//import { FinishCheckoutComponent } from './checkout/finish-checkout/finish-checkout.component';

const routes: Routes = [
  {
    path: '',
    component: CartComponent,
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
  },
  {path: 'checkoutWithoutRegister',component:CheckoutWithoutRegisterComponent},
  {path: 'checkout/finishcheckout/:order_id',component: FinishCheckoutComponent,},
 {path:'checkoutWithoutRegister/finishcheckout/:order_id',component:FinishCeckouyWithoutRegisterComponent}
  // {
  //   path: 'profile/order',
  //   component: OrderComponent,
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CartRoutingModule { }
