import { Component, Inject, Input,HostListener, ViewChild, ElementRef } from '@angular/core';
import { of } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { utils } from '../../shared/utils/utils';
import { FavoriteService } from '../../favorities/favorite.service';
import { AuthService } from '../../shared/services/auth.service';
import { SearchService } from '../../shared/services/search.service';
import { ProductService } from '../../shared/services/product.service';
import { SettingsService } from '../../shared/services/settings.service';
import { CartService } from '../../cart/cart.service';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../shared/services/local-storage.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent {
  // PopularProducts: PopularProducts[] | [] | undefined;
  //baseLinkUrl: string = utils.baseLinkUrl;
  cats: any;
   @Input() showHead: any = true;
   @Input() PopularProducts: any = [];
   @Input() isPopularProductsLoading:boolean=true;
   @Input() showCartContainer:boolean=true;
   activePopoverId: number | null = null;

  res: any;
  productItems1: any;
  count=0;
  productItems: any = [];
  searchKey: string = '';
  private initialScrollPosition = 0;
  private previousStep = -1;
  storeId:any=1;
   currency:any;
   selectedProductId: number | null = null;
   selectedProduct: any = null;

   productCounts: { [key: number]: number } = {};

   addToCart2=false
   showProductOption=false;
   showProductOptionRes=false;
   selectedValues:any=[];
   noOptionSelected=false;
   selectedProductprice:any=0;
   isMobile: boolean = false;
selectedProductCount:any=1;
showNoPro:boolean = false;
selectedCartItem:any=[];
@ViewChild('footerAnchor', { static: false }) footerAnchor!: ElementRef;
isFooterVisible = false;


@HostListener('window:scroll', [])
onWindowScroll() {
  const footer = document.querySelector('app-footer');
  if (footer) {
    const rect = footer.getBoundingClientRect();
    this.isFooterVisible = rect.top < window.innerHeight && rect.bottom > 0;
  }
}

  constructor(
    @Inject(DOCUMENT) private dom: Document,
    
    
    public fav: FavoriteService,
    private searchSer: SearchService,
    public _auth: AuthService,
    public _productSer:ProductService,
    private _setting:SettingsService,
    public cartService: CartService,
    private toast: MessageService,
    private translate: TranslateService,
    private router:Router,
    private localStorageService: LocalStorageService
  ) {}
  ngAfterViewInit() {
  const footerEl = this.dom?.querySelector('[#footerAnchor]');

  if (footerEl) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        this.isFooterVisible = entry.isIntersecting;
      },
      {
        root: null,
        threshold: 0.1
      }
    );

    observer.observe(footerEl);
  }
}

  ngOnInit(): void {
   this._setting.loadSettings().subscribe(data => {
    this.currency=data.currency_symbol_native;
    this.storeId=data.storeId
  });
  this.isMobile = window.innerWidth <= 768;
  }

  getPrice(num: number | string): number {
    let price: number = 0;
    if (typeof num == 'string') {
      price = Math.ceil(parseInt(num));
      return price;
    }

    return Math.ceil(num);
  }

 
toggleAddToCart(productId: number,product:any) {
  this.selectedProduct=product;
  this.productCounts[product.id]=1;
  const discountPrice = this.selectedProduct.discount_price !== null ? parseFloat(this.selectedProduct.discount_price) : parseFloat(this.selectedProduct.price);
  this.selectedProductprice=discountPrice;
  this.selectedProductId = this.selectedProductId === productId ? null : productId;
  if (!this.productCounts[productId]) {
    this.productCounts[productId] = 1; // أول مرة نفتح الكارت، نبدأ بـ 1
  }
  if(product.options.length==0||product.options==null) {
const discountPrice = product.discount_price !== null ? parseFloat(product.discount_price) : parseFloat(product.price);
          
   this.cartService.addItemToCart(product.id,this.productCounts[product.id],this.storeId,[],[],product.count,
    this._auth.productImage(product?.images),product.name, product.description,discountPrice,false) }
    else{
      if(this.isMobile){this.showProductOptionRes=true}
      else{this.showProductOption=true;}
      
      // this.selectedProduct=null;
      // this.selectedProductprice=0;
      this.selectedProductCount=1;
    }

}

increment(productId: number, max: number,product:any) {
  if (this.productCounts[productId] < max) {
    this.productCounts[productId]++;
    
  }
  const discountPrice = product.discount_price !== null ? parseFloat(product.discount_price) : parseFloat(product.price);
   this.cartService.addItemToCart(product.id,1,this.storeId,[],[],product.count,
    this._auth.productImage(product?.images),product.name, product.description,discountPrice,false)
  //this.cartService.updateCountOfProductFromHome(product,this.productCounts[productId],'inc');

  //else if ( max==1) {this.productCounts[productId]=1;}
       
    
  
  }

decrement(productId: number,product:any) {
  if (this.productCounts[productId] >= 1) {
    this.productCounts[productId]--;
 // if(this.productCounts[productId] >= 1) {
    
  this.cartService.incrementOrDecrementQuantityInCart(product,1,'decrement');} 
 }
onInputChange(event: any, productId: number, max: number) {
  const value = Number(event.target.value);
  this.productCounts[productId] = Math.min(Math.max(value, 1), max);
}
handleSelectedId(id: number, optionId: number) {
  const index = this.selectedValues.indexOf(id);
  let extraPrice = 0;
  for (const option of this.selectedProduct.options) {
    if (option.id === optionId) {
      const value = option.values.find((v: any) => v.id === id);
      if (value) {
        extraPrice = parseFloat(value.extra_price) || 0;
      }
    }
  }

  // لو أول مرة يتم اختيار أي قيمة – احسب السعر الأساسي
  if (this.selectedValues.length === 0) {
    const basePrice = this.selectedProduct.discount_price !== null
      ? parseFloat(this.selectedProduct.discount_price)
      : parseFloat(this.selectedProduct.price);

    this.selectedProductprice = basePrice;
  }

  // لو القيمة مختارة بالفعل – احذفها واطرح الـ extra_price فقط
  if (index !== -1) {
    this.selectedValues.splice(index, 1);
    this.selectedProductprice -= extraPrice;
    return;
  }

  // حذف أي قيمة مختارة تحت نفس الـ optionId وخصم الـ extra_price الخاص بها
  this.selectedValues.forEach((valueId: any) => {
    const option = this.selectedProduct.options.find((opt: any) =>
      opt.values.some((v: any) => v.id === valueId)
    );

    if (option && option.id === optionId) {
      const previousValue = option.values.find((v: any) => v.id === valueId);
      if (previousValue) {
        const previousExtra = parseFloat(previousValue.extra_price) || 0;
        this.selectedProductprice -= previousExtra;
      }
    }
  });

  // تصفية القيم المختارة بحيث نحذف القديمة من نفس الـ option
  this.selectedValues = this.selectedValues.filter((valueId: any) => {
    const option = this.selectedProduct.options.find((opt: any) =>
      opt.values.some((v: any) => v.id === valueId)
    );
    return option ? option.id !== optionId : true;
  });

  // إضافة القيمة الجديدة فقط
  this.selectedValues.push(id);
  this.selectedProductprice += extraPrice;
} 
counter(type: string) {
   

    if (Number(this.selectedProduct.count) > this.selectedProductCount&& type === 'add') {
      this.selectedProductCount++; 
      if (Number(this.selectedProduct.count) == this.selectedProductCount) {
        
        this.showNoPro = true;
        setTimeout(() => {
          this.showNoPro = false;
        }, 10000);
      }
    }
    if (Number(this.selectedProduct.count) >= this.selectedProductCount && type === 'minus')
      this.selectedProductCount--;

  }
   onInputChangeSelectedProduct(e: Event,selectedProductCount:any) {
    if (isNaN(parseFloat((e.target as HTMLInputElement).value))) {
      this.selectedProductCount = 0;
    }
    if (parseFloat((e.target as HTMLInputElement).value) >= +selectedProductCount) {
      this.selectedProductCount= selectedProductCount;
      this.showNoPro = true;
      setTimeout(() => {
        this.showNoPro = false;
      }, 10000);
    }

    else this.selectedProductCount = parseFloat((e.target as HTMLInputElement).value);
  }
  addToCartWithOption(proDataId:any,count:any,storeId:any,selectedValues:any,selectedValueObject:any,proDataCount:any,
    proDataImages:any,proDataName:any, proDataDescription:any,price:any){
     if(this.selectedProduct?.options?.length>0){
    if (!this.validateAllOptionsSelected()) {
  return; // Stop process if validation fails
}
  else
    this.cartService.addItemToCart(proDataId,count,storeId,selectedValues,selectedValueObject,proDataCount,
    proDataImages,proDataName, proDataDescription,price,false);
    this.closeShowProductOptionRes(); 
    this.showProductOption=false;
}

    //   else
    // this.cartService.addItemToCart(proDataId,count,storeId,selectedValues,selectedValueObject,proDataCount,
    // proDataImages,proDataName, proDataDescription,price,false)
  
  }
   getSelectedValuesAsObjects() {
    return this.selectedValues.map((id:any) => ({ id }));
  }
  validateAllOptionsSelected(): boolean {
  const selectedOptionIds = this.selectedValues.map((valueId: any) => {
    const option = this.selectedProduct?.options.find((opt: any) =>
      opt.values.some((v: any) => v.id === valueId)
    );
    return option?.id;
  }).filter((id: any) => id !== undefined);

  const uniqueSelectedOptionIds = [...new Set(selectedOptionIds)];

  if (uniqueSelectedOptionIds.length !== this.selectedProduct?.options.length) {
    this.toast.add({
          severity: 'success',
          summary: this.translate.instant('error'),
          detail: this.translate.instant('pleaseSelectValueFromEachOption'),
        });
        this.noOptionSelected=true;
    return false;
  }

  return true;
}
 getOptionValueSelected(optionsValue: number[], product: any): any[] {
    return product.options
        .map((option: any) => {
            // Find the matching value in the values array
            const matchedValue = option.values.find((val: any) => optionsValue.includes(val.id));

            // If a matching value exists, return the structured object
            return matchedValue ? { idForValue:matchedValue.id,name: option.name, value: matchedValue.value } : null;
        })
        .filter((item: any) => item !== null); // Remove null entries if no match was found
}
goToCheckOutForProduct(pro:any){
 console.log(pro,'selectedCartItemForCheckout selectedCartItemForCheckout');
 console.log(this.productCounts[pro.id],'this.productCounts[pro.id] this.productCounts[pro.id]');
 const discountPrice = pro.discount_price !== null ? parseFloat(pro.discount_price) : parseFloat(pro.price);
 const proCount=this.productCounts[pro.id]==undefined?1:this.productCounts[pro.id];
  const selectedCartItemForCheckout=[{count:(proCount),
    price:(discountPrice*proCount),
    product:pro,
  option_id:[]}]
 
  const token = this.localStorageService.get('token');
  

 const selectedCartItemForCheckoutWithoutRegister=[{count:proCount,price:(discountPrice*proCount),proName: pro.name,
  imageUrl:this._auth.productImage(pro.images),product_id:pro.id,option_id:[]}]

 if(token){ 
  this.cartService.setCartForcheckout(selectedCartItemForCheckout);
  this.router.navigate(['/checkout']);}
else{
  this.cartService.setCartForcheckout(selectedCartItemForCheckoutWithoutRegister);
  this.router.navigate(['/checkoutWithoutRegister']);
}

}
goToCheckOut(){
  
    if (!this.validateAllOptionsSelected()) {
  return; 
    }
  const selectedCartItemForCheckout=[{count:this.selectedProductCount,
    price:(this.selectedProductprice*this.selectedProductCount),
    product:this.selectedProduct,
  option_id:this.getSelectedValuesAsObjects()}]
  const token = this.localStorageService.get('token');
  

 const selectedCartItemForCheckoutWithoutRegister=[{count:this.selectedProductCount,price:(this.selectedProductprice*this.selectedProductCount),proName: this.selectedProduct.name,
  imageUrl:this._auth.productImage(this.selectedProduct.images),product_id:this.selectedProduct.id,option_id:this.getSelectedValuesAsObjects()}]

 if(token){ 
  this.cartService.setCartForcheckout(selectedCartItemForCheckout);
  this.router.navigate(['/checkout']);}
else{
  this.cartService.setCartForcheckout(selectedCartItemForCheckoutWithoutRegister);
  this.router.navigate(['/checkoutWithoutRegister']);
}

}
isProductInCart(productId: number): boolean {
  return this.cartService.getProductCountInCart(productId) > 0;
}

getProductCartCount(productId: number): number {
  return this.cartService.getProductCountInCart(productId);
}
closeShowProductOptionRes(){
  this.showProductOptionRes=false;
}
showPopover(productId: number) {
  this.activePopoverId = productId;

  setTimeout(() => {
    if (this.activePopoverId === productId) {
      this.activePopoverId = null;
    }
  }, 3000); // 3 ثواني
} 
}
