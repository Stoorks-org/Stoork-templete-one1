import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrackOrderRoutingModule } from './track-order-routing.module';
import { OrderDetailsOfflineComponent } from './order-details-offline/order-details-offline.component';
import { OrderOfflineComponent } from './order-offline/order-offline.component';
import { TrackOrderComponent } from './track-order/track-order.component';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    OrderDetailsOfflineComponent,
    OrderOfflineComponent,
    TrackOrderComponent
  ],
  imports: [
    CommonModule,
    TrackOrderRoutingModule,
    ReactiveFormsModule,
    TranslateModule.forChild({ extend: true }),
  ]
})
export class TrackOrderModule { }
