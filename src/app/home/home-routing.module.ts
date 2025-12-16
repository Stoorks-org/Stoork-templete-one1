import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { ProductsComponent } from './products/products.component';
import { CheckoutComponent } from '../cart/checkout/checkout.component';
import { CheckoutWithoutRegisterComponent } from '../cart/checkout-without-register/checkout-without-register.component';
//import { LoginComponent } from '../account/login/login.component';
//import { RegisterComponent } from '../account/register/register.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent, pathMatch: 'full' },
  { path: 'home', component: LandingPageComponent, pathMatch: 'full' },
  {path: 'checkout',component: CheckoutComponent,
    },
    {path: 'checkoutWithoutRegister',component:CheckoutWithoutRegisterComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
