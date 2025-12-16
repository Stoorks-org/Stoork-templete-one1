import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { ProductsComponent } from './products/products.component';
import { PasswordModule } from 'primeng/password';

import { HttpClientModule } from '@angular/common/http';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { SliderComponent } from './slider/slider.component';
import { PaginatorModule } from 'primeng/paginator';
// import { CatogriespaginatorComponent } from './catogriespaginator/catogriespaginator.component';
// import { ShopOtherCategoriesComponent } from './shop-other-categories/shop-other-categories.component';
// import { DailyBestSellsComponent } from './daily-best-sells/daily-best-sells.component';
// import { LoginComponent } from '../account/login/login.component';
import { DialogModule } from 'primeng/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { TranslateModule } from '@ngx-translate/core';
// import { BrandsComponent } from './brands/brands.component';
import { FilterPipe } from './filter.pipe';
import { SwiperModule } from 'swiper/angular';
import { DailyBestSellsComponent } from './daily-best-sells/daily-best-sells.component';
import { CatogriespaginatorComponent } from './catogriespaginator/catogriespaginator.component';
//import { SwipperForCategoryComponent } from './swipper-for-category/swipper-for-category.component';
import { ProductResponsiveComponent } from './product-responsive/product-responsive.component';
import { AllCategoryResponsiveComponent } from '../all-category-responsive/all-category-responsive.component';
import { ProductsModule } from '../products/products.module';
import { ActiveSizeDirective } from './products/active-size.directive';



// shared modules
//import { SharedCompModule } from '../shared/components/shared-comp/shared-comp.module';
@NgModule({
  declarations: [
    LandingPageComponent,
    ProductsComponent,
    SliderComponent,
    DailyBestSellsComponent,
     CatogriespaginatorComponent,
     ActiveSizeDirective,
   
    // DailyBestSellsComponent,
    // BrandsComponent,
    FilterPipe,
         ProductResponsiveComponent,
         //SwipperForCategoryComponent,
         AllCategoryResponsiveComponent,
   
    // SearchPipe,
    // LoginComponent,
    //RegisterComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    HttpClientModule,
    CarouselModule,
    PaginatorModule,
    ButtonModule,
    DialogModule,
    PasswordModule,
    ReactiveFormsModule,
    ToastModule,
    TranslateModule.forChild({ extend: true }),
    SwiperModule,
    
   // SharedCompModule,
  ],
  // providers: [MessageService],
  exports: [SliderComponent,ProductsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeModule {}
