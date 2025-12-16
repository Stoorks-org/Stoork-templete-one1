import { Component } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { MessageService } from 'primeng/api';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ResponsiveService } from '../../../shared/services/responsive.service';
import { FavoriteService } from '../../favorite.service';
import { CartService } from '../../../cart/cart.service';
import { ProductService } from '../../../shared/services/product.service';
import { SettingsService } from '../../../shared/services/settings.service';
import { LocalStorageService } from '../../../shared/services/local-storage.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrl: './items.component.scss'
})
export class ItemsComponent {
  isResponsive=true;
  storeId:any;
  AddListForm: any;
  constructor(
    
    private _toast: MessageService,
    public _aut: AuthService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
   private translate:TranslateService,
    private cartService: CartService,
    private _ResponsiveService:ResponsiveService,
    public _auth: AuthService,
    public _productSer:ProductService,
    public fav: FavoriteService, private _setting:SettingsService,
    private localStorageService: LocalStorageService,
  ) {
   
    this.AddItemTOListform = this.formBuilder.group({
      id: this.formBuilder.array([], [Validators.required]),
    });
  }
  // AddListForm = new FormGroup({
  //   name: new FormControl('', Validators.required),
  //   store_id:new FormControl(''),
  // });
  showAddListDiolog: boolean = false;
  // @Input() productItems: any = [];
  //@Input() ListID: any;
  ListID = this.activatedRoute.snapshot.paramMap.get('id');
  //@Output() itemsLength = new EventEmitter<any>();
  //@Output() listsLength = new EventEmitter<any>();
  res: any;
  ProID!: any;
  res4: any;
  productItems: any = [];
  //@Input() productItems: any = [];
  overlayVisible: boolean = false;
  show: any = [];
  first: number = 0;
  rows: number = 10;
  showAddItemToListDiolog: boolean = false;
  AddItemTOListform: FormGroup;
  lists: any;
  resList: any;
  selectedCheckBoxList: any = [];
  product_variant_id:any;
  isFavProductsLoading=true;
 
  ngOnInit() {
    this._setting.loadSettings().subscribe(data => {

      this.storeId = data.storeId;
    this.getfaviorites();
    this.getlists();
     this.AddListForm = new FormGroup({
    name: new FormControl('', Validators.required),
    store_id:new FormControl(this.storeId),
  });
    });
    this._ResponsiveService.FavoriteStatus(true);
   this._ResponsiveService.isFavorites$.subscribe({
    next: (res) => {
      this.isResponsive = res;
    },
    error: (err) => {
      console.log(err);
    },} )
    
  }
  ngOnDestroy() {
    this._ResponsiveService.FavoriteStatus(false);
  }
  // AddProductToCart(ProID: number | any) {
  //   this._aut
  //     .post(
  //       'api/v1/carts',
  //       {
          
  //         product_id: +ProID,
  //         count: 1,
  //         store_id:this.storeId
  //                },
  //       false
  //     )
  //     .subscribe({
  //       next: (response) => {
  //         this.cartService.CartStatus(true);
  //         this.cartService.checkCart$.subscribe();
  //       },
  //       error: (error) => {
  //         console.log(error);
  //       },
  //     });
  // }
  AddItemList(e: any) {
  //  var target = e.target || e.currentTarget;
   // this.ProID = (e.target as Element).id;
   this.ProID=e.product_id;
    //this.product_variant_id=e.id;
    this.showAddItemToListDiolog = true;
    //console.log(this.ProID, 'proidevent');
  }
  DeleteProductFromFavorites(ID: number) {
     const token = this.localStorageService.get('token');
      if(token) {
    this._aut.delete(`v3/api/favorite/${ID}`).subscribe({
      next: (response) => {
        this._toast.add({
          severity: 'success',
          summary: this.translate.instant('success'),
          detail: this.translate.instant('ProductDeletesuccessfully'),
        });
       
        this.getfaviorites();
        this.getlists();
      },
      error: (err) => {
        this._toast.add({
          severity: 'success',
          summary: this.translate.instant('error'),
          detail: err.message,
        });
       
      },
    });}
    else{
     // alert(product_id)
      const favioriteData = this.localStorageService.get('favorite');
if (favioriteData) {
  const favoritesArray = JSON.parse(favioriteData);

  // فلترة العناصر واستبعاد اللي product_id === id
  const updatedFavorites = favoritesArray.filter((item: any) => item.product_id !== ID);

  // تحديث الـ localStorage
  this.localStorageService.remove('favorite');
  this.localStorageService.set('favorite', JSON.stringify(updatedFavorites));
  this.getfaviorites();
}

    }
  }
  getfavioritesAPI(){
 this._aut.get(`v3/api/favorite/${this.storeId}/store`).subscribe({
        next: (response) => {
          this.isFavProductsLoading=false;
          this.res = response;
          this.productItems = this.res.favorites.reverse();
          this.productItems = this.productItems.map((item: any) => ({
            id:item.id,
            product_id: item.product.id,
            imageUrl: this._aut.productImage(item.product.images) ,
            price: item.product.price,
            discount_price:item.product?.discount_price?item.product?.discount_price:0,
            proName: item.product.name,
            description: item.product.description,
            stock:+item.product.count?item.product.count:0,
        }));
          console.log(this.productItems, 'this.productItems faviorites ');
          //this.itemsLength.emit(this.productItems.length);
          this.fav.itemsLength.next(this.productItems.length);
          this.show = this.productItems.slice(this.first, this.rows);
          console.log(this.show, 'this.productItems from fav');
        },
      });
  }
  getfavioritesLocal(){
    this.isFavProductsLoading=true;
    const favioriteData = this.localStorageService.get('favorite');
    console.log(favioriteData,'faviorites getfavioritesLocal');
    const faviorites =JSON.parse(favioriteData)?JSON.parse(favioriteData).reverse() : [];

       
      if (faviorites) {
       
       this.productItems = faviorites.map((item: any) => ({
            id: item.product_id,
            imageUrl:item.imageUrl,
            price: item.price,
            discount_price:item.discount_price,
            proName: item.proName,
            description: item.description,
            stock:item.stock?item.stock:0,
        }));
        this.fav.itemsLength.next(this.productItems.length);
          this.show = this.productItems.slice(this.first, this.rows);
          this.isFavProductsLoading=false;
          console.log(this.show,'this.show this.show')
  }}
  getfaviorites() {
    this.isFavProductsLoading=true;
    if (!this.ListID) {
      const token = this.localStorageService.get('token');
      if(token) {this.getfavioritesAPI();}
      else{this.getfavioritesLocal();}
     
      // if (this.ListID != 0)
    } 
    else {
      this._aut.get(`v3/api/lists/${this.storeId}/store`, false).subscribe({
        next: (response) => {
          this.res4 = response;
          //console.log(this.res4, 'res4');
          this.productItems = this.res4.data;

          this.show = this.productItems.slice(this.first, this.rows);
          // console.log(this.productItems, 'else');
        },
        error: (err) => {
          console.log(err.message);
        },
      });
    }
  }
  public toggle() {
    this.overlayVisible = !this.overlayVisible;
    // this.overlayVisible = true;
  }
  onPageChange(event: any) {
    // this.first = event.first;
    // this.rows = event.rows;
  //console.log(event);
    this.show = this.productItems.slice(event.first, this.rows + event.first);
  }
  getlists() {
    this._aut.get(`v3/api/lists/${this.storeId}/store`).subscribe({
      next: (response) => {
        this.resList = response;
        this.lists = this.resList.data;
        console.log(this.lists,'this.lists');
        //this.listsLength.emit(this.lists.length);
        this.fav.listsLength.next(this.lists?.length);
      },
    });
  }
  controlOnChange(e: Event | any) {
    //const id: FormArray = this.AddItemTOListform.get('id') as FormArray;
    this.selectedCheckBoxList=[];
    if (e.target.checked) {
      //console.log(e.target.checked);
      //id.push(new FormControl(e.target.value));
      this.selectedCheckBoxList.push(e.target.value);
      console.log(this.selectedCheckBoxList,'this.selectedCheckBoxList');
    } 
    else {
  const index = this.selectedCheckBoxList.indexOf(e.target.value);
  if (index > -1) {
    this.selectedCheckBoxList.splice(index, 1);
  }
  console.log(this.selectedCheckBoxList, 'Updated selectedCheckBoxList after unchecking');
}
    // else {
    //   //const index = id.controls.findIndex((id) => id.value === e.target.value);
    //   //id.removeAt(index);
    // }
    // // console.log(this.AddItemTOListform.value, 'formvalue');
    // // console.log(this.selectedCheckBoxList);
  }
  onSubmit() {
    //console.log(this.ProID, 'this.ProID');
    this.selectedCheckBoxList.forEach((id: any) => {
      this._aut
      
        .get(`v3/api/lists/${id}/product/${this.ProID}`)
        .subscribe({
          next: (response) => {
            
            this._toast.add({
              severity: 'success',
              summary: this.translate.instant('success'),
              detail: this.translate.instant('ProductAddsuccessfully'),
            });
            
            this.getlists();
            this.showAddItemToListDiolog = false;
          },
          error: (error) => {
            if (error.status === 422)
              this._toast.add({
                severity: 'success',
                summary: this.translate.instant('error'),
                detail: this.translate.instant('retryagain'),
              });
              
           // console.log(error);
          },
        });
    });
  }
  onAddListSubmit() {

    this._aut.post('v3/api/lists', this.AddListForm.value, false).subscribe({
      next: (response) => {
        this._toast.add({
          severity: 'success',
          summary: this.translate.instant('success'),
          detail: this.translate.instant('listaddedsuccessfully'),
        });
       
        this.getlists();
        this.showAddListDiolog = false;

        //  this.AddListForm.controls.name.setValue('');
      },
      error: (error) => {
        if (error.status === 422)
          this._toast.add({
            severity: 'success',
            summary: this.translate.instant('error'),
            detail: this.translate.instant('retryagain'),
          });
         
      },
    });
  }
}
