import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../shared/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../cart.service';
import { ResponsiveService } from '../../shared/services/responsive.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { SettingsService } from '../../shared/services/settings.service';

@Component({
  selector: 'app-checkout-without-register',
  templateUrl: './checkout-without-register.component.html',
  styleUrl: './checkout-without-register.component.scss'
})
export class CheckoutWithoutRegisterComponent {
  
 DataOrderForm!:FormGroup;
  allgovernament:any=[];
  allcity:any=[];
  storeId:any;
  cart: any;
  governaments:any;
  CheckoutResOrder: boolean = false;
  OrderItem: any = [];
  selectedCartItem:any=[];
  allCountries:any;
  filteredCities:any;
  shippingCities:any;
  shippingAreas:any;
  allCountriesDistinict:any;
  governorateId:any;
  totalCartPrice=0;
  Shipping=0;
  countryId:any;
  cityId:any;
  currency:any;
  constructor( public _auth: AuthService,private _fb: FormBuilder,
    public cartSer: CartService,private _setting:SettingsService,
    private router: Router,
  private localStorageService:LocalStorageService) {
    this.DataOrderForm=this._fb.group({
    
    customer_note : [""],
    customer_name:["", Validators.required],
    country_id : ["", Validators.required],
    government_id : [""],
    city_id : [""],
    area_id : [""],
    address : ["", Validators.required],
    notes : [""],
    phone_number: ["", Validators.required],
    products:this.OrderItem,
    
  });}
  ////////
  ngOnInit() {
  // this.cartSer.checkOrderItems$.subscribe(orderItems => {
  //   if (orderItems) {
  //     this.OrderItem = JSON.parse(orderItems); // Parse the JSON string into an array
  //     console.log(this.OrderItem,'itemsArray'); // Log or use the array as needed
  //   }
  // });
  this._setting.loadSettings().subscribe(data => {
     this.currency=data.currency_symbol_native;
    this.storeId = data.storeId;
    //this.getGovernamentandCountry();
    this.getAllCountriesShipping();
    const cart = this.cartSer.getCartForcheckout();
    if (cart && cart.length > 0) {
  this.selectedCartItem = cart;
  console.log(this.selectedCartItem,'this.selectedCartItem this.selectedCartItem')
   this.totalCartPrice = this.selectedCartItem[0].count * Number(this.selectedCartItem[0].price);
   this.selectedCartItem = cart;
   this.totalCartPrice = this.selectedCartItem[0].count * Number(this.selectedCartItem[0].price);
   console.log(this.selectedCartItem,'this.selectedCartItem from');
   const item = cart[0] as any; // أو استخدمي نوع مضبوط لو عندك interface

this.OrderItem = [{
  product_id: item.product_id,
  option_id: item.option_id.map((option:any) => option.id),
  quantity: item.count
}];
//console.log(this.OrderItem,'this.OrderItem from');
   //this.getUserCart();
  //  alert(this.selectedCartItem[0].count);
  //  alert(this.selectedCartItem[0].price)
} else {
  this.getUserCart();
}
  //this.getUserCart();
  });
  }
 
  getUserCart() {
    const  Carts= this.localStorageService.get('cart');
   if(Carts){
     this.cart= JSON.parse(Carts);
     console.log( this.cart,' this.cart from local')
        this.OrderItem=this.cart
            .filter((item: { selected: any; }) => item.selected==1) // Only include selected items
            .map((item: { product_id: any; options: any[]; count: any; }) => ({
            product_id: item.product_id, // Extract product ID
            option_id: item.options.map(option => option.idForValue), // Extract option IDs
            quantity: item.count // Extract quantity
        }));
        this.totalCartPrice=0;
        this.selectedCartItem=this.cart
            .filter((item: { selected: any; }) => item.selected==1);
             for (const item of this.selectedCartItem) {
          
          this.totalCartPrice += item.count * item.price;}
      // this.OrderItem=this.cart.map((item: { product_id: any; options: any[]; count: any; }) => ({
      //       product_id: item.product_id, // Extract product ID
      //       option_id: item.options.map(option => option.idForValue), // Extract option IDs
      //       quantity: item.count // Extract quantity
      //   }));
    //  this.cart = this.cart.map((item:any) => ({
    //    id:0,
    //    product_id: item.product_id,
    //    count: +item.count,
    //    product_variant_id: item.product_variant_id,
    //    size_id: item.size_id,
    //    imageUrl:item.imageUrl,
    //    price:item.price  ,
    //    proName:item.proName,
    //    title:item.title,
    //    size:item.size,
    //    color:item.color,
    //    stock:item.stock,
    //    selected:item.selected
    //  }));
    //  this.totalCartPrice = 0;
    //   for (const item of this.cart) {
    //    if(item.selected==1){
        
    //    this.totalCartPrice += item.count * item.price;
    //    let itemorder = { variant_id: item.product_variant_id, count: item.count,size_id:item.size_id };
    //    this.itemsOrder.push(itemorder);
    //   this.newcart.push(item);
    //    console.log(this.itemsOrder,'this.itemorder after get cart');
    //  }
    //  }
     
   }
  }
   
  ///////
getGovernamentandCountry(e:any){
 
 const country= this.allCountries.filter((item: { country_id: any; }) => item.country_id === e.value)
 this.Shipping= +country[0].cost;
 this.countryId=e.value;
 console.log(country,'country country')
  this._auth.get(`v3/api/governorates/store/${this.storeId}`).subscribe({
    next: (response) => {
      
      
    this.allgovernament = response;
    this.allgovernament= response.filter((item: { country_id: any; }) => item.country_id === e.value);
      console.log(this.allgovernament,'this.allgovernament');
    },
    error: (error) => console.log(error),
  });
  
}
// getGovernamentForCountries(e:any){
//   this.governorateId=e.value;
//   this.allgovernament = this.allCountries.filter((item: { country_id: any; }) => item.country_id === e.id);
//  console.log(this.allgovernament,'this.filteredGovernament this.filteredGovernament');
// }
getAllAreaForCities(e:any){

const city=this.shippingCities.filter((item:any) =>
 (item.location.country?.id==this.countryId&&
  item.location.state?.id==this.governorateId&&item.location.city?.id==e.value
));
  if(city)
    
  this.Shipping =+city[0]?.shipping_cost
  this._auth.get(`v3/api/areas/store/${this.storeId}`).subscribe({
    next: (response) => {
      
      
    this.shippingAreas = response.data;
   console.log(this.allgovernament,'this.filteredGovernament this.filteredGovernament');
  

    
    },
    error: (error) => console.log(error),
  });
  
}

getAllcitiesShipping(e:any){
  this.governorateId=e.value;
  //alert(e.value)
  const governament=this.allgovernament.filter((item: { state_id: any; }) => item.state_id === e.value);
  
  if(governament)
  this.Shipping =+governament[0]?.shipping_cost
   
  this._auth.get(`v3/api/cities/store/${this.storeId}`).subscribe({
    next: (res) => {
      this.shippingCities = res.data;
      
this.shippingCities=this.shippingCities.filter((item:any) =>
 (item.location.country?.id==this.countryId&&
  item.location.state?.id==e.value
));
      console.log(this.shippingCities,'this.shippingCities')
    },
    error: (err) => {
      // this._tosat.showToast(
      //   'error',
      //   'OOops !',
      //   err.error.message,
      //   'pi-thumbs-down',
      //   false
      // );
      console.log(err);
    },
  });
}
getAllCountriesShipping(){
  
  this._auth.get(`v3/api/shippings/store/${this.storeId}`).subscribe({
    next: (res) => {
      this.allCountries = res;
       if (this.allCountries.length === 1) {
        this.DataOrderForm.get('country_id')?.setValue(this.allCountries[0].country_id);
        const event={value:this.allCountries[0].country_id};
        this.Shipping=this.allCountries[0]?.cost;
        this.getGovernamentandCountry(event);
      }
            },
    error: (err) => {
      // this._tosat.showToast(
      //   'error',
      //   'OOops !',
      //   err.error.message,
      //   'pi-thumbs-down',
      //   false
      // );
      console.log(err);
    },
  });
}
getAreaChipping(e:any){
  const area=this.shippingAreas.filter((item:any) =>
 (item?.id==e.value
));
if(area){
  this.Shipping=area[0]?.cost;
}
}
CreateOrder() {
  const obj = this.getRequestBody();
  this._auth.post(`v4/api/stores/${this.storeId}/orders`, obj).subscribe({
    next: (response) => {
      const orderedProductIds = obj.products.map((p: { product_id: any; }) => p.product_id);

      // 🗑️ Remove ordered products from local storage
      const cart = JSON.parse(this.localStorageService.get('cart') || '[]');
      const updatedCart = cart.filter((item: any) => !orderedProductIds.includes(item.product_id));
      this.localStorageService.set('cart', JSON.stringify(updatedCart));
      this.cartSer.getCart(this.storeId);
      // ✅ Navigate to confirmation page
      this.router.navigateByUrl('/cart/checkoutWithoutRegister/finishcheckout/' + response.data.order.id);

      console.log(response);
    },
    error: (error) => {
      console.log(error);
    }
  });
}
getRequestBody(): any {
  const formValue = this.DataOrderForm.value; // Extract form data

  const requestBody = {
      customer_note: formValue.customer_note,
      customer_name:formValue.customer_name,
      shipping_address: {
          country_id: formValue.country_id,
          government_id: formValue.government_id,
          city_id: formValue.city_id,
          area_id: formValue.area_id,
          address: formValue.address,
          notes: formValue.notes,
          phone_number: formValue.phone_number
      },
      products: this.OrderItem.map((product: any) => ({
          product_id: product.product_id,
          option_id: product.option_id, // Assuming `option_id` is already an array
          quantity: product.quantity
      }))
  };

  return requestBody;}
}