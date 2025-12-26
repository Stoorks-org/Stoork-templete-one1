import { Component, Input } from '@angular/core';
//import { prouct } from 'src/app/shared/models/product/product';
// import { StarRatingComponent } from 'ng-starrating';
import { FormGroup } from '@angular/forms';
import { ProductDetailsService } from '../product-details.service';
//import { PageEvent } from 'src/app/shared/models/PageEvent';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
interface rating {
  rating: number;
  count: number;
  percent: number;
}

@Component({
  selector: 'app-tab-view',
  templateUrl: './tab-view.component.html',
  styleUrls: ['./tab-view.component.scss'],
  standalone:false
})
export class TabViewComponent {
  value!: number;
  formGroup!: FormGroup;
  res: any;
  overview: any;
 
  options: any;
  review: any;
  first: number = 0;
  rows: number = 5;
  ShowReview: any = [];
  rating_info: any;
  rating_info1: any = [];
  rating: any = [];
  ratvalue: number[] = [1, 2, 3, 4, 5];
  related_product: any;
  description:any;
  @Input() proData: any;
 
  rat: rating[] = [];
  constructor(private productDetailsservice: ProductDetailsService,private sanitizer: DomSanitizer) {}
  ngOnInit() {
   // this.getTabData();
    //this.getratingData();
  }
  // sanitizedDescription( des:any): SafeHtml {
    
  //   return this.sanitizer.bypassSecurityTrustHtml(des);

  // }
  // capitalizedLetters(name: string): string {
  //   if (name) {
  //     const words = name.split(' ');
  //     const firstLetters = words
  //       .filter((word) => word.length > 0)
  //       .map((word) => word.charAt(0).toUpperCase());
  //     return firstLetters.join(' ');
  //   }
  //   return '';
  // }
  // onPageChange(event:  any) {
  //   // this.first = event.first;
  //   // this.rows = event.rows;
  //   // console.log(event);
  //   this.ShowReview = this.review.slice(event.first, this.rows + event.first);
  // }
  // getTabData() {
  //   this.productDetailsservice.GetProductDetailsByVarationID(this.proID).subscribe({
  //     next: (response) => {
  //       this.res = response;
  //       this.proData = this.res.data;
  //       this.value = this.proData.rating;
  //       //console.log(this.value, 'value');
  //       this.overview = this.proData.overveiw;
  //       this.options = this.proData.overveiw?.options;
  //      // console.log(this.overview?.description,'this.overview?.description');
  //      // this.description=this.sanitizer.bypassSecurityTrustHtml(this.overview?.description);
  //       this.review = this.proData.review;
  //       this.ShowReview = this.review.slice(this.first, this.rows);
  //       this.rating_info = this.proData.rating_info;
  //       this.related_product = this.proData.related_products;
  //       console.log(this.overview, 'this.options');
  //     },
  //     error: (error) => console.log(error),
  //   });
  // }
  // getratingData() {
  //   this.productDetailsservice.GetProductDetailsByVarationID(this.proID).subscribe({
  //     next: (response) => {
  //       this.res = response;
  //       this.proData = this.res.data;
  //       this.rating_info = this.proData.rating_info;
  //      // console.log(this.res);

  //       const per = this.proData.rating_count;

  //       this.rating_info.forEach((r: any) => {
  //         const percent = parseFloat(((r.count / per) * 100).toFixed(1));

  //         for (const i of this.ratvalue) {
  //           if (i == r.rating)
  //             this.rat.push({
  //               rating: r.rating,
  //               count: r.count,
  //               percent: percent,
  //             });
  //           else {
  //             this.rat.push({
  //               rating: i,
  //               count: 0,
  //               percent: 0,
  //             });
  //           }
  //         }

  //       });

  //       // console.log(this.rating_info1);
  //     },
  //     error: (error) => console.log(error),
  //   });
  // }
}
