import { Component } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { SettingsService } from '../../../shared/services/settings.service';
import { TranslateService } from '@ngx-translate/core';
import { CartService } from '../../cart.service';

@Component({
  selector: 'app-finish-checkout',
  templateUrl: './finish-checkout.component.html',
  styleUrl: './finish-checkout.component.scss'
})
export class FinishCheckoutComponent {
  order_id = this.activatedRoute.snapshot.paramMap.get('order_id');
  orderDetails: any;
  Shipping: any;
  storeId:any;
  currency:any;
  // order_id!: string;
  constructor(
    public _aut: AuthService,
    private activatedRoute: ActivatedRoute,
    private _setting:SettingsService,
    private translate: TranslateService,
    private cartSer: CartService
  ) {}
  ngOnInit(): void {
    this._setting.loadSettings().subscribe(data => {

      this.storeId = data.storeId;
      this.currency=data.currency_symbol_native;
      this.getAllOrder();
      
    });
    
  }
  getAllOrder() {
    let url: string = `v3/api/${this.storeId}/orders/${this.order_id}`;
    this._aut.get(url).subscribe({
      next: (res) => {
        this.orderDetails = res?.data;
        this.cartSer.getCart(this.storeId);
        },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
