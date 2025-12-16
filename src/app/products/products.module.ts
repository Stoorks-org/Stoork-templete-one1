import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { ProductDetailsComponent } from './product-details/product-details.component';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ProductsRoutingModule } from './products-routing.module';
import { TabViewComponent } from './tab-view/tab-view.component';
import { TabViewModule } from 'primeng/tabview';
import { ImageGallaryDirective } from './product-details/image-gallary.directive';
import { RatingModule } from 'primeng/rating';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProgressBarModule } from 'primeng/progressbar';

import { ToastModule } from 'primeng/toast';
import { AllProductComponent } from './all-product/all-product.component';
import { AccordionModule } from 'primeng/accordion';
import { SliderModule } from 'primeng/slider';
//import { CategoryModule } from '../category/category.module';
import { PaginatorModule } from 'primeng/paginator';
import { ActiveSizeDirective } from './product-details/active-size.directive';
import { MuliSelectSizeDirective } from './all-product/muli-select-size.directive';
import { ActiveCategryDirective } from './all-product/active-categry.directive';
import { DialogModule } from 'primeng/dialog';
import { CarouselModule } from 'primeng/carousel';
import { TranslateModule } from '@ngx-translate/core';
import { GalleriaModule } from 'primeng/galleria';
import { ProductDetailsComponent } from './product-details/product-details.component';

import { HomeModule } from '../home/home.module';
import { ImageSilderComponent } from './product-details/image-silder/image-silder.component';
//import {HomeModule, ProductsComponent } from '../home/products/products.component';
@NgModule({
    declarations: [
        ProductDetailsComponent,
        TabViewComponent,
        ImageGallaryDirective,
        AllProductComponent,
        ActiveSizeDirective,
        MuliSelectSizeDirective,
        ActiveCategryDirective,
        
       
        
    ],
    imports: [
    CommonModule,
    ProductsRoutingModule,
    BreadcrumbModule,
    // ProductsComponent,
    RatingModule,
    ReactiveFormsModule,
    FormsModule,
    ProgressBarModule,
    ToastModule,
    AccordionModule,
    SliderModule,
    //CategoryModule,
    PaginatorModule,
    DialogModule,
    CarouselModule,
    GalleriaModule,
    TabViewModule, HomeModule,
    TranslateModule.forChild({ extend: true }),
    ImageSilderComponent
],
exports: [ActiveSizeDirective]
})
export class ProductsModule {}
