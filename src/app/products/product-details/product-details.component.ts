
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductDetailsService } from '../product-details.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../shared/services/auth.service';
import { CartService } from '../../cart/cart.service';
import { ProductService } from '../../shared/services/product.service';
import { ResponsiveService } from '../../shared/services/responsive.service';
import { FavoriteService } from '../../favorities/favorite.service';
import { LoadingService } from '../../shared/services/loading.service';
import { environment } from '../../environments/environment';
import { SettingsService } from '../../shared/services/settings.service';
import { AccountService } from '../../account/account.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';
interface Ioptioncontrols {
  [index: string]: boolean;
}

interface Iitem {
  id: number;
  product_id: number;
  name: string;
  hex: string;
}
interface Idetails {
  product_id: number;
  id: number;
  count: number;
  color: string;
  size: string;

  updated_at: string;
  created_at: string;
}
@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit {
  responsiveOptions: any[] | undefined;
  items: MenuItem[] | undefined;
  home: MenuItem | undefined;
  count: number = 1;
  proData: any;
  res: any;
  options:any;
  RangePrice: any;
  images: any[] = [];
  mainimage: any;
  defimage: any = [];
  overview: any;
  colors: any = [];
  size: any = [];
  details: Idetails[] = [];
  showColor: any = [];
  DetaileID!: number;
  selectedValues:any=[];
  selectedColor!: string;
  mainImg!: string;
  proID = this.activatedRoute.snapshot.paramMap.get('id');
  //_token: string = localStorage.getItem('token') || '';
  option: Ioptioncontrols = {};
  price!: any;
  stock!: any;
  selectedvaration!: number;
  SrcOfMain!: string;
  relatedProducts: any[] = [];
  isLoadingProduct: boolean = true;
  showNoPro = false;
  isResponsive = false
  sizeName: any;
  storeId:any;
  selectedOptions:any;
  currency:any;
  noOptionSelected=false;
  @ViewChild('optionsSection') optionsSection!: ElementRef;


  // _______________________________________________________________
  // _______________________________________________________________

  constructor(
    private productDetailsservice: ProductDetailsService,
    private activatedRoute: ActivatedRoute,
    public _auth: AuthService,
    private toast: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService,
    private accSer: AccountService,
    private translate: TranslateService,
    public _productSer: ProductService,
    private _ResponsiveService: ResponsiveService,
    public fav: FavoriteService,
    public loadingService: LoadingService,
    private renderer: Renderer2,
    private _setting:SettingsService,
    private localStorageService: LocalStorageService
   
  ) {

  }

  ngOnInit() {
    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 1,
        numScroll: 1,
      },
      {
        breakpoint: '768px',
        numVisible: 1,
        numScroll: 1,
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1,
      },
    ];
    this._setting.loadSettings().subscribe(data => {

      this.storeId = data.storeId;
      this.currency=data.currency_symbol_native;
    
    });
    window.scrollTo(0, 0);
    this._ResponsiveService.ProductDetailsStatus(true);
    this._ResponsiveService.isProductDetails$.subscribe({
      next: (res) => {
        this.isResponsive = res;
      },
      error: (err) => {
        console.log(err);
      },
    })
    this.items = [
      { label: this.translate.instant('home'), routerLink: '/' },
      { label: this.translate.instant('ProductDetails') },
    ];
this.route.paramMap.subscribe(params => {
   this.proID = params.get('id'); // أو حسب اسم الـ param في الـ route
    if (this.proID) {
      this.getProductDetails();
    }
  });

    this.getProductDetails();
  
  }
  ngOnDestroy() {
    this._ResponsiveService.ProductDetailsStatus(false);
     
  }
  changToOrg() {
    //console.log('enter');
    const mainImage = document.getElementById('preview') as HTMLImageElement;
    mainImage.src = this.mainImg;
  }
  changeMainColor(e: Event | any) {
    const subImagesSrc = e.target.currentSrc;
    const mainImage = document.getElementById('preview') as HTMLImageElement;
    this.mainImg = mainImage.src;
    mainImage.src = subImagesSrc;
  }
handleSelectedId(id: number, optionId: number) {
  const index = this.selectedValues.indexOf(id);
  let extraPrice = 0;
  for (const option of this.options) {
    if (option.id === optionId) {
      const value = option.values.find((v: any) => v.id === id);
      if (value) {
        extraPrice = parseFloat(value.extra_price) || 0;
      }
    }
  }

  // لو أول مرة يتم اختيار أي قيمة – احسب السعر الأساسي
  if (this.selectedValues.length === 0) {
    const basePrice = this.proData.discount_price !== null
      ? parseFloat(this.proData.discount_price)
      : parseFloat(this.proData.price);

    this.price = basePrice;
  }

  // لو القيمة مختارة بالفعل – احذفها واطرح الـ extra_price فقط
  if (index !== -1) {
    this.selectedValues.splice(index, 1);
    this.price -= extraPrice;
    return;
  }

  // حذف أي قيمة مختارة تحت نفس الـ optionId وخصم الـ extra_price الخاص بها
  this.selectedValues.forEach((valueId: any) => {
    const option = this.options.find((opt: any) =>
      opt.values.some((v: any) => v.id === valueId)
    );

    if (option && option.id === optionId) {
      const previousValue = option.values.find((v: any) => v.id === valueId);
      if (previousValue) {
        const previousExtra = parseFloat(previousValue.extra_price) || 0;
        this.price -= previousExtra;
      }
    }
  });

  // تصفية القيم المختارة بحيث نحذف القديمة من نفس الـ option
  this.selectedValues = this.selectedValues.filter((valueId: any) => {
    const option = this.options.find((opt: any) =>
      opt.values.some((v: any) => v.id === valueId)
    );
    return option ? option.id !== optionId : true;
  });

  // إضافة القيمة الجديدة فقط
  this.selectedValues.push(id);
  this.price += extraPrice;
}
  AddProductToCart(proDataId:any,count:any,storeId:any,selectedValues:any,selectedValueObject:any,proDataCount:any,
    proDataImages:any,proDataName:any, proDataDescription:any,price:any){
     if(this.options.length>0){
    if (!this.validateAllOptionsSelected()) {
  return; // Stop process if validation fails
}
  else
    this.cartService.addItemToCart(proDataId,count,storeId,selectedValues,selectedValueObject,proDataCount,
    proDataImages,proDataName, proDataDescription,price)
}

      else
    this.cartService.addItemToCart(proDataId,count,storeId,selectedValues,selectedValueObject,proDataCount,
    proDataImages,proDataName, proDataDescription,price)
   
  }
  onInputChange(e: Event) {
    if (isNaN(parseFloat((e.target as HTMLInputElement).value))) {
      this.count = 0;
    }
    if (parseFloat((e.target as HTMLInputElement).value) >= this.price.stock) {
      this.count = this.price.stock;
      this.showNoPro = true;
      setTimeout(() => {
        this.showNoPro = false;
      }, 10000);
    }

    else this.count = parseFloat((e.target as HTMLInputElement).value);
  }

  counter(type: string) {
    //alert(this.price.stock) 

    if (Number(this.proData.count) > this.count && type === 'add') {
      this.count++;
      if (Number(this.proData.count) == this.count) {
        this.showNoPro = true;
        setTimeout(() => {
          this.showNoPro = false;
        }, 10000);
      }
    }
    if (Number(this.proData.count) >= this.count && type === 'minus')
      this.count--;

  }
  getSelectedValuesAsObjects() {
    return this.selectedValues.map((id:any) => ({ id }));
  }
  getProductDetails() {
   
    const id = this.activatedRoute.snapshot.paramMap.get('id');

    if (id) {
      this._auth.get(`v3/api/products/${id}`).subscribe({
        next: (response) => {
          this.isLoadingProduct=false;
          this.res = response;
          //console.log(this.res, 'getProductDetails');
          this.proData = this.res.data;
         
          this.images = this.proData?.images;
         //alert(this.proData?.count)
          this.options=this.proData?.options;
          const discountPrice = this.proData.discount_price !== null ? parseFloat(this.proData.discount_price) : parseFloat(this.proData.price);
          this.price = discountPrice ;
         console.log(this.selectedValues, 'this.selectedValues');
         console.log(this.proData, 'this.proData');
          // this.images?.forEach((img: any) => {
          //   if (img.is_default == 1) {
          //     this.mainimage =img.url;
          //     this.defimage.push(img.url);
          //   }
          //   else if (img.is_default == 0) {
          //     this.defimage.push(img.url);
          //   }
          // }
          
        //);
        const sortedImages = this.images?.sort((a: any, b: any) => {
  return b.is_default - a.is_default; // يخلي is_default = 1 في الأول
});

this.defimage = [];
sortedImages?.forEach((img: any) => {
  if (img.is_default == 1) {
    this.mainimage = img.url;
  }
  this.defimage.push(img.url);
});

        this.relatedProducts=this.proData.related_products;
        console.log(this.mainimage, 'this.mainimage');
        },
        error: (error) => console.log(error),
      });
      
    }
    }
 getProductPriceWithOption(optionsValue: number[], product: any): number {
    let basePrice = product.discount_price !== null 
        ? parseFloat(product.discount_price) 
        : parseFloat(product.price);

    let extraPrice = product.options
        .flatMap((option: any) => option.values)
        .filter((value: any) => optionsValue.includes(value.id))
        .reduce((total: number, value: any) => total + parseFloat(value.extra_price), 0);

    let totalPrice = basePrice + extraPrice;
    //totalPrice *= count; // Multiply by count

    return totalPrice;
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

  // _________________________________________________
  // _________________________________________________
  testOption(item: any) {
    this.selectedColor = item;
    this.option[item] = true;
    for (const key in this.option) {
      this.option[key] = key == `${item}`;
    }
  }
validateAllOptionsSelected(): boolean {
  const selectedOptionIds = this.selectedValues.map((valueId: any) => {
    const option = this.options.find((opt: any) =>
      opt.values.some((v: any) => v.id === valueId)
    );
    return option?.id;
  }).filter((id: any) => id !== undefined);

  const uniqueSelectedOptionIds = [...new Set(selectedOptionIds)];

  if (uniqueSelectedOptionIds.length !== this.options.length) {
    this.toast.add({
          severity: 'success',
          summary: this.translate.instant('error'),
          detail: this.translate.instant('pleaseSelectValueFromEachOption'),
        });
        this.noOptionSelected=true;
        setTimeout(() => {
    this.optionsSection?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 100);


    return false;
  }

  return true;
}
goToCheckOut(){
  
    if (!this.validateAllOptionsSelected()) {
  return; // Stop process if validation fails
    }
  const selectedCartItemForCheckout=[{count:this.count,price:(this.price*this.count),
    product:this.proData,option_id:this.getSelectedValuesAsObjects()}]
  const token = this.localStorageService.get('token');
  const productForCart = {
  ...this.proData,
  proName: this.proData.name,
  imageUrl:this._auth.productImage(this.proData.images)
};

 //const selectedCartItemForCheckoutWithoutRegister=[{count:this.count,price:(this.price*this.count),product: productForCart}]
const selectedCartItemForCheckoutWithoutRegister=[{count:this.count,price:(this.price*this.count),proName: this.proData.name,
  imageUrl:this._auth.productImage(this.proData.images),
product_id:this.proData.id,option_id:this.getSelectedValuesAsObjects()}]
 if(token){ 
  this.cartService.setCartForcheckout(selectedCartItemForCheckout);
  this.router.navigate(['/checkout']);}
else{
  this.cartService.setCartForcheckout(selectedCartItemForCheckoutWithoutRegister);
  this.router.navigate(['/checkoutWithoutRegister']);
}

}
}
