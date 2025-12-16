import { Component } from '@angular/core';
import { CartService } from '../cart.service';
import { AuthService } from '../../shared/services/auth.service';
import { SettingsService } from '../../shared/services/settings.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';

@Component({
  selector: 'app-header-cart',
  templateUrl: './header-cart.component.html',
  styleUrl: './header-cart.component.scss'
})
export class HeaderCartComponent {
  showMe: boolean = true;
  res: any;
  cart: any;
  totalCartPrice: number = 0;
  storeId:any;
  CartFromToken:any;
  currency:any;
  constructor(private cartSer: CartService, public auth: AuthService,private _setting:SettingsService,
    private localStorageService:LocalStorageService,
  ) {}
  ngOnInit() {
    this._setting.loadSettings().subscribe(data => {

      this.storeId = data.storeId;
      this.cart=data.currency_symbol_native;
      this.getUserCart();
    });
    
  }
  CloseCart() {
    this.showMe = false;
    this.cartSer.CartStatus(false);
    this.cartSer.checkCart$.subscribe();
  }
  getUserCart() {
   //const token = localStorage.getItem('token');
   const token = this.localStorageService.get('token');
    if (token) {
      this.auth.get( `v3/api/store/${this.storeId}/carts`).subscribe({
        next: (response) => {
          this.res = response;
          this.cart = this.res.data;
          console.log(this.res.data, 'this.res.data to mapped');
          this.cart = this.cart.map((item: any) => ({
            id: item.id,
            product_id: item.product.id,
            count: +item.count,
            imageUrl: this.auth.productImage(item.product.images),
            //price: item.product.discount_price!=null?item.product.discount_price:item.product.price,
            price:this.getProductPriceWithOption(item),
            proName: item.product.name,
            description: item.product.description,
            options:item.options
            
          }));
          this.totalCartPrice = 0;
          for (const item of this.cart) {
            this.totalCartPrice += (item.price*item.count);
        }},
        error: (error) => {
          console.log(error, 'errorerror cart')
        }

      });
    }
    else {

      this.CartFromToken = false;
      //const cartData =localStorage.getItem('cart');
      const Carts =this.localStorageService.get('cart');
      //const Carts = JSON.parse(JSON.stringify(cartData));
      if (Carts) {
        this.cart = JSON.parse(Carts);
        //this.cart =Carts;
        this.cart = this.cart.map((item: any) => ({
          id: 0,
           
             product_id: item.product_id,
            count: +item.count,
            imageUrl:item.imageUrl,
            price: item.price,
            proName: item.proName,
            description: item.description,
            stock:item.stock?item.stock:0,
            selected:true,
            options:item.options
        }));
      }
      this.totalCartPrice=0;
      for (const item of this.cart) {
            this.totalCartPrice += (item.price*item.count);
        }
    }
  }
  getProductPriceWithOption(product: any): number {
    let basePrice = product.product.discount_price != null 
        ? parseFloat(product.product.discount_price) 
        : parseFloat(product.product.price);

    let extraPrice = product.options?.length > 0 
        ? product.options?.reduce((total: number, option: any) => total + parseFloat(option.extra_price), 0) 
        : 0;

   
    let totalPrice = basePrice + extraPrice;

    // Only multiply by count if it's not null
    // if (product.count != null) {
    //     totalPrice *= product.count;
    // }

    return totalPrice;


}
}
