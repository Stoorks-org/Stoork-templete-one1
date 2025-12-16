import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrackOrderComponent } from './track-order/track-order.component';
import { OrderOfflineComponent } from './order-offline/order-offline.component';
import { OrderDetailsOfflineComponent } from './order-details-offline/order-details-offline.component';

const routes: Routes = [
  {path: '',component:TrackOrderComponent},
  { path: 'order/:orderNum',component:OrderOfflineComponent },

  { path: 'order/:orderNum/orderDetails', component:OrderDetailsOfflineComponent},
  // {
  //   path: 'order/:orderNum/orderDetails/:pro_id',
  //   component: ProductReviewComponent,
  // },
  // {
  //   path: 'order/:orderNum/orderDetails/feedBack/:order_id',
  //   component: ProductReviewComponent,
  // },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrackOrderRoutingModule { }
