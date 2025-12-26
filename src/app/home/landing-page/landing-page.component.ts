import {
  AfterViewInit,
  Component,
  ViewEncapsulation,
  OnInit,
  HostListener,
  Input,
} from '@angular/core';
import { HomeserviceService } from '../homeservice.service';
//import { AuthService } from 'src/app/shared/services/auth.service';
import { TranslateService } from '@ngx-translate/core';

import SwiperCore, { Navigation, Pagination, SwiperOptions } from 'swiper';
import { AuthService } from '../../shared/services/auth.service';
import { SettingsService } from '../../shared/services/settings.service';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { Router } from '@angular/router';

SwiperCore.use([Navigation, Pagination]);

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone:false
})
export class LandingPageComponent implements OnInit, AfterViewInit {
  res: any;
  categories: any;
  brands: any;
  products: any;
  random_Category: any;
  MostSold: any;
  SliderImge: any;
  bottomSliderImge: any;
  screenWidth!: number;
  slidePerViewCats: number = 6;
  navigationCats: boolean = false;
  showHead: boolean = true;
  secProducts: any;
  heroImages:any;
  mustSoldProduct:any=[];
  isLoadingHeroImages=true;
  isLoadingcategories=true;
  storeId:any;
  currency:any;
  PopularProducts:any=[];
   isPopularProductsLoading:boolean=true;
   isMustSoldProductsLoading:boolean=true
   sliderColor = '#f0f0f2';
  // ________________________________________________________
  // ________________________________________________________

  constructor(
    private homeService: HomeserviceService,
    private _aut: AuthService,
    private _setting:SettingsService,
    private router: Router
  ) {}

  configCats: SwiperOptions = {
    // slidesPerView: 6,
    spaceBetween: 0,
    speed: 500,
    // navigation: false,
    autoplay: {
      
      // delay: 4500,
    },
    // pagination: { clickable: true },
    scrollbar: { draggable: true },
    loop:false
  };


  ngOnInit(): void {
   
    this._setting.loadSettings().subscribe(data => {

    this.storeId = data.storeId; 
    this.currency=data.currency_symbol_native;
    this.getPopularProduct();
    this.GetSliderAdv();
    this.getScreenWindow();
    this.getAllCats();
    this.getAllHeroImages();
    this.getMustSoldProduct();
    
    });
  }
  //   get isInFooter(): boolean {
  //   return !this.router.url.includes('footer');
  // }

  ngAfterViewInit(): void {}

  // *_______________________________________________________________
  // ?__________________________Methods______________________________
  getAllCats() {
    let url: string = `v3/api/${this.storeId}/categories`;
    this._aut.get(url).subscribe({
      next: (res) => {
        this.isLoadingcategories=false;
        //this.isLoadingcategories=false;
        this.categories = res.data;
        console.log(this.categories,'categories'
        
        );
      
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  getAllHeroImages(){
    let url: string = `v2/settings/store/hero-images/store/${this.storeId}`;
    this._aut.get(url).subscribe({
      next: (res) => {
        this.isLoadingHeroImages=false;
        this.heroImages = res.data;
        console.log(this.heroImages,'this.heroImages');
      
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  // getlandingData() {
  //   this.homeService.getall().subscribe({
  //     next: (response) => {
  //       this.res = response;
  //       this.categories = this.res.data.categories;
  //       this.brands = this.res.data.brands.slice(0, 15);
  //       console.log(this.res.data);

  //       this.products = this.res.data.popluar_products.slice(0, 9);
  //       this.secProducts = this.res.data.popluar_products.slice(0, 9);
  //       this.random_Category = this.res.data.random_category.slice(0, 12);
  //       this.MostSold = this.res.data.most_sold.slice(0, 4);
  //       //console.log(this.random_Category, 'this.brands');
  //     },
  //     error: (error) => console.log(error),
  //   });
  // }

  GetSliderAdv() {
    this._aut.get(`v3/api/${this.storeId}/offers`).subscribe({
      next: (response) => {
        
        this.SliderImge =  response.data.items;
        // this.res.data.items.filter((slid: any) => {
        //   return slid.layout == 'both'||slid.layout == 'website';
        // });
        console.log(this.SliderImge, 'this.SliderImge');
      },
      error: (error) => console.log(error),
    });
  }

  @HostListener('window:resize')
  getScreenWindow() {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 480) {
      this.slidePerViewCats = 4;
      this.navigationCats = true;
    } else if (this.screenWidth >= 481 && this.screenWidth <= 550) {
      this.slidePerViewCats = 4;
      this.navigationCats = true;
    } else if (this.screenWidth >= 551 && this.screenWidth <= 750) {
      this.slidePerViewCats = 4;
      this.navigationCats = true;
    } else if (this.screenWidth >= 751 && this.screenWidth <= 991) {
      this.slidePerViewCats = 5;
      this.navigationCats = true;
    } else {
      this.navigationCats = false;
      this.slidePerViewCats = 6;
    }
  }
  // getPopularProduct(pagenum:number=1){
    
  //   this.isPopularProductsLoading=true;
  //   this._aut.get(`v3/api/${this.storeId}/products?page=${pagenum}&perPage=30`).subscribe({
  //     next: (response) => {
  //     console.log(response,'response getPopularProduct');
  //      pagenum +=1;
  //      response.data.items.forEach( (element: any)=> {
  //       this.PopularProducts.push(element);
  //       this.isPopularProductsLoading=false;
  //      });
  //      console.log( (response.data.meta.total/response.data.meta.per_page),'(response.data.meta.total/response.data.meta.per_page)');
  //      if(pagenum<=(response.data.meta.total/response.data.meta.per_page)){
        
  //      this.getPopularProduct(pagenum);
      
  //      }
      
  //     },
  //     error: (error) => console.log(error),
  //   });
  //   this._aut.getfaviorites(this.storeId);
  // }
  getPopularProduct(pagenum:number=1){
    
    this.isPopularProductsLoading=true;
    this._aut.get(`v3/api/${this.storeId}/products?page=1&perPage=30`).subscribe({
      next: (response) => {
        this.PopularProducts=response.data.items;
      // console.log(response,'response getPopularProduct');
      //  pagenum +=1;
      //  response.data.items.forEach( (element: any)=> {
      //   this.PopularProducts.push(element);
        this.isPopularProductsLoading=false;
      //  });
      //  console.log( (response.data.meta.total/response.data.meta.per_page),'(response.data.meta.total/response.data.meta.per_page)');
      //  if(pagenum<=(response.data.meta.total/response.data.meta.per_page)){
        
      //  this.getPopularProduct(pagenum);
      
      //  }
      
      },
      error: (error) => console.log(error),
    });
    this._aut.getfaviorites(this.storeId);
  }
  getMustSoldProduct(pagenum:number=1){
    
    this.isMustSoldProductsLoading=true;
    this._aut.get(`v4/api/stores/${this.storeId}/products/most-sold?page=${pagenum}&per_page=30`).subscribe({
      next: (response) => {
        this.mustSoldProduct=response.data.products;
      //     pagenum +=1;
      //  response.data.products.forEach( (element: any)=> {
      //   this.mustSoldProduct.push(element);
         this.isMustSoldProductsLoading=false;
      //  });
      //  console.log( (response.data.meta.total/response.data.meta.per_page),'(response.data.meta.total/response.data.meta.per_page)');
      //  if(pagenum<=(response.data.meta.total/response.data.meta.per_page)){
        
      //  this.getMustSoldProduct(pagenum);
      
      //  }
      },
      error: (error) => console.log(error),
    });
    this._aut.getfaviorites(this.storeId);
  }
  // GetSliderAdv() {
  //   this._aut.get(`v3/api/${this.storeId}/offers`).subscribe({
  //     next: (response) => {
  //       this.res = response;
  //       this.SliderImge = this.res.data.items;
  //       console.log(this.res, 'this.SliderImge');
  //     },
  //     error: (error) => console.log(error),
  //   });
  // }
}
