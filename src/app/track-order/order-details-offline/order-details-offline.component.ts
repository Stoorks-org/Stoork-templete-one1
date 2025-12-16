import { Component } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../cart/cart.service';
import { MessageService } from 'primeng/api';
import { SettingsService } from '../../shared/services/settings.service';

@Component({
  selector: 'app-order-details-offline',
  templateUrl: './order-details-offline.component.html',
  styleUrl: './order-details-offline.component.scss'
})
export class OrderDetailsOfflineComponent {
  order:any;
  noSize=false;
  storeId:any;
  orderNumber = this.activatedRoute.snapshot.paramMap.get('orderNum');
  constructor(public _auth: AuthService,
    private translate:TranslateService,
    private activatedRoute: ActivatedRoute,
    public cartSer: CartService,
    private _toast: MessageService,
    private _setting:SettingsService,
    ){}
    ngOnInit(): void {
        this._setting.loadSettings().subscribe(data => {

      this.storeId = data.storeId;
       this.searchOrderByCode();  
      //  this.getOrder(this.storeId);
    });
   
    }
  searchOrderByCode(){ 
    
      this._auth.get(`v4/api/stores/${this.storeId}/orders/${this.orderNumber}`).subscribe({
        next: (res) => {
         this.order=res.data
         ;
         console.log(this.order,'this.order');
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
     cancelOrder() {
            this._auth
              .put('api/v1/orders/' + this.order?.id, { status: 'Canceled' })
              .subscribe({
                next: (res) => {
                
                  this._toast.add({
                    severity: 'success',
                    summary: this.translate.instant('success'),
                    detail: this.translate.instant('ordercancelSuccessfuly'),
                  });
                },
                error: (err) => {
                  console.log(err);
                  this._toast.add({
                    severity: 'error',
                    summary: this.translate.instant('error'),
                    detail: this.translate.instant('errorTryAgain'),
                  });
                },
              });
          }
}
