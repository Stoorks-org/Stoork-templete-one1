import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashUserComponent } from './dash-user/dash-user.component';
import { ProfileComponent } from './dash-user/profile/profile.component';
import { OrderComponent } from './dash-user/order/order.component';
import { OrderDetailsComponent } from './dash-user/order/order-details/order-details.component';

const routes: Routes = [
   {
    path: '',
    component: DashUserComponent,
    children: [
      { path: '', redirectTo: 'User', pathMatch: 'full' },
      { path: 'User', component: ProfileComponent },
      {path: 'Order',component: OrderComponent},
      {path: 'Order/orderDetails/:order_id',component: OrderDetailsComponent}
      ]
      }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
