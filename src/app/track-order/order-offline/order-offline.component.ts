import { Component } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../cart/cart.service';
import { SettingsService } from '../../shared/services/settings.service';

@Component({
  selector: 'app-order-offline',
  templateUrl: './order-offline.component.html',
  styleUrl: './order-offline.component.scss'
})
export class OrderOfflineComponent {
 order:any;
  noSize=false;
  storeId:any;
  currency:any;
  orderNumber = this.activatedRoute.snapshot.paramMap.get('orderNum');
  constructor(public _auth: AuthService,
    private translate:TranslateService,
    private activatedRoute: ActivatedRoute,
    private _setting:SettingsService,
    public cartSer: CartService){}
    ngOnInit(): void {
      this._setting.loadSettings().subscribe(data => {
      this.currency=data.currency_symbol_native;
      this.storeId = data.storeId;
      this.searchOrderByCode(this.storeId); 
    });
     
    }
  searchOrderByCode(storeId:any){ 
    
      this._auth.get(`v4/api/stores/${storeId}/orders/${this.orderNumber}`).subscribe({
        next: (res) => {
         this.order=res.data;
         console.log(this.order,'this.order');
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
}
