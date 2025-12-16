import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResponsiveService {
  private isProductDetails = new BehaviorSubject<boolean>(false);
  isProductDetails$ = this.isProductDetails.asObservable();
  private isFavorites = new BehaviorSubject<boolean>(false);
  isFavorites$ = this.isFavorites.asObservable();
  private isCart = new BehaviorSubject<boolean>(false);
  isCart$ = this.isCart.asObservable();
  private isCategory = new BehaviorSubject<boolean>(false);
  isCategory$ = this.isCategory.asObservable();
   private isAllCategory = new BehaviorSubject<boolean>(false);
   isAllCategory$ = this.isAllCategory.asObservable();
   private isProfile= new BehaviorSubject<boolean>(false);
   isProfile$ = this.isProfile.asObservable();
  //  private isProfile= new BehaviorSubject<boolean>(false);
  //  isProfile$ = this.isProfile.asObservable();
  constructor() { }
  ProfileStatus(status: boolean):void {
    this.isProfile.next(status);
  }
  ProductDetailsStatus(status: boolean): void {
    this.isProductDetails.next(status);
  }
  FavoriteStatus(status: boolean): void {
    this.isFavorites.next(status);
  }
  CartStatus(status: boolean): void {
    this.isCart.next(status);
  }
  CategoryStatus(status: boolean): void {
    this.isCategory.next(status);
  }
  AllCategoryStatus(status: boolean): void {
    this.isAllCategory.next(status);
  }
}
