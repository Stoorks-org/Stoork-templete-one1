import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { AuthService } from '../../shared/services/auth.service';
import { CartService } from '../cart.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ResponsiveService } from '../../shared/services/responsive.service';
import { SettingsService } from '../../shared/services/settings.service';
import { AccountService } from '../../account/account.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { FavoriteService } from '../../favorities/favorite.service';
interface IitemsOrder {
  id: number;
  count: number;}
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
  standalone:false
})
export class CartComponent {
  itemsMenu: MenuItem[] | undefined;
  home: MenuItem | undefined;
  cart: any;
  res: any;
  stock_count!: number;
  totalCartPrice: number = 0;
  pro: any;
  selectedItems: any[] = [];
  items:any[] = [];
  signInFlag=false;
  itemorder!: any;
  Shipping: any;
  addAddress!: FormGroup;
  is_def: boolean = false;
  newAddress: boolean = false;
  asd: any;
  isResponsive:boolean=true;
  CheckoutResOrder: boolean = false;
  storeId:any;
  CartFromToken:any=true;
  idSelected: any=[];
  itemsForUpdatedSelected:any=[];
  idSelectedForDelete: any;
  totalCartPriceWithCheckAll: number=0;
  currency:any;
  ProductFavorites: any[] = [];

  constructor(
    @Inject(DOCUMENT) private dom: Document,
    public _auth: AuthService,
    public fav:FavoriteService,
    public cartSer: CartService,
    private toast: MessageService,
    private router: Router,
    private _fb: FormBuilder,
    private translate: TranslateService,
    private _ResponsiveService:ResponsiveService,
    private _setting:SettingsService,
    private AccountService:AccountService,
    private localStorageService:LocalStorageService,
    
  ) {
    this.addAddress = this._fb.group({
      is_default: [true, Validators.required],

      state: ['', Validators.required],
      city: ['', Validators.required],
      type: ['', Validators.required],
      main_adress: ['', Validators.required],

      phone: ['', Validators.required],
    });
  }
  get is_default() {
    return this.addAddress.get('is_default');
  }
  get Addressline1() {
    return this.addAddress.get('main_adress');
  }
  get type() {
    return this.addAddress.get('type');
  }
  get state() {
    return this.addAddress.get('state');
  }
  get city() {
    return this.addAddress.get('city');
  }
  // @HostListener('window:scroll', ['$event']) onscroll(e: Event | any) {
  //   let header = this.dom.querySelector('.ordersum');
  //   if (window.scrollY >= 300) {
  //     header?.classList.add('fixedordersum');
  //   } else {
  //     header?.classList.remove('fixedordersum');
  //   }
  // }
  ngOnInit() {
    this.fav?.ProductFavorites$?.subscribe(data => {
    this.ProductFavorites = data ?? [];
  });

   // console.log(this.items, 'this.items');
    this.itemsMenu = [
      { label:  this.translate.instant('home'), routerLink: '/' },
      { label:  this.translate.instant('cart'), routerLink: '/cart' },
    ];
    this._setting.loadSettings().subscribe(data => {

      this.storeId = data.storeId;
      this.currency=data.currency_symbol_native;
    this.getUserCart();
    });
   // this.getUserCart();
    this._ResponsiveService.CartStatus(true);
    this._ResponsiveService.isCart$.subscribe({
     next: (res) => {
       this.isResponsive = res;
     },
     error: (err) => {
       console.log(err);
     },} )
  }
  ngOnDestroy() {
    this._ResponsiveService.CartStatus(false);
  }
  DeleteAll() {
    const token = this.localStorageService.get('token');
   let objectDelete= { "cart_ids":this.idSelected}
     if (token) {
        this._auth.deleteBody(`v4/api/cart/bulk-delete`,objectDelete).subscribe({
      next: (response) => {
        if (response)
          this.toast.add({
            severity: 'success',
            summary: this.translate.instant('success'),
            detail: this.translate.instant('success'),
          });

        this.getUserCart();
        this.idSelected=[];
      },
      error: (error) => {
        console.log(error);
      },
    });

     }
     else{ 
        // فلترة العناصر اللي selected = false فقط
  this.cart = this.cart.filter((item: any) => item.selected !== true);

  // تحديث الـ localStorage
  this.localStorageService.remove('cart');
  this.localStorageService.set('cart', JSON.stringify(this.cart));
this.getUserCart();
  
     }
    
  }
  CreateOrder() {
    this._auth.post(`v3/api/store/${this.storeId}/orders/create`, { items: this.items }).subscribe({
      next: (response) => {
        this.router.navigateByUrl('/cart/checkout');
        //console.log(response);
      },
      error: (error) => {
        if (error.status == 404)
          this.toast.add({
            severity: 'error',
            summary: this.translate.instant('error'),
            detail: this.translate.instant('youdonothaveaddressPleaseAddAddress'),
          });
        this.newAddress = true;
      //  console.log(error);
      },
    });
  }
//   controlOnChange(e: Event | any, pro: any) {
//     if (e.target.checked) {
//       console.log(pro,'pro')
//       //  this.btnDeleteDisable = false;
//       let itmorder = {  product_id: pro.product_id, // Map the main product ID
//         option_id: pro.options.map((option: { id: any; }) => option.id), // Extract all option IDs
//         quantity: pro.count, };
//       this.items.push(itmorder);
//       this.totalCartPrice += pro.count * pro.price;
//     } else {
//       this.items = this.items.filter(
//         (IitemsOrder) => IitemsOrder.id !== pro.id
//       );
     
//       this.totalCartPrice -=(pro.count * pro.price);
      
//     }
//      const token = this.localStorageService.get('token');
//     if (token) {
//     this._auth.put('v3/api/carts/' + pro.id, {is_selected: e.target.checked }).subscribe({
//       next: (response) => {
//        // console.log(response);
//         this.getUserCart();
//       },
//       error: (error) => {
//         //console.log(error);
//       },
//     });}
//     else{
//     //alert('en')
//       const Carts =this.localStorageService.get('cart');
//       if (Carts) {
//         this.cart = JSON.parse(Carts);
//        this.cart = this.cart.map((item: any) => {
//     if (item.product_id ===pro.product_id) {
//       return { ...item, selected: e.target.checked }; // replace `yourField` with the actual field you want to set to true
//     }
//     return item;
//   });
// this.localStorageService.remove('cart');
//   // Save back to local storage
//   this.localStorageService.set('cart', JSON.stringify(this.cart));
  

//       }
//     }
//   }
// controlOnChange(e: Event | any, pro: any) {
//   if (e.target.checked) {
//     let itmorder = {
//       product_id: pro.product_id,
//       option_id: pro.options.map((option: { id: any }) => option.id),
//       quantity: pro.count,
//     };
//     this.items.push(itmorder);
//     this.totalCartPrice += pro.count * pro.price;
//   } else {
//     this.items = this.items.filter(
//       (IitemsOrder) => IitemsOrder.product_id !== pro.product_id
//     );
//     this.totalCartPrice -= (pro.count * pro.price);
//   }

//   const token = this.localStorageService.get('token');
//   if (token) {
//     this._auth.put('v3/api/carts/' + pro.id, { is_selected: e.target.checked }).subscribe({
//       next: () => {
//         this.getUserCart();
//       },
//       error: (error) => {
//         console.log(error);
//       },
//     });
//   } else {
//     const Carts = this.localStorageService.get('cart');
//     if (Carts) {
//       this.cart = JSON.parse(Carts);

//       this.cart = this.cart.map((item: any) => {
//         const isSameProduct = item.product_id === pro.product_id;
//         const isSameOption = item.options?.[0]?.idForValue === pro.options?.[0]?.idForValue;

//         if (isSameProduct && isSameOption) {
//           return { ...item, selected: e.target.checked };
//         }
//         return item;
//       });

//       this.localStorageService.remove('cart');
//       this.localStorageService.set('cart', JSON.stringify(this.cart));
//     }
//   }
// }
controlOnChange(e: Event | any, pro: any) {
  if (e.target.checked) {
    // let itmorder = {
    //   product_id: pro.product_id,
    //   option_id: pro.options.map((option: { id: any }) => option.id),
    //   quantity: pro.count,
    // };
    // this.items.push(itmorder);
    this.totalCartPrice += pro.count * pro.price;
  } 
  else {
  // const selectedOptionIds = pro.options.map((option: any) => option.idForValue || option.id);

  // this.items = this.items.filter(item =>
  //   !(item.product_id === pro.product_id &&
  //     JSON.stringify(item.option_id) === JSON.stringify(selectedOptionIds))
  // );

  this.totalCartPrice -= (pro.count * pro.price);
}

  const token = this.localStorageService.get('token');
  if (token) {
    this._auth.put('v3/api/carts/' + pro.id, { is_selected: e.target.checked }).subscribe({
      next: () => {
       // this.getUserCart();
      },
      error: (error) => {
        console.log(error);
      },
    });
    this.idSelected.push(pro.id);
  } 
  else {
    const Carts = this.localStorageService.get('cart');
    if (Carts) {
      this.cart = JSON.parse(Carts);

      this.cart = this.cart.map((item: any) => {
        const isSameProduct = item.product_id === pro.product_id;
        const isSameOption = item.options?.[0]?.idForValue === pro.options?.[0]?.idForValue;

        if (isSameProduct && isSameOption) {
          return { ...item, selected: e.target.checked };
        }
        return item;
      });

      this.localStorageService.remove('cart');
      this.localStorageService.set('cart', JSON.stringify(this.cart));
    }
  }

  //  for (const item of this.cart) {
     
          
  //         if(item.selected){
  //         this.idSelectedForDelete.push(item.id)
  //       this.idSelected.push(item.id);}
   
  //   }
}
   getUserCart() {
   //const token = localStorage.getItem('token');
   const token = this.localStorageService.get('token');
    if (token) {
      this.CartFromToken=true;
      this._auth.get( `v3/api/store/${this.storeId}/carts`).subscribe({
        next: (response) => {
          this.res = response;
          this.cart = this.res.data;
          
          console.log(this.res.data, 'this.res.data to mapped');
          this.cart = this.cart.map((item: any) => ({
            id: item.id,
            product_id: item.product.id,
            count: +item.count,
            imageUrl: this._auth.productImage(item.product?.images),
            //price: item.product.discount_price!=null?item.product.discount_price:item.product.price,
            price:this.getProductPriceWithOption(item),
            proName: item.product.name,
            description: item.product.description,
            stock:+item.product.count,
            selected:item.is_selected,
            options:item.options
            
          }));
           this.totalCartPrice = 0;
        this.totalCartPriceWithCheckAll=0;
       
        this.items=[];
         for (const item of this.cart) {
          this.totalCartPriceWithCheckAll += item.count * item.price;
          if(item.selected){
          this.totalCartPrice += item.count * item.price;
          //this.itemorder = { id: item.id, count: item.count };
            let itmorder = {
      product_id: item.product_id,
      option_id: item.options.map((option: { id: any }) => option.id),
      quantity: item.count,
    };
          this.items.push(this.itemorder);
          this.idSelected.push(item.id);}}
             const totalCount = this.cart?.reduce((sum: number, item: any) => sum + item.count, 0);
    this.cartSer.SetCartCount(totalCount,this.totalCartPriceWithCheckAll);

        //  console.log(this.cart,'this.cart after map')
        //   this.totalCartPrice = 0;
        //   for (const item of this.cart) {
        //     this.totalCartPrice += (item.price*item.count);
        // }
      },
        error: (error) => {
          console.log(error, 'errorerror cart')
        }
       
      });
    }
    else {
      this.CartFromToken = false;
      const Carts =this.localStorageService.get('cart');
      this.totalCartPrice=0;
      this.totalCartPriceWithCheckAll=0;
      if (Carts) {
        this.cart = JSON.parse(Carts);
        this.cart = this.cart.map((item: any) => ({
            id: 0,
            product_id: item.product_id,
            count: +item.count,
            imageUrl:item.imageUrl,
            price: item.price,
            proName: item.proName,
            description: item.description,
            stock:item.stock?item.stock:0,
            selected:item.selected,
            options:item.options
        }));
      }
       this.totalCartPrice = 0;
        this.totalCartPriceWithCheckAll=0;
        this.items=[];
         for (const item of this.cart) {
          this.totalCartPriceWithCheckAll += item.count * item.price;
          if(item.selected){
          this.totalCartPrice += item.count * item.price;
          //this.itemorder = { id: item.id, count: item.count };
            let itmorder = {
      product_id: item.product_id,
      option_id: item.options.map((option: { id: any }) => option.id),
      quantity: item.count,
    };
          this.items.push(this.itemorder);
          this.idSelected.push(item.id);}}
       
    }
     const totalCount = this.cart?.reduce((sum: number, item: any) => sum + item.count, 0);
     
     //this.cartSer.SetCartCount((+totalCount)+(+count));
   this.cartSer.SetCartCount(totalCount,this.totalCartPriceWithCheckAll);
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
  //getUserCart() {

    // this.totalCartPrice = 0;
    // this._auth.get(`v3/api/store/${this.storeId}/carts`).subscribe({
    //   next: (response) => {
    //     this.res = response;
    //     this.cart = this.res.data;
    //     this.totalCartPrice = 0;
    //     console.log(this.cart, 'this.cartthis.cartthis.cartthis.cart');
    //     for (const item of this.cart) {
    //       if(item.selected){
    //       this.totalCartPrice += item.count * item.price;
    //       this.itemorder = { product_id: item.product.id, // Map the main product ID
    //         option_id: item.options.map((option: { id: any; }) => option.id), // Extract all option IDs
    //         quantity: item.count };
    //       this.items.push(this.itemorder);}
    //     }
    //     //console.log(this.items, 'this.items from cart');
    //     this.cartSer.SetCartCount(this.cart.length);

    //     this._auth
    //       .get('api/v1/shipping/cost/' + this.totalCartPrice)
    //       .subscribe({
    //         next: (response) => {
    //           this.Shipping = response.data;
    //           //  console.log(this.Shipping, 'this.resShipping');
    //         },
    //         error: (error) => console.log(error),
    //       });
    //   },
    //   error: (error) => console.log(error),
    // });
  //}
 checkUncheckAll(e: Event | any) {
  if (e.target.checked) { 
    this.idSelected=[];
    this.items=[];
    var imageSlide: any = document.querySelectorAll('.chechBrand');
    imageSlide.forEach((img: any) => {
      img.checked = true;
      this.totalCartPrice=this.totalCartPriceWithCheckAll;
      
      //this.calculateTotalCartPrice();
    }); 
    for (const item of this.cart) {
     
          this.idSelected.push(item.id);
         
   
    }
   
  } 
  else {
    var imageSlide: any = document.querySelectorAll('.chechBrand');
    this.idSelected=[];
    this.totalCartPrice=0;
    this.idSelectedForDelete=[];
    //this.items=[];
    imageSlide.forEach((img: any) => {
      img.checked = false;
      for (const item of this.cart) {
     
          this.idSelected.push(item.id);
         
   
    }
      // for (const item of this.cart) { 
      //  // this.idSelected.push(item.id);
        // this.idSelected=[];
        //   this.idSelectedForDelete=[];
      //  this.controlOnChange(e,item);
   // }
    }
  
  );
   
  }
  
  
  this.cartSer.changeSelectAllIntoCart(this.idSelected,e.target.checked?true:false);
  
  }
  getNumberArray(stock_count: number) {
    return Array(stock_count)
      .fill(0)
      .map((_, index) => index + 1);
  }
  deleteProFromCart(pro:  any) {
    if(this.CartFromToken){
    this._auth.delete(`v3/api/carts/${pro.id}`).subscribe({
      next: (response) => {
        if (response)
          this.toast.add({
            severity: 'success',
            summary: this.translate.instant('success'),
            detail: this.translate.instant('productdeletesuccessfully'),
          });

        this.getUserCart();
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
    else{
       //const cart = localStorage.getItem('cart');
       const cart = this.localStorageService.get('cart');
      if (cart) {

        const carts = JSON.parse(cart);
     const foundItemIndex = carts.findIndex((item: any) => {
    const hasMatchingProduct = item?.product_id === pro.product_id;

    // If the item has no options but selectedValues exist, return -1
    if (item.options?.length === 0 && pro.options?.length > 0) {
        return false; // Ensures findIndex returns -1
    }

    // If options exist, check for a match
    if (item.options?.length > 0) {
        return hasMatchingProduct && item.options.some((option: any) =>
            pro.options?.some((selected: any) => selected.idForValue === option.idForValue)
        );
    }

    return hasMatchingProduct;
});

     
if (foundItemIndex !== -1) {
          const filterCart= carts.filter((product: any, index: any) => index !== foundItemIndex);
        //localStorage.removeItem('cart');
        this.localStorageService.remove('cart');
       //localStorage.setItem('cart', JSON.stringify(filterCart));
        this.localStorageService.set('cart', JSON.stringify(filterCart));
       this.getUserCart();
        }
    }
  }}
  parseCount(count: any): number {
  return count ? parseInt(count, 10) : 0;
}
isFavorite(favorites: any[], productId: number): boolean {
  return favorites?.some(itm => itm?.product_id === productId);
}

// isFavorite(productId: number): boolean {
//   return this.ProductFavorites.some(itm => itm?.product_id === productId);
// }


  // onDropdownChange(event: any) {
  //  this._auth
  //     .put(`v3/api/carts/${event.target.id}` , { count: event.target.value })
  //     .subscribe({
  //       next: (response) => {
  //         if (response)
  //           this.toast.add({
  //             severity:'success',
  //             summary: this.translate.instant('success'),
  //             detail: this.translate.instant('productcountupdatesuccessfully'),
  //           });
  //           //  this.getTotalPrice();
  //         //this.getUserCart();
  //       },
  //       error: (error) => {
  //         console.log(error);
  //       },
  //     });
     

  // }
  // addNewAddress(): void {
  //   let url = 'api/v1/addresses';
  //   let data = this.addAddress.value;
  //   //console.log(data, 'data');

  //   this._auth.post(url, data).subscribe({
  //     next: (res) => {
  //       this.newAddress = false;
  //     //  console.log(res);
  //       this.toast.add({
  //         severity: 'success',
  //         summary: this.translate.instant('success'),
  //         detail: this.translate.instant('Theaddresshasbeenaddedsuccessfully'),
  //       });
  //       this.router.navigateByUrl('/cart/checkout');
  //     },
  //     error: (err) => {
  //       this.newAddress = false;
  //     },
  //   });
  // }
  onDropdownChange(pro:any,event: any) {
  this.updateCountOfProduct(pro,event.target.value);
 
}
 updateCountOfProduct(pro: any, count: any) {
    if (this.CartFromToken) {
      this._auth
        .put( `v3/api/carts/${pro.id}`, {count: count },)
        .subscribe({
          next: (response) => {
            if (response)
              this.toast.add({
                severity: 'success',
                summary: this.translate.instant('success'),
                detail: this.translate.instant('productcountupdatesuccessfully'),
              });
            //  this.getTotalPrice();
           this.getUserCart();

          },
          error: (error) => {
            console.log(error);
          },
        });
    }
    else {
     //const cart = localStorage.getItem('cart');
     const cart = this.localStorageService.get('cart');
      if (cart) {

        const carts = JSON.parse(cart);
        
const foundItemIndex = carts.findIndex((item: any) => {
    const hasMatchingProduct = item?.product_id === pro.product_id;

    // If the item has no options but selectedValues exist, return -1
    if (item.options?.length === 0 && pro.options?.length > 0) {
        return false; // Ensures findIndex returns -1
    }

    // If options exist, check for a match
    if (item.options?.length > 0) {
        return hasMatchingProduct && item.options.some((option: any) =>
            pro.options?.some((selected: any) => selected.idForValue === option.idForValue)
        );
    }

    return hasMatchingProduct;
});
        if (foundItemIndex !== -1) {
          
          carts[foundItemIndex].count = count;

          console.log(carts, 'localStorage.setItem( JSON.stringify(carts)); ')
            ;
          // this.localStorageService.remove('cart');
          // this.localStorageService.set('cart', JSON.stringify(carts));
          // localStorage.removeItem('cart');
          //localStorage.setItem('cart', JSON.stringify(carts));
          this.localStorageService.remove('cart');
          this.localStorageService.set('cart', JSON.stringify(carts));

        }

    }
   }
   this.getUserCart();
  }
  checkout() {
   // console.log(this.items, 'from checkout');
    if (this.items.length == 0) {
      this.toast.add({
        severity:'error',
        summary: this.translate.instant('error'),
        detail: this.translate.instant('Pleaseselectitemstoordered'),
      });
    } else {
      this.cartSer.SetOrderItem(JSON.stringify(this.items));

      this.cartSer.checkOrderItems$.subscribe();
     // console.log(this.cartSer.OrderItems.value, 'this.cartSer.OrderItems.value');
     if(this.cartSer.CartFromToken){
     this.router.navigateByUrl('/cart/checkout');}
     if(!this.cartSer.CartFromToken){
     this.router.navigateByUrl('/cart/checkoutWithoutRegister');}
    }
  }
signIn(){
 
        
          this.AccountService.loginStatus(true);

          this.AccountService.checkLogin$.subscribe({
            next: (res) => {
           
            },
            error: (err) => {
              console.log(err);
            },
          });
          this.signInFlag=false;
        }
      

 
}
