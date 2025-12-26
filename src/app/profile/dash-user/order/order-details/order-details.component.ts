import { Component } from '@angular/core';
import { AuthService } from '../../../../shared/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { ResponsiveService } from '../../../../shared/services/responsive.service';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { SettingsService } from '../../../../shared/services/settings.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss',
  standalone:false
})
export class OrderDetailsComponent {
orderDetails: any;
  order_id = this.activatedRoute.snapshot.paramMap.get('order_id');
  userData = JSON.parse(this.localStorageService.get('userInfo') || '');
  Shipping: any;
  storeId:any;
  currency:any;
  constructor(
    public _aut: AuthService,
    private activatedRoute: ActivatedRoute,
    private _toast: MessageService,
    private translate: TranslateService,
    private _ResponsiveService:ResponsiveService,
    private localStorageService:LocalStorageService,private _setting:SettingsService,
  ) {}
  ngOnInit(): void {
    this._ResponsiveService.FavoriteStatus(true);
   // console.log(this.order_id);
   this._setting.loadSettings().subscribe(data => {
     this.currency=data.currency_symbol_native;
      this.storeId = data.storeId;
    this.getAllOrder();
    });
   
  }
  ngOnDestroy() {
    this._ResponsiveService.FavoriteStatus(false);
  }
  // cancelOrder() {
  //   this._aut
  //     .put('api/v1/orders/' + this.order_id, { status: 'Canceled' })
  //     .subscribe({
  //       next: (res) => {
  //         this.getAllOrder();
  //         this._toast.add({
  //           severity: 'success',
  //           summary: this.translate.instant('success'),
  //           detail: this.translate.instant('ordercancelSuccessfuly'),
  //         });
  //       },
  //       error: (err) => {
  //         console.log(err);
  //         this._toast.add({
  //           severity: 'error',
  //           summary: this.translate.instant('error'),
  //           detail: this.translate.instant('errorTryAgain'),
  //         });
  //       },
  //     });
  // }
  getAllOrder() {
    let url: string = `v4/api/stores/${this.storeId}/orders/${this.order_id}`;
    this._aut.get(url).subscribe({
      next: (res) => {
        this.orderDetails = res.data;
       // console.log(this.orderDetails, 'this.resShipping');.order
      
        console.log(this.orderDetails, 'this.orderDetails');
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  getData(data: string): string {
    // return JSON.parse(data)?.images[0].thumbnail_path;
   const images=JSON.parse(data)?.images;
   //console.log(images,'images images images');
     if (!images?.length) {
       return '';
     }
 
    const main: any | undefined = images.find(
      (image: any) => {
        return image?.is_main ==1;
      }
    );
   //  thumbnail_path
    if (!main) {
      return images[0]?.thumbnail_path;
    }
    return main.thumbnail_path;
     //this._auth.productImage(JSON.parse(data)?.images);
   }
   getDataname(data: string): string {
  
    const address=JSON.parse(data);
     console.log(JSON.parse(data),'address address address');
     return address?.name;
     
    }
    getDatacolor(data: string): string {
  
      const address=JSON.parse(data);
       console.log(JSON.parse(data),'color color');
       return address?.color.name;
       
      }
      getDataprice(data: string): string {
  
        const address=JSON.parse(data);
         console.log(JSON.parse(data),'price r');
         return address?.price[0].discount_price;
         
        }
        getAddress(add:any): string {
             let address=' ';
             console.log(add,'datadatadata');
          // const add=JSON.parse(data);
          //  console.log(JSON.parse(data),'address address address');
           add.forEach((add:any) => {
             if(add?.is_default
             ){
              add.region!=null?address +=add.region+' ':'';
              add.state!=null?address +=add.state+' ':'';
              add.main_adress!=null?address +=add.main_adress+' ':'';
             }
           else address+=''
           });
           return address;
           
           
          }
}
