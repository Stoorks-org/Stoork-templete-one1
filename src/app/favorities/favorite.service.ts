import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { LocalStorageService } from '../shared/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  dataProduct: any[] = [];
  lists$: Observable<any[]> | undefined;
  showS: Observable<number> | undefined;
  first$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  //rows$: BehaviorSubject<number> = new BehaviorSubject<number>(5);
  itemsLength: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  listsLength: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  ProductFavorites$: Observable<any[]> | undefined;

  constructor(private localStorageService: LocalStorageService) {
    this.ProductFavorites$ = new Observable<any[]>((observer) => {
      observer.next(this.dataProduct);
      observer.complete();
    });
  }
  setProduct(dataProduct: any[]) {
    this.ProductFavorites$ = of(dataProduct);
  }
  isOfflineFav(){
     const token = this.localStorageService.get('token');
     
     //const token = localStorage.getItem('token');
    
    if (token) { 
      return false;
  }
  else{
    return true;
  }
  
}}
