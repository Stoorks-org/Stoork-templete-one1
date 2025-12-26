import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { SwiperOptions } from 'swiper';
//import { AuthService } from 'src/app/shared/services/auth.service';
import SwiperCore, { Autoplay, Pagination, Scrollbar } from 'swiper';
SwiperCore.use([Autoplay, Pagination, Scrollbar]);

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  standalone:false
})
export class SliderComponent {
  responsiveOptions;
  storeId:any=1;
  //define validable to store dynamic products data
  products: any[] = [
    {
      id: 1,
      name: 'applelenovole novolen ovolenov  olenovolenovo',
      product_image: 'assets/images/brands/apple.png',
    },
    {
      id: 2,
      name: 'samsung lenovol enovolen  ovolenovo lenovo',
      product_image: '/assets/images/brands/snmsung.png',
    },
    {
      id: 3,
      name: 'lenovol enovole novole novolenov olenovo lenovo',
      product_image: '/assets/images/brands/lenovo.png',
    },
    {
      id: 4,
      name: 'lenovol enovol enovolen ovolenov olenovo lenovo',
      product_image: '/assets/images/brands/lenovo.png',
    },
  ];

  res: any;
  @Input() SliderImge: any = [];
  @Input() ImageUrl: any = [];
  @Input() slider:string="home";
  config: SwiperOptions = {
  slidesPerView: 1, // أو العدد اللي يناسبك
  spaceBetween: 0,
  speed: 500,
  navigation: false,
  autoplay: {
    delay: 4500,
    disableOnInteraction: false, // يفضل يفضل شغال حتى بعد التفاعل
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  loop: true, // علشان يلف بشكل دائري
};
  // configCats: SwiperOptions = {
  //   // slidesPerView: 6,
  //   spaceBetween: 0,
  //   speed: 500,
  //    navigation: false,
  //   autoplay: {
  //     delay: 4500,
  //   },
  //   // pagination: { clickable: true },
  //   scrollbar: { draggable: true },
  // };
  ngOnInit() {
    
    //console.log(this.SliderImge,'SliderImgeSliderImge');
    // this.GetSliderAdv();
  }
  constructor(public _aut: AuthService) {
    //slider responsive settings
    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 1,
        numScroll: 1,
      },
      {
        breakpoint: '768px',
        numVisible: 1,
        numScroll: 1,
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1,
      },
    ];
  }
  
  
}
