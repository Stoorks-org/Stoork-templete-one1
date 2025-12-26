import { Component, Input } from '@angular/core';
import { HomeserviceService } from '../homeservice.service';
import { MainCat } from '../../shared/models/categories/main-Category';
import { utils } from '../../shared/utils/utils';
import { brands } from '../../shared/models/brands/brands';
import { environment } from '../../environments/environment';
import { AuthService } from '../../shared/services/auth.service';
//import { MainCat } from 'src/app/shared/models/categories/main-Category';
//import { brands } from 'src/app/shared/models/brands/brands';
//import { utils } from 'src/app/shared/utils/utils';
//import { AuthService } from 'src/app/shared/services/auth.service';
interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}
@Component({
  selector: 'app-catogriespaginator',
  templateUrl: './catogriespaginator.component.html',
  styleUrls: ['./catogriespaginator.component.scss'],
  standalone:false
})
export class CatogriespaginatorComponent {
  cats: MainCat[] | any;
 @Input() categories: any[] = [];
  @Input() isLoadingcategories=true;
  baseLinkUrl: string = environment.apiUrl;
  brands: brands[] = [];
  show: any = [];
  responsiveOptions: any;

  // _____________________________________________________
  // _____________________________________________________
  constructor(private homeService: HomeserviceService,public _auth:AuthService) {
    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 11,
        numScroll: 11,
      },
      {
        breakpoint: '768px',
        numVisible: 5,
        numScroll: 5,
      },
      {
        breakpoint: '560px',
        numVisible: 3,
        numScroll: 3,
      },
    ];
  }

  ngOnInit(): void {}

  // getcategories() {
  //   this.homeService.getall().subscribe({
  //     next: (response) => {
  //       this.cats = response;
  //       this.maincats = this.cats.data.categories;
  //       // this.brands=this.cats.data.brands;
  //       this.show = this.maincats.slice(0, this.rows);
  //     },
  //     error: (error) => console.log(error),
  //   });
  // }

  // onPageChange(event: PageEvent | any) {
  //   console.log(event);
  //   this.show = this.maincats.slice(event.first, this.rows + event.first);
  // }
}
