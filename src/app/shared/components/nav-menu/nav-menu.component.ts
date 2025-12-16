import { ChangeDetectorRef, Component, ElementRef, Input, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { ResponsiveService } from '../../services/responsive.service';
import { ProductService } from '../../services/product.service';
import { SettingsService } from '../../services/settings.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent {
  isResponsive=false;
  isResponsiveFav=false;
  isResponsiveCart=false;
  isMobile: any=false;
  constructor(private _aut: AuthService,
   private cd: ChangeDetectorRef,
  private zone: NgZone,

    private _ResponsiveService:ResponsiveService,
    public _productSer:ProductService, private _setting:SettingsService
  ) {}
  ngOnInit() {
   
  this.isMobile = window.innerWidth <= 768;

  window.addEventListener('resize', () => {
    this.zone.run(() => {
      this.isMobile = window.innerWidth <= 768;
      this.cd.detectChanges(); // علشان Angular يعرف إن فيه تغيير
    });
  });

  //    this.isMobile = window.innerWidth <= 768;
  // window.addEventListener('resize', () => {
  //   this.isMobile = window.innerWidth <= 768;
  // });
    this._setting.loadSettings().subscribe(data => {

      this.storeId = data.storeId;
    this.getAllCats();
    });
 

    this._ResponsiveService.isAllCategory$.subscribe({next: (res) => {
      this.isResponsive = res;
    },
    error: (err) => {
      console.log(err);
    },} )
    this._ResponsiveService.isProfile$.subscribe({next: (res) => {
      this.isResponsive = res;
    },
    error: (err) => {
      console.log(err);
    },} )
this._ResponsiveService.isProductDetails$.subscribe({next: (res) => {
  this.isResponsive = res;
},
error: (err) => {
  console.log(err);
},} )
this._ResponsiveService.isFavorites$.subscribe({next: (res) => {
  this.isResponsiveFav = res;
},
error: (err) => {
  console.log(err);
},} )
this._ResponsiveService.isCart$.subscribe({next: (res) => {
  this.isResponsive = res;
},
error: (err) => {
  console.log(err);
},} )
console.log(this.isResponsive,"this.isResponsiveCart");
    //this.getNavCategory();
  }
  openMegaMenu: string = '';
  res: any;
  SubCat: any;
  showMega:boolean=false;
  brands:any=[];
  obj:any;
  storeId:any;
   NavCategory: any = [];
  private CatID = new BehaviorSubject<number>(0);
  checkCatID$ = this.CatID.asObservable();
  // methods
  openMegaTest(e: Event) {
    this.openMegaMenu = 'show';
    this.showMega=true;
   // console.log(this.showMega);
    var target = e.target || e.currentTarget;
    const ID = (e.target as Element).id;
    this.CatID.next(+ID);

    this.checkCatID$.subscribe();
    //console.log(this.CatID.value,'this.CatID.value');
    // this.getBrandByCategory();
     this.getObject(this.CatID.value);

   
    // (e.target as unknown  as ElementRef).nativeElement.classList.remove('active');
     (e.target as Element).classList.add('activemega');
    // (e.target as unknown  as ElementRef).nativeElement.classList.remove('active');
    // (e.target as unknown  as ElementRef).nativeElement.classList.add('activemega');
   // console.log((e.target as Element).classList,'console.log(targetconsole.log(targetconsole.log(targetconsole.log(target')
    //(e.target as unknown  as ElementRef).nativeElement.classList.remove('active');
    
    //e.target?.nativeElement.classList.remove('active');
    
  }
  closeMegaTest(link: string) {
    this.showMega=false;
    //
   // console.log(link);
    this.openMegaMenu = link;
  }
  StyleLeave(e: Event) {
   (e.target as Element).classList.remove('activemega');
  }
  getObject(id:number|any){
    this.obj = this.NavCategory.filter((obj: any) => {
      return obj.id == id;
    });
    //console.log(this.obj,'this.obj.category?.children');
  }
  getAllCats() {
    let url: string = `v3/api/${this.storeId}/categories`;
    this._aut.get(url).subscribe({
      next: (res) => {
        //this.isLoadingcategories=false;
        this.NavCategory = res.data;
        console.log(this.NavCategory,'this.NavCategory');
      
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  setCategory(CatID:number){
    this._productSer.SetCategoryID(CatID);
  }
}
