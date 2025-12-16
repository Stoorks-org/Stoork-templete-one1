import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { FavoriteService } from '../../favorite.service';
import { ResponsiveService } from '../../../shared/services/responsive.service';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import Swal from 'sweetalert2';
import { MessageService } from 'primeng/api';
import { SettingsService } from '../../../shared/services/settings.service';
import { LocalStorageService } from '../../../shared/services/local-storage.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.scss'
})
export class ListsComponent {
  isResponsive:boolean=true;
  isFavProductsLoading=true;
  showOpition=false;
  showAddListDiolog=false;
  AddItemTOListform: FormGroup;
  constructor(
   // private homeser: HomeserviceService,
    private _toast: MessageService,
    public _aut: AuthService,
    private formBuilder: FormBuilder,
    public fav: FavoriteService,
    //public _productSer:ProductService,
    private _ResponsiveService:ResponsiveService,
    private translate:TranslateService,
    private _setting:SettingsService,
     private localStorageService: LocalStorageService,
  ) {
    this.AddItemTOListform = this.formBuilder.group({
      id: this.formBuilder.array([], [Validators.required]),
    });
  }
  ngOnInit() {
    this._setting.loadSettings().subscribe(data => {

      this.storeId = data.storeId;
      this.getlists();
      this.getfaviorites();
      // this.fav.itemsLength.subscribe();
      this.fav.lists$?.subscribe();
    });
    this._ResponsiveService.FavoriteStatus(true);
   this._ResponsiveService.isFavorites$.subscribe({
    next: (res) => {
      this.isResponsive = res;
    },
    error: (err) => {
      console.log(err);
    },} )
   
    //this.openProduct = false;
    // console.log(this.openProduct, ' ngOnInit()');
  }
  // @Output() listsLength = new EventEmitter<any>();
  // @Input() lists: any;
  lists: any = [];
  ListID: any;
  resList: any;
  res: any;
  listByID: any;
  show: any;
  listByIDvalue: boolean = true;
  showRenameListDiolog: boolean = false;
  first: number = 0;
  rows: number = 5;
  res4: any;
  selectedCheckBoxList: any = [];
  showAddItemToListDiolog=false;
  //lists$: Observable<any[]> | undefined;
  openProduct: boolean = false;
  // openList: boolean = true;
  productItemslist: any = [];
  ProID:any;
  product_variant_id:any;
  productItems: any;
  storeId:any;
  AddListForm = new FormGroup({
    name: new FormControl('', Validators.required),
  });
  OpenItemList(e: Event) {
    var target = e.target || e.currentTarget;
    this.ListID = (e.target as Element).id;
    this.openProduct = true;
    this.getListByID();
   // console.log(this.openProduct, 'OpenItemList');
  }

  RenameList(e: Event) {
    var target = e.target || e.currentTarget;
    this.ListID = (e.target as Element).id;
    // console.log(this.ListID, 'this.ListID');
    this.showRenameListDiologe();
  }
  DeleteListOpen(e: Event) {
    var target = e.target || e.currentTarget;
    this.ListID = (e.target as Element).id;
    this.DeleteList(this.ListID);
    this.getListByID();
  }
  showRenameListDiologe() {
    this.showRenameListDiolog = !this.showRenameListDiolog;
  }
  DeleteList(ID: number) {
    Swal.fire({
      title:this.translate.instant('Areyousure?'),
      text: this.translate.instant('Youwontbeabletorevertthis!'),
      icon: "warning",
      showCancelButton: true,
      cancelButtonText:this.translate.instant('cancel'),
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: this.translate.instant('Yesdeleteit!'),
    }).then((result) => {
      if (result.isConfirmed) {
    this.showOpition=false;
    this._aut.delete('v3/api/lists/' + ID, false).subscribe({
      next: (response) => {
        this._toast.add({
          severity: 'success',
          summary: this.translate.instant('success'),
          detail: this.translate.instant('listDeletesuccessfully'),
        });
       
        this.ListID = ID;
        this.getlists();
        //this.getListByID();
      },
      error: (err) => {
        this._toast.add({
          severity: 'error',
          summary: this.translate.instant('error'),
          detail: err.message,
        });
       
      },
    });
  }})}
  
  // GetAllListProduct() {
  //   // this.fav.GetAllListProduct(this.ListID)
  //   this._aut.get('api/v1/list/' + this.ListID + '/items', false).subscribe({
  //     next: (response) => {
  //       this.res4 = response;
  //       // console.log(this.res4, 'res4');
  //       this.productItemslist = this.res4.data;
  //       // console.log(this.productItemslist, 'productItemslist');
  //     },
  //     error: (err) => {
  //       console.log(err.message);
  //     },
  //   });
  // }
  getListByID() {
    this._aut.get('v3/api/lists/' + this.ListID).subscribe({
      next: (response) => {
       
        this.res = response;
        this.listByID = this.res.data;
        console.log(this.listByID,'this.listByID this.listByID');
        this.listByIDvalue = true;
      },
      error: (error) => {
        this.listByIDvalue = false;
      },
    });
  }
  getlists() {
    this._aut.get(`v3/api/lists/${this.storeId}/store`, false).subscribe({
      next: (response) => {
        this.resList = response;
        this.lists = this.resList.data;
        this.fav.lists$ = of(this.lists);
        this.fav.listsLength.next(this.lists?.length);
        // this.listsLength.emit(this.lists.length);
        // this.show = this.lists.slice(this.first, this.rows);
        // this.fav.lists$ = of(this.show);
        console.log(this.lists, 'lists');
      },
    });
  }
  // getfaviorites() {
  //   if (!this.ListID) {
  //     this._aut.get('api/v1/favorites', false).subscribe({
  //       next: (response) => {
  //         this.res = response;
  //         this.productItems = this.res.data;
  //         this.isFavProductsLoading=false;
  //         //console.log(this.productItems,'this.productItems');
  //         //this.itemsLength.emit(this.productItems.length);
  //         this.fav.itemsLength.next(this.productItems.length);
  //         //this.show = this.productItems.slice(this.first, this.rows);
  //       },
  //     });
     
  //   }
  // }
  handleSelectedId(event:any){
    
    this.ListID=event;
    this.getfaviorites();
  }
  handleSelectedIdAll(event:any){
   
    this.ListID=undefined;
    this.getfaviorites();
  }
   getfavioritesAPI(){
 this._aut.get(`v3/api/favorite/${this.storeId}/store`).subscribe({
        next: (response) => {
          this.isFavProductsLoading=false;
          this.res = response;
          this.productItems = this.res.favorites;
        //   this.productItems = this.productItems.map((item: any) => ({
        //     id:item.id,
        //     product_id: item.product.id,
        //     imageUrl: this._aut.productImage(item.product.images) ,
        //     price: item.product.price,
        //     discount_price:item.product?.discount_price?item.product?.discount_price:0,
        //     proName: item.product.name,
        //     description: item.product.description,
        //     stock:+item.product.count?item.product.count:0,
        // }));
          console.log(this.productItems, 'this.productItems faviorites ');
          //this.itemsLength.emit(this.productItems.length);
          this.fav.itemsLength.next(this.productItems.length);
          this.show = this.productItems.slice(this.first, this.rows);
          console.log(this.show, 'this.productItems from fav');
        },
      });
  }
  getfavioritesLocal(){
    const favioriteData = this.localStorageService.get('favorite');
    console.log(favioriteData,'faviorites getfavioritesLocal');
    const faviorites =JSON.parse(favioriteData)?JSON.parse(favioriteData) : [];

       
      if (faviorites) {
       
       this.productItems = faviorites.map((item: any) => ({
            product_id: item.product_id,
            imageUrl:item.imageUrl,
            price: item.price,
            discount_price:item.discount_price,
            proName: item.proName,
            description: item.description,
            stock:item.stock?item.stock:0,
        }));
        this.fav.itemsLength.next(this.productItems.length);
          this.show = this.productItems.slice(this.first, this.rows);
  }}
  // getfaviorites() {
  //   this.isFavProductsLoading=true;
  //   if (!this.ListID) {
  //     const token = this.localStorageService.get('token');
  //     if(token) {this.getfavioritesAPI();}
  //     else{this.getfavioritesLocal();}
     
  //     // if (this.ListID != 0)
  //   } 
  //   else {
  //     this._aut.get(`v3/api/lists/${this.storeId}/store`, false).subscribe({
  //       next: (response) => {
  //         this.res4 = response;
  //         //console.log(this.res4, 'res4');
  //         this.productItems = this.res4.data;

  //         this.show = this.productItems.slice(this.first, this.rows);
  //         // console.log(this.productItems, 'else');
  //       },
  //       error: (err) => {
  //         console.log(err.message);
  //       },
  //     });
  //   }
  // }
  getfaviorites() {
    this.isFavProductsLoading=true;
    if (!this.ListID) {
      this._aut.get(`v3/api/favorite/${this.storeId}/store`, false).subscribe({
        next: (response) => {
          this.isFavProductsLoading=false;
          this.res = response;
          this.productItems = this.res.favorites;
          // this.productItems?.forEach((ele: { current_variant: { sizes: any[]; }; }) => {
          //   //console.log(ele.current_variant.sizes.sort((a:any, b:any) => a.price?.discount_price - b.price?.discount_price),'ele')
          //   ele.current_variant?.sizes?.sort((a:any, b:any) => a.price?.discount_price - b.price?.discount_price);
          // });
          //console.log(this.productItems, 'this.productItems');
          //this.itemsLength.emit(this.productItems.length);
          this.fav.itemsLength.next(this.productItems.length);
          this.show = this.productItems.slice(this.first, this.rows);
          console.log(this.show, 'this.productItems from fav');
        },
      });
      // if (this.ListID != 0)
    } else {
      this._aut.get('v3/api/lists/' + this.ListID, false).subscribe({
        next: (response) => {
          this.res4 = response;
          //console.log(this.res4, 'res4');
          this.productItems = this.res4.product_list;
          this.isFavProductsLoading=false;
          this.show = this.productItems.slice(this.first, this.rows);
          
           console.log(this.productItems, 'else');
        },
        error: (err) => {
          console.log(err.message);
        },
      });
    }
  }
  onPageChange(event: any) {
    this.fav.first$.next(event.first);
    this.fav.first$.subscribe();

    // this.show = this.lists.slice(event.first, this.rows + event.first);
    // console.log();
    // this.fav.lists$ = of(this.show);
  }
  onSubmitRenameList() {
    this._aut
      .put('v3/api/lists/' + this.ListID, this.AddListForm.value, false)
      .subscribe({
        next: (response) => {
          this._toast.add({
            severity: 'success',
            summary: this.translate.instant('success'),
            detail: this.translate.instant('listrenamesuccessfully'),
          });
         
          this.getlists();
          this.getListByID();
          this.showRenameListDiologe();
        },
        error: (error) => {
          if (error.status === 422)
            this._toast.add({
              severity: 'error',
              summary: this.translate.instant('error'),
              detail: this.translate.instant('retryagain'),
            });
           
        },
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
            severity: 'error',
            summary: this.translate.instant('error'),
            detail: this.translate.instant('retryagain'),
          });
         
      },
    });
  }
  showRename(){
    this.showRenameListDiolog=true;
    this.showOpition=false;
  }
  controlOnChange(e: Event | any) {
    const id: FormArray = this.AddItemTOListform.get('id') as FormArray;

    if (e.target.checked) {
      //console.log(e.target.checked);
      id.push(new FormControl(e.target.value));
      this.selectedCheckBoxList.push(e.target.value);
    } else {
      const index = id.controls.findIndex((id) => id.value === e.target.value);
      id.removeAt(index);
    }
    // console.log(this.AddItemTOListform.value, 'formvalue');
    // console.log(this.selectedCheckBoxList);
  }
  onSubmit() {
    //console.log(this.ProID, 'this.ProID');
    this.selectedCheckBoxList.forEach((id: any) => {
      this._aut
        .post(`v3/api/lists/${id}/product/${this.ProID}`, false)
        .subscribe({
          next: (response) => {
            this._toast.add({
              severity: 'success',
              summary: this.translate.instant('success'),
              detail: this.translate.instant('productaddedsuccessfully'),
            });
          
            this.getlists();
            this.showAddItemToListDiolog = false;
          },
          error: (error) => {
            if (error.status === 422)
              this._toast.add({
                severity: 'error',
                summary: this.translate.instant('error'),
                detail: this.translate.instant('retryagain'),
              });
            //  this.homeser.showmessage(this.translate.instant('retryagain'), 'error');
           // console.log(error);
          },
        });
    });
  }
  AddItemToList(ProId:any){
this.ProID=ProId;
//this.product_variant_id=current_variantId;
this.showAddItemToListDiolog=true;
  }
}
