import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { FavoriteService } from '../favorite.service';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { SettingsService } from '../../shared/services/settings.service';

@Component({
  selector: 'app-open-list',
  templateUrl: './open-list.component.html',
  styleUrl: './open-list.component.scss'
})
export class OpenListComponent {
  res: any;
  listByID: any;
  showRenameListDiolog: boolean = false;
  resList: any;
  lists: any;
  productItemslist: any;
  res4: any;
  show: any;
  first: number = 0;
  rows: number = 5;
  listByIDvalue: boolean = true;
  ListID = this.activatedRoute.snapshot.paramMap.get('id');
  ProID: any;
  showAddListDiolog: boolean = false;
  showAddItemToListDiolog: boolean = false;
  AddItemTOListform: FormGroup;
  selectedCheckBoxList: any = [];
  AddListForm = new FormGroup({
    name: new FormControl('', Validators.required),
  });
  storeId:any;
  constructor(
    public _aut: AuthService,
    private _toast:MessageService,
    private activatedRoute: ActivatedRoute,
    private fav: FavoriteService,
    private formBuilder: FormBuilder,
    private _setting:SettingsService,
    private translate:TranslateService
  ) {
    this.AddItemTOListform = this.formBuilder.group({
      id: this.formBuilder.array([], [Validators.required]),
    });
  }
  onPageChange(event:any) {
    // this.first = event.first;
    // this.rows = event.rows;
   // console.log(event);
    this.show = this.productItemslist.slice(
      event.first,
      this.rows + event.first
    );
  }
  ngOnInit() {
    this._setting.loadSettings().subscribe(data => {
      this.storeId = data.storeId;
      this.getListByID();
    });
   
    //this.GetAllListProduct();
  }
  // onSubmit() {
  //   //console.log(this.ProID, 'this.ProID');
  //   this.selectedCheckBoxList.forEach((id: any) => {
  //     this._aut
  //       .post('api/v1/list/' + id + '/items', { product_id: this.ProID }, false)
  //       .subscribe({
  //         next: (response) => {
  //           this._toast.add({
  //             severity: 'success',
  //             summary: this.translate.instant('success'),
  //             detail: this.translate.instant('productaddedsuccessfully'),
  //           });
            
  //           this.getlists();
  //           this.showAddItemToListDiolog = false;
  //         },
  //         error: (error) => {
  //           if (error.status === 422)
  //             this._toast.add({
  //               severity: 'error',
  //               summary: this.translate.instant('error'),
  //               detail:this.translate.instant('retryagain'),
  //             });
              
  //           console.log(error);
  //         },
  //       });
  //   });
  // }
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
  // onAddListSubmit() {
  //   this._aut.post('api/v1/lists', this.AddListForm.value, false).subscribe({
  //     next: (response) => {
  //       this._toast.add({
  //         severity: 'success',
  //         summary: this.translate.instant('success'),
  //         detail: this.translate.instant('listaddedsuccessfully'),
  //       });
       
  //       this.getlists();
  //       this.showAddListDiolog = false;

  //       //  this.AddListForm.controls.name.setValue('');
  //     },
  //     error: (error) => {
  //       if (error.status === 422)
  //         this._toast.add({
  //           severity: 'error',
  //           summary: this.translate.instant('error'),
  //           detail:this.translate.instant('retryagain'),
  //         });
          
  //     },
  //   });
  // }
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
  AddItemList(e: Event) {
    var target = e.target || e.currentTarget;
    this.ProID = (e.target as Element).id;
    this.showAddItemToListDiolog = true;
    // console.log(this.ProID, 'proidevent');
  }
  // onSubmitRenameList() {
  //   this._aut
  //     .put('api/v1/lists/' + this.ListID, this.AddListForm.value, false)
  //     .subscribe({
  //       next: (response) => {
  //         this._toast.add({
  //           severity: 'success',
  //           summary: this.translate.instant('success'),
  //           detail: this.translate.instant('listrenamesuccessfully'),
  //         });
          
  //         this.getlists();
  //         this.getListByID();
  //         this.showRenameListDiologe();
  //       },
  //       error: (error) => {
  //         if (error.status === 422)
  //           this._toast.add({
  //             severity: 'error',
  //             summary: this.translate.instant('error'),
  //             detail:this.translate.instant('retryagain'),
  //           });
  //       },
  //     });
  // }
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
  DeleteProductFromList(ID: number) {
    // console.log(ID, 'ID');
    this._aut.delete(`v3/api/lists/${this.ListID}/product/${ID}`, false).subscribe({
      next: (response) => {
        this._toast.add({
          severity: 'success',
          summary: this.translate.instant('success'),
          detail: this.translate.instant('ProductDeletesuccessfully'),
        });
        this.getListByID();
       // this.GetAllListProduct();
      },
      error: (err) => {
        console.log(err);
        this._toast.add({
          severity: 'error',
          summary: this.translate.instant('error'),
          detail:this.translate.instant('retryagain'),
        });
      },
    });
  }
  // GetAllListProduct() {
  //   // this.fav.GetAllListProduct(this.ListID)
  //   this._aut.get(`v3/api/lists/${this.ListID}`, false).subscribe({
  //     next: (response) => {
  //       this.res4 = response;
       
  //       this.productItemslist = this.res4.data;
  //       this.productItemslist?.forEach((ele: { current_variant: { sizes: any[]; }; }) => {
  //         //console.log(ele.current_variant.sizes.sort((a:any, b:any) => a.price?.discount_price - b.price?.discount_price),'ele')
  //         ele.current_variant?.sizes?.sort((a:any, b:any) => a.price?.discount_price - b.price?.discount_price);
  //       });
  //       this.show = this.productItemslist.slice(this.first, this.rows);console.log(this.show, 'res4');
  //     },
  //     error: (err) => {
  //       console.log(err.message);
  //     },
  //   });
  // }
  getListByID() {
    this._aut.get('v3/api/lists/' + this.ListID, false).subscribe({
      next: (response) => {
        this.res = response;
        this.productItemslist= this.res.product_list;
        this.listByID=this.res;
         this.show = this.productItemslist.slice(this.first, this.rows);
        this.listByIDvalue = true;
         
      },
      error: (error) => {
        this.listByIDvalue = false;
      },
    });
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
    this.DeleteList(parseInt(this.ListID));
    this.getListByID();
  }
  showRenameListDiologe() {
    this.showRenameListDiolog = !this.showRenameListDiolog;
  }
  DeleteList(ID: number) {
    this._aut.delete('v3/api/lists/' + ID, false).subscribe({
      next: (response) => {
        this._toast.add({
          severity: 'success',
          summary: this.translate.instant('success'),
          detail: this.translate.instant('listDeletesuccessfully'),
        });
        
        this.ListID = ID.toString();
        this.getlists();
        //this.getListByID();
      },
      error: (err) => {
        this._toast.add({
          severity: 'error',
          summary: this.translate.instant('error'),
          detail:err.message,
        });
        
      },
    });
  }
  getlists() {
    this._aut.get(`v3/api/lists/${this.storeId}/store`, false).subscribe({
      next: (response) => {
        this.resList = response;
        this.lists = this.resList.data;
        this.fav.lists$ = of(this.lists);
        // this.listsLength.emit(this.lists.length);
        // this.show = this.lists.slice(this.first, this.rows);
        // this.fav.lists$ = of(this.show);
       // console.log(this.lists, 'lists');
      },
    });
  }
}
