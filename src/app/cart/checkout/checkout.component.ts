import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { CartService } from '../cart.service';
import { SettingsService } from '../../shared/services/settings.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
  standalone:false
})
export class CheckoutComponent {
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
  allCountriesDistinict:any;
  governorateId:any;
   totalCartPrice=0;
  Shipping=0;
  countryId:any;
  currency:any;
  shippingAreas:any;
  cityId:any;
  constructor( public _auth: AuthService,private _fb: FormBuilder,
    public cartSer: CartService,private _setting:SettingsService,
    private router: Router) {
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
    products:this.OrderItem
  });}
  ////////
  ngOnInit() {
  this._setting.loadSettings().subscribe(data => {

    this.storeId = data.storeId;
    this.currency=data.currency_symbol_native;
    //this.getGovernamentandCountry();
    this.getAllCountriesShipping();
    //this.fetchCountries()
    const cart = this.cartSer.getCartForcheckout();
if (cart && cart.length > 0) {
  this.selectedCartItem = cart;
   this.totalCartPrice = this.selectedCartItem[0].count * Number(this.selectedCartItem[0].price);
   console.log(this.selectedCartItem,'this.selectedCartItem from');
   const item = cart[0] as any; // أو استخدمي نوع مضبوط لو عندك interface
 this.OrderItem=this.selectedCartItem.map((item:any) => ({
            product_id: item.product.id, // Extract product ID
            option_id: item.option_id, // Extract option IDs
            quantity: item.count // Extract quantity
        }));
// this.OrderItem = [{
//   product_id: item.product_id,
//   option_id: item.option_id.map((option:any) => option.id),
//   quantity: item.count
// }];
 console.log(this.OrderItem,'this.OrderItem from');
           
      
  //  alert(this.selectedCartItem[0].count);
  //  alert(this.selectedCartItem[0].price)
} else {
  this.getUserCart();
}
 // this.getUserCart();
  });
  }
  getUserCart() {
    this._auth.get(`v3/api/store/${this.storeId}/carts`).subscribe({
      next: (response) => {
        this.cart = response.data;
        console.log(this.cart, 'this.cart');
        this.selectedCartItem=this.cart.filter((item: { is_selected: any; }) => item.is_selected);
        this.totalCartPrice=0;
      this.OrderItem=this.selectedCartItem.map((item: { product: { id: any }; options: any[]; count: any }) => ({
            product_id: item.product.id, // Extract product ID
            option_id: item.options.map(option => option.id), // Extract option IDs
            quantity: item.count // Extract quantity
        }));
       for (const item of this.selectedCartItem) {
          
          this.totalCartPrice += item.count * Number(item.price);
       // alert(this.totalCartPrice)
        }
            console.log(this.selectedCartItem,'this.selectedCartItem')
      },
      error: (error) => console.log(error),
    });
    
}
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
  ///////
getGovernamentandCountry(e:any){
  const country= this.allCountries.filter((item: { country_id: any; }) => item.country_id === e.value)
 this.Shipping= +country[0].cost;
 this.countryId=e.value;
  this._auth.get(`v3/api/governorates/store/${this.storeId}`).subscribe({
    next: (response) => {
    this.allgovernament = response;
    this.allgovernament= response.filter((item: { country_id: any; }) => item.country_id === e.value);
      console.log(response,'this.allCountries');
    },
    error: (error) => console.log(error),
  });
  
}
getGovernamentForCountries(e:any){
  this.governorateId=e.value;
  this.allgovernament = this.allCountries.filter((item: { country_id: any; }) => item.country_id === e.value);
 console.log(this.allgovernament,'this.filteredGovernament this.filteredGovernament');
}

// getAllcitiesShipping(e:any){
//   const governament=this.allgovernament.filter((item: { state_id: any; }) => item.state_id === e.value);
//   console.log(governament,'governament')
//   if(governament)
//   this.Shipping =+governament[0]?.shipping_cost;
//   this._auth.get(`v3/api/shipping/cities/store/${this.storeId}`).subscribe({
//     next: (res) => {
//       this.shippingCities = res.data;
//       console.log(this.shippingCities,'this.shippingCities')
// this.shippingCities=this.shippingCities.filter((item:any) =>
//  (item.location.country?.id==this.governorateId&&
//   item.location.state?.id==e.value
// ));
      
//     },
//     error: (err) => {
//       console.log(err);
//     },
//   });
// }
getAllCountriesShipping(){
   this._auth.get(`v3/api/shippings/store/${this.storeId}`).subscribe({
    next: (res) => {
      console.log(res,'res getAllCountriesShipping');
      this.allCountries = res;
            // ✅ لو فيه دولة واحدة بس، نختارها تلقائيًا
         if (this.allCountries.length === 1) {
        this.DataOrderForm.get('country_id')?.setValue(this.allCountries[0].country_id);
        const event={value:this.allCountries[0].country_id};
        this.Shipping=this.allCountries[0]?.cost;
        this.getGovernamentandCountry(event);
      }

            },
    error: (err) => {
      console.log(err);
    },
  });
}
CreateOrder() {
 const obj=this.getRequestBody();
  this._auth.post(`v3/api/store/${this.storeId}/orders/create`,obj ).subscribe({
    next: (response) => 
      {this.router.navigateByUrl('/cart/checkout/finishcheckout/'+response.data.order.id);},
    error: (error) => {
     console.log(error);
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
 getSum(a: number, b: number): number {
  return a + b;
}
}