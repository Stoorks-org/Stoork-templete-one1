import { Component } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { SettingsService } from '../shared/services/settings.service';

@Component({
  selector: 'app-all-category-responsive',
  templateUrl: './all-category-responsive.component.html',
  styleUrl: './all-category-responsive.component.scss'
})
export class AllCategoryResponsiveComponent {
 subcats: any;
  isSliderLoading=true;
  res:any;
  cats:any;
  Parentcats:any;
  FirstCat:any;
  storeId:any;
  constructor(private _auth:AuthService,private _setting:SettingsService,){}
  ngOnInit() {
     this._setting.loadSettings().subscribe(data => {

      this.storeId = data.storeId;

    this.getcategories();
     })
   
  }
getcategories() {
    this.isSliderLoading=true;
    this._auth.get(`v3/api/${this.storeId}/categories`).subscribe({
      next: (response) => {
        this.res = response;
        this.Parentcats = this.res.data;
        //this.FirstCat=this.Parentcats[0];
console.log(this.FirstCat,'this.FirstCat this.FirstCat this.FirstCat');
        //this.getSubCategory(this.FirstCat.id);
        
        this.isSliderLoading=false;
        },
      error: (error) => console.log(error),
    });
  }
// getSubCategory(id:any){
//     this.isSliderLoading=true;
//     this.categoryservice.GetSubCategory(id).subscribe({
//       next: (response) => {
//         this.res = response;
//         this.cats=this.res.data.children;
//          this.isSliderLoading=false;
//         },
//       error: (error) => console.log(error),
//     });
   
//   }
  handleSelectedId(id: Event | any) {
    //this.getSubCategory(id);
  }
}