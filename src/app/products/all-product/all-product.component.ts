import { DOCUMENT } from '@angular/common';
import { Parser } from '@angular/compiler';
import { Component, EventEmitter, Inject, Output,HostListener, ChangeDetectorRef } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SliderChangeEvent, SliderSlideEndEvent } from 'primeng/slider';
import { filter } from 'rxjs';
import { utils } from '../../shared/utils/utils';
import { AuthService } from '../../shared/services/auth.service';
import { HomeserviceService } from '../../home/homeservice.service';
import { FavoriteService } from '../../favorities/favorite.service';
import { ProductService } from '../../shared/services/product.service';
import { ResponsiveService } from '../../shared/services/responsive.service';
import { PageEvent } from '../../shared/models/PageEvent';
import { SettingsService } from '../../shared/services/settings.service';
// import { FavoriteService } from 'src/app/favoritenew/favorite.service';
// import { HomeserviceService } from 'src/app/home/homeservice.service';
// import { PageEvent } from 'src/app/shared/models/PageEvent';
// import { AuthService } from 'src/app/shared/services/auth.service';
// import { LoadingService } from 'src/app/shared/services/loading.service';
// import { ProductService } from 'src/app/shared/services/product.service';
// import { ResponsiveService } from 'src/app/shared/services/responsive.service';

// import { utils } from 'src/app/shared/utils/utils';
interface Ioptioncontrols {
  [index: string]: boolean;
}
interface Iitem {
  description: string;
  icon: string;
  id: number;
  image: string;
  name: string;
}
interface filter {
  name: string;
  value: string;
  // id: number;
}
@Component({
  selector: 'app-all-product',
  templateUrl: './all-product.component.html',
  styleUrls: ['./all-product.component.scss'],
  standalone:false
})
export class AllProductComponent {
  baseLinkUrl: string = utils.baseLinkUrl;
  constValue!: number;
  sizearray: string[] = [];
  rangeValues: number[] = [0, 0];
  range1!: number;
  range2!: number;
  minvalueRating: number = 0;
  maxvalueRating:number=100;
  value: string | undefined;
  nodes: any[] = [];
  nodesBrands: any[] = [];
  isLoadingProduct:boolean=true;
  meta: any;
  allData: any;
  Colors: any;
  Sizes: any;
  selectedBrand: any;
  option: Ioptioncontrols = {};
  CatObj: any;
  res: any;
  Brands: any;
  openMinus: boolean = false;
  StopWork:boolean=false
 // AddItemTOListform: FormGroup;
  selectedCategry: any = [];
  selectedCheckBoxList: any = [];
  filter: filter[] | undefined;
  page: number = 1;
  rows: number = 150;
  rowsTemp=15;
  pageTemp=1;
  show: any = [];
  len: any;
  storeId:any;
  ProductLength!: number;
  selectedfilter: string = '';
  optioncat: Ioptioncontrols = {};
 
  FilterSearch: boolean = false;
  searchvalue= this.activatedRoute.snapshot.paramMap.get('name');
  firstpro=0;
  Brandsfilter:any=[];
  Categoryfilter:any[]=[];
  colorsfilter:any=[];
  sizesfilter:any=[];
  products: any = [];
  showProducts:any=[];
  categoryID = this.activatedRoute.snapshot.paramMap.get('id');
  constructor(
    @Inject(DOCUMENT) private dom: Document,
    public _aut: AuthService,
    private activatedRoute: ActivatedRoute,
    public fav: FavoriteService,
    private translate: TranslateService,
    public _productSer:ProductService,
    private _setting:SettingsService,
    private router: Router,
    private _ResponsiveService:ResponsiveService,private _changes: ChangeDetectorRef
   
  ) {
     // this._productSer.SetCategoryID(Number(this.categoryID));
  //     this._productSer.CategoryID$.subscribe({next: (res) => {
  //     this.getProduct();
  // },
  // error: (err) => {
  //       console.log(err);
  // },})
  }
  
  
 
  ngOnInit() {
    this._setting.loadSettings().subscribe(data => {

      this.storeId = data.storeId;

      this.getProduct();
    });
  //    this.activatedRoute.params.subscribe(params => {
  //   //const productId = params['id'];
  //  this.getProduct();
  // });
 this.router.events.subscribe(event => {
    if (event instanceof NavigationEnd) {
      // Reload your data or reinitialize component logic here
       this.getProduct();
    }
  });

    this._ResponsiveService.CategoryStatus(true);
    this._ResponsiveService.isCategory$.subscribe({next: (res) => {
      // this.isResponsive = res;
     },
     error: (err) => {
       console.log(err);
     },} )
    this._aut.getfaviorites(this.storeId);
       this.filter = [
      { name: this.translate.instant('Recommended'), value: '' },
      { name: this.translate.instant('highToLow'), value: 'price_high_to_low' },
      { name: this.translate.instant('lowToHigh'), value: 'price_low_to_high' },
      { name: this.translate.instant('bestSeller'), value: 'best_sellers' },
      { name: this.translate.instant('bestRated'), value: 'best_rated' },
    ];
  }
 
  bulidUrlString():string{
    this.searchvalue= this.activatedRoute.snapshot.paramMap.get('name');
    this.categoryID = this.activatedRoute.snapshot.paramMap.get('id');
   let Baseurl:string=`v3/api/${this.storeId}/products`;
   
    if(this.categoryID!=null&&this.categoryID!= "0"){
 Baseurl+=`?category=${this.categoryID}`;
    } if(this.searchvalue!=null&&this.searchvalue!="0"){
      Baseurl+=`&q=${this.searchvalue}`;
    }
  return Baseurl;
      
  }
onPageChange(event: PageEvent | any) {
    //this.showProducts = this.products.slice(event.first, this.rows + event.first);
    // this.page=event.page + 1; this.categoryID
    this.getProduct(event.page + 1);
}
getProduct(pagenum:number=1) {
  this.isLoadingProduct=true;
 const url=this.bulidUrlString();
  this._aut.get(url).subscribe({
    next: (response) => {
    this.products=response.data.items;
      this.isLoadingProduct=false;
    },
    error: (error) => console.log(error),
  }); 
} 
  
// getProduct(pagenum:number=1) {
//     this.isLoadingProduct=true;
//     this._aut.get(`v3/api/${this.storeId}/products?page=${pagenum}&perPage=20&category=${this._productSer.CategoryID$.getValue()}`).subscribe({
//       next: (response) => {
//       this.products=response.data.items;
//         this.isLoadingProduct=false;
//       },
//       error: (error) => console.log(error),
//     }); 
//   }
onDropdownChange(event: any) {
    this.selectedfilter = event.target.value;
    this.getProduct();
}
ngAfterContentChecked(): void {
  this._changes.detectChanges();
}
 ngOnDestroy() {
    this._ResponsiveService.CategoryStatus(false);
     }
}
