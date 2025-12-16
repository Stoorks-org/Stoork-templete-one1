import { Component, Input } from '@angular/core';
//import { FavoriteService } from 'src/app/favoritenew/favorite.service';
//import { AuthService } from 'src/app/shared/services/auth.service';

import {  SwiperModule } from 'swiper/angular';
import SwiperCore, { Navigation, Pagination, SwiperOptions,Scrollbar, A11y } from 'swiper';
import { CommonModule } from '@angular/common';
import { ProductDetailsService } from '../../product-details.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { FavoriteService } from '../../../favorities/favorite.service';
//import { FavoriteService } from 'src/app/favoritenew/favorite.service';

//import { register } from 'swiper/element/bundle';
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);


@Component({
  selector: 'app-swipper-for-product',
  standalone: true,
  imports: [SwiperModule, CommonModule],
  templateUrl: './swipper-for-product.component.html',
  styleUrl: './swipper-for-product.component.scss'
})
export class SwipperForProductComponent {
screenWidth!: number;
slidesPerView: number=6;
len:any;
res:any;
navigation: boolean = false;
config: SwiperOptions = {
spaceBetween: 5,speed: 500,navigation: true,
scrollbar: { draggable: false },
};
@Input() ProductId:any;
SliderImge: any = [];
// @Input() SliderImge: any = [];
ngOnInit() {
 // this.getProductDetails();
  console.log(this.SliderImge,'SliderImge SliderImge SliderImge');
}
// getProductDetails() {
//   const id = this.activatedRoute.snapshot.paramMap.get('id');

//   if (id) {
//     this.productDetailsservice.GetProductDetailsByVarationID(id).subscribe({
//       next: (response) => {
//         this.res=response;
//         this.SliderImge=this.res.data.current_variant.images;
//       },
//       error: (error) => console.log(error),
//     });
    
//   }
// }
constructor(public _auth: AuthService,public fav: FavoriteService,private productDetailsservice: ProductDetailsService,
  private activatedRoute: ActivatedRoute,
){}
}
