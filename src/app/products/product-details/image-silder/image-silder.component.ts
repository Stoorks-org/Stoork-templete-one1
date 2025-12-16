import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';


import {  SwiperModule } from 'swiper/angular';
import SwiperCore, { Navigation, Pagination, SwiperOptions,Scrollbar, A11y } from 'swiper';
import { CommonModule } from '@angular/common';

import { ProductDetailsService } from '../../product-details.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { FavoriteService } from '../../../favorities/favorite.service';
//import { register } from 'swiper/element/bundle';
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

@Component({
  selector: 'app-image-silder',
  standalone: true,
  imports: [SwiperModule, CommonModule],
  templateUrl: './image-silder.component.html',
  styleUrl: './image-silder.component.scss'
})
export class ImageSilderComponent {
  screenWidth!: number;
  slidesPerView: number=1;
 

  len:any;
  navigation: boolean = false;
  config: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 5,
    speed: 500,
    navigation: true,
    scrollbar: { draggable: false },
    };
  @Input() ProductId:any;
  @Input() SliderImge: any = [];
  @Input() product: any ;
  private swiperInstance: any;
  // res: any;
  // proData: any;
  // images: any;
  // @Input() SliderLoading:boolean=true;
  ngOnInit() {
 //alert(this.product.id)
 console.log(this.product,'this.product this.product this.product');
  }
  constructor(
    public _auth: AuthService,
    public fav: FavoriteService,private productDetailsservice: ProductDetailsService,
    private activatedRoute: ActivatedRoute,){}
  //   ngOnChanges(changes: SimpleChanges): void {
  // if (changes['product'] && changes['product'].currentValue) {
  //   alert('en')
  //   // المنتج اتغير، رجّعي السلايدر لأول صورة
  //   setTimeout(() => {
  //     this.swiperRef?.swiper?.slideTo(0, 0); // index 0 بدون transition
  //   }, 100);
  // }
  //   }

     onSwiper(swiper: any) {
     
    this.swiperInstance = swiper;
  }

  ngOnChanges(changes: SimpleChanges): void {
    // When SliderImge changes, go to first slide
    if (changes['SliderImge'] && !changes['SliderImge'].firstChange) {
    
      this.goToFirstSlide();
    }
  }

  private goToFirstSlide(): void {
    if (this.swiperInstance) {
      // Use setTimeout to ensure Swiper has updated with new slides
      setTimeout(() => {
      
        this.swiperInstance.slideTo(0, 0); // Go to first slide instantly
      });
    }
  }
 
}

