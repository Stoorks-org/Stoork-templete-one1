import { Component, Inject, Input, PLATFORM_ID } from '@angular/core';
import { utils } from '../../shared/utils/utils';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { FavoriteService } from '../../favorities/favorite.service';
import { AuthService } from '../../shared/services/auth.service';
import { ProductService } from '../../shared/services/product.service';
import { SettingsService } from '../../shared/services/settings.service';

@Component({
  selector: 'app-product-responsive',
  templateUrl: './product-responsive.component.html',
  styleUrl: './product-responsive.component.scss',
  standalone:false
})
export class ProductResponsiveComponent {
 baseLinkUrl: string = utils.baseLinkUrl;
  cats: any;
  res: any;
  productItems1: any;
  productItems: any = [];
  searchKey: string = '';
  currency:any;
  @Input() showHead: any = true;
  @Input() PopularProducts: any = [];
  @Input() isPopularProductsLoading:boolean=true;
  private initialScrollPosition = 0;
  private previousStep = -1;
  constructor(
    @Inject(DOCUMENT) private dom: Document,
   
    public fav: FavoriteService,
    
    public _auth: AuthService,
    public _productSer:ProductService,
    private _setting:SettingsService,
    @Inject(PLATFORM_ID) private platformId: any,
    
  ) {}
  ngOnInit(): void {
     this._setting.loadSettings().subscribe(data => {
    this.currency=data.currency_symbol_native;});
   // if (isPlatformBrowser(this.platformId)) {
 //this.getPopularProduct(1);}
  }
 
  productImage(images: any): string {
    if (!images?.length) {
     return '';
   }

   const main: any | undefined = images.find(
     (image: any) => {
       return image?.is_main === true;
     }
   );

   if (!main) {
     return images[0]?.image_path;
   }
   return main.image_path;
 }
  getPrice(num: number | string): number {
    let price: number = 0;
    if (typeof num == 'string') {
      price = Math.ceil(parseInt(num));
      return price;
    }

    return Math.ceil(num);
  }
  // getPopularProduct(pagenum:number=1){
    
  //   this.isPopularProductsLoading=true;
  //   this._auth.get(`api/v1/products-popular?per_page=${12}&page=${pagenum}`).subscribe({
  //     next: (response) => {
  //       this.PopularProducts=response.data.results;
  //       this.isPopularProductsLoading=false;
  //      },
  //     error: (error) => console.log(error),
  //   });
  //   this._auth.getfaviorites();
  // }
}

