import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';
import { AllProductComponent } from './products/all-product/all-product.component';
import { TrackOrderComponent } from './track-order/track-order/track-order.component';
import { ProfileResponsiveComponent } from './profile/dash-user/profile-responsive/profile-responsive.component';
import { ProfileResponsiveNoUserComponent } from './profile/dash-user/profile-responsive-no-user/profile-responsive-no-user.component';
import { ProfileComponent } from './profile/dash-user/profile/profile.component';
import { OrderComponent } from './profile/dash-user/order/order.component';
import { OrderDetailsComponent } from './profile/dash-user/order/order-details/order-details.component';
import { AllCategoryResponsiveComponent } from './all-category-responsive/all-category-responsive.component';
import { PageComponent } from './shared/components/page/page.component';


const routes: Routes = [{
  path: '',
  loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
},
{
  path: 'home',
  loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
},
{ path: 'pages/:slug', component: PageComponent },

{
  path: 'favorites',
  loadChildren: () =>
    import('./favorities/favorities.module').then(
      (m) => m.FavoritiesModule
    ),

},
{path: 'trackOrder', component: TrackOrderComponent},
 {path: 'trackOrder', loadChildren: () =>import('./track-order/track-order.module')
        .then((m) => m.TrackOrderModule),},
        {
    path: 'profile',
    loadChildren: () =>
      import('./profile/profile.module').then((m) => m.ProfileModule),
    canActivate: [AuthGuard]


  },
  {
    path: 'profileRes',component:ProfileResponsiveComponent,
    canActivate: [AuthGuard],
  },
    { path:'User', component: ProfileComponent },
  // { path: 'Inbox', component: InboxnNewComponent },
  // { path: 'Inbox/:id', component: InboxnNewComponent },
  {path: 'Order', component: OrderComponent},
   
  {
    path: 'profileResNoUser',component:ProfileResponsiveNoUserComponent,
    
  },
// {
//     path: 'favorites',
//     loadChildren: () =>
//       import('./favorities/favorities.module').then(
//         (m) => m.FavoritiesModule
//       ),
//     canActivate: [AuthGuard],
//   },
// {
//   path: 'auth',
//   loadChildren: () =>
//     import('./auth/auth.module').then((m) => m.AuthModule),
// },
{
  path: 'cart',
  loadChildren: () =>
    import('./cart/cart.module').then((m) => m.CartModule),

},
{path: 'Order/orderDetails/:order_id',component: OrderDetailsComponent,},

{
  path: 'ProductDetails',
  loadChildren: () =>
    import('./products/products.module').then((m) => m.ProductsModule),
},
{ path: 'AllProduct/:id/:name', component: AllProductComponent, pathMatch: 'full' },
 { path: 'allCategoryResponsive', component:AllCategoryResponsiveComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
