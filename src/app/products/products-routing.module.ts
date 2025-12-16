import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { AllProductComponent } from './all-product/all-product.component';


const routes: Routes = [
  { path: '', component: ProductDetailsComponent, pathMatch: 'full' },
  { path: ':id', component: ProductDetailsComponent, pathMatch: 'full' },
   { path: 'AllProduct', component: AllProductComponent, pathMatch: 'full' },
   
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsRoutingModule {}
