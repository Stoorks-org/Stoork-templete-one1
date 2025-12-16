import { Component } from '@angular/core';
import { CartService } from '../../cart.service';
import { AuthService } from '../../../shared/services/auth.service';
import { AccountService } from '../../../account/account.service';
import { ResponsiveService } from '../../../shared/services/responsive.service';
import { SettingsService } from '../../../shared/services/settings.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-finish-ceckouy-without-register',
  templateUrl: './finish-ceckouy-without-register.component.html',
  styleUrl: './finish-ceckouy-without-register.component.scss'
})
export class FinishCeckouyWithoutRegisterComponent {
  order_id = this.activatedRoute.snapshot.paramMap.get('order_id');
orderDetails: any;
  Shipping: any;
  storeId: any;
  currency:any;
  //track_code:any;
  // order_id!: string;
  constructor(
    public cartSer: CartService,
    public _aut: AuthService,
    public accountService:AccountService,
    private _ResponsiveService:ResponsiveService,
    private _setting:SettingsService,
    private activatedRoute: ActivatedRoute,
  ) {}
  ngOnInit(): void {
     this._setting.loadSettings().subscribe(data => {

      this.storeId = data.storeId;
      this.currency=data.currency_symbol_native;
       this.getOrder(this.storeId);
    });
   
    this._ResponsiveService.CartStatus(true);
  }
  getOrder(storeId:any) {
    let url: string = `v4/api/stores/${storeId}/orders/${this.order_id}`;
    this._aut.get(url).subscribe({
      next: (res) => {
        this.orderDetails = res?.data;
        
        console.log(res, 'this.orderDetails');
        // this._aut
        //   .get('api/v1/shipping/cost/' + this.orderDetails.order.total)
        //   .subscribe({
        //     next: (response) => {
        //       this.Shipping = response.data;
               
        //     },
        //     error: (error) => console.log(error),
        //   });
        console.log(this.orderDetails, 'this.orderDetails');
      },
      error: (err) => {
        console.log(err);
      },
    });
     //this.orderDetails=this.cartSer.getOrderWithOutRegister();
    // console.log(this.orderDetails,'this.orderDetails this.orderDetails from finish');
    
  }
  signIn(){
    this.accountService.loginStatus(true);
  }
  signUp(){
    this.accountService.SingUpStatus(true);
  }
  // getAddress(data: string): string {
  //   console.log(JSON.parse(data));
  //   return JSON.parse(data).region;
  // }
}
