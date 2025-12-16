import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { DashUserComponent } from './dash-user/dash-user.component';
import { ToastModule } from 'primeng/toast';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileComponent } from './dash-user/profile/profile.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ProfileResponsiveComponent } from './dash-user/profile-responsive/profile-responsive.component';
import { ProfileResponsiveNoUserComponent } from './dash-user/profile-responsive-no-user/profile-responsive-no-user.component';
import { OrderComponent } from './dash-user/order/order.component';
import { PaginatorModule } from 'primeng/paginator';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonsDirective } from '../shared/direactive/buttons.directive';
import { FavoritiesModule } from '../favorities/favorities.module';
import { OrderDetailsComponent } from './dash-user/order/order-details/order-details.component';


@NgModule({
  declarations: [
    DashUserComponent,
    ProfileComponent,
    ProfileResponsiveComponent,
    ProfileResponsiveNoUserComponent,
    OrderComponent,
    OrderDetailsComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    ToastModule,
    ReactiveFormsModule,
    PaginatorModule,
    BreadcrumbModule,
    DialogModule,
   FavoritiesModule,

    TranslateModule.forChild({ extend: true }),
  ]
})
export class ProfileModule { }
