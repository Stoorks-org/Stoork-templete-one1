import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {


  constructor() { }
  calcDiscountPersent(total:any,discount:any):any{
     if(discount==null)return 0;
    if (isNaN(parseFloat(((((total-discount)/total)*100).toFixed(0))))) {
      return 0;
    } else 
    return (((total-discount)/total)*100).toFixed(0);
  }
//   calcDiscountPersent(total: any, discount: any): any {
//   if (discount === null) {
//     return ""; // Return empty string if discount is null
//   }

//   const discountPercentage = (((total - discount) / total) * 100).toFixed(0);

//   return isNaN(parseFloat(discountPercentage)) ? 0 : discountPercentage;
// }
  CategoryID$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  SetCategoryID(num: number): void {
    this.CategoryID$.next(num);
  }
}
