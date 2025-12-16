import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { FavoriteService } from '../../favorities/favorite.service';
import { CartService } from '../../cart/cart.service';
import { SettingsService } from './settings.service';
import { LocalStorageService } from './local-storage.service';
// import { AccountService } from 'src/app/account/account.service';
// import { CartService } from 'src/app/add-to-cart/cart.service';
// import { FavoriteService } from 'src/app/favoritenew/favorite.service';
// import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // _______________properties______________
  // _______________________________________
  // v17
  productItems: any;
  cart: any;
  res: any;
  api: string = environment.apiUrl;
  NoSizeID = 6;
  storeId: any;
  lang: BehaviorSubject<string> = new BehaviorSubject<string>('en');
  isValueEn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  // _______________________________________
  // _______________properties______________

  constructor(
    private _http: HttpClient,
    private _router: Router,
    private fav: FavoriteService,
    private toast: MessageService,
    private localStorageService: LocalStorageService,
    //private acc: AuthService,
    private cartSer: CartService,
    private translate: TranslateService,
    private _setting: SettingsService
  ) {
    this._setting.loadSettings().subscribe(data => {

      this.storeId = data.storeId;

    });
  }

  // *___________________________ [ inGlobal ]___________________________
  // ?___________________________________________________________________
  ngOnInit(): void {
    this._setting.loadSettings().subscribe(data => {

      this.storeId = data.storeId;

    });

  }
  getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${this.getToken()}`,
    });
  }

  getFileheaders(): HttpHeaders {
    return new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      // 'Content-Type': 'Multipart/form-data',
      Authorization: `Bearer ${this.getToken()}`,
    });
  }

  getOpition(file: boolean = false) {
    if (file) {
      return { headers: this.getFileheaders() };
    }
    return { headers: this.getHeaders() };
  }

  getToken(): string {
    //return localStorage.getItem('token') || '';
    return this.localStorageService.get('token') || '';
  }

  // *___________________________ [ methods ]___________________________
  // ?__________________________________________________________________

  get(url: string, option: boolean = false): Observable<any> {
    return this._http.get(`${this.api}/${url}`, this.getOpition(false));
  }

  post(url: string, data: {}, option: boolean = false): Observable<any> {
    return this._http.post(`${this.api}/${url}`, data, this.getOpition(false));
  }

  postfile(url: string, data: FormData): Observable<any> {
    return this._http.post<any>(
      `${this.api}/${url}`,
      data,
      this.getOpition(true)
    );
  }

  put(url: string, data: {}, option: boolean = false): Observable<any> {
    return this._http.put(`${this.api}/${url}`, data, this.getOpition(false));
  }
  patch(url: string, data: {}, option: boolean = false): Observable<any> {
    return this._http.patch(`${this.api}/${url}`, data, this.getOpition(false));
  }
  putFile(url: string, data: FormData): Observable<any> {
    // return this._http.post(`${this.api}/${url}`, data, this.getOpition(true));
    return this._http.put(`${this.api}/${url}`, data, this.getOpition(true));
  }

  delete(url: string, option: boolean = false): Observable<any> {
    return this._http.delete(`${this.api}/${url}`, this.getOpition(false));
  }
  deleteBody(url: string, body: any, option: boolean = false): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const options = {
      body: body,
      ...this.getOpition(option),
    };

    return this._http.delete(`${this.api}/${url}`, options);
  }
  getsum(num1: number, num2: number): number {
    return num1 + num2;
  }
  getfavioritesAPI(storeId: any) {
    this.get(`v3/api/favorite/${storeId}/store`).subscribe({
      next: (response) => {
        //this.isFavProductsLoading=false;
        this.res = response;
        this.productItems = this.res.favorites;
        this.productItems = this.productItems.map((item: any) => ({
          product_id: item.product.id,
          imageUrl: this.productImage(item.product.images),
          price: item.product.price,
          discount_price: item.product?.discount_price ? item.product?.discount_price : 0,
          proName: item.product.name,
          description: item.product.description,
          stock: +item.product.count ? item.product.count : 0,
        }));
        console.log(this.productItems, 'this.productItems faviorites ');
        //this.itemsLength.emit(this.productItems.length);
        this.fav.itemsLength.next(this.productItems.length);
        if (this.productItems?.length > 0) {
          this.fav.ProductFavorites$ = of(this.productItems);
          this.fav.itemsLength.next(this.productItems.length);
        }
        //this.show = this.productItems.slice(this.first, this.rows);
        //console.log(this.show, 'this.productItems from fav');
      },
    });
  }
  getfavioritesLocal() {
    const favioriteData = this.localStorageService.get('favorite');
    console.log(favioriteData, 'faviorites getfavioritesLocal');
    if (favioriteData) {
      const faviorites = JSON.parse(favioriteData) ? JSON.parse(favioriteData) : [];


      if (faviorites) {

        this.productItems = faviorites.map((item: any) => ({
          product_id: item.product_id,
          imageUrl: item.imageUrl,
          price: item.price,
          discount_price: item.discount_price,
          proName: item.proName,
          description: item.description,
          stock: item.stock ? item.stock : 0,
        }));

        this.fav.ProductFavorites$ = of(this.productItems);
        this.fav.itemsLength.next(this.productItems.length);

        this.fav.itemsLength.next(this.productItems.length);
        //this.show = this.productItems.slice(this.first, this.rows);

      }
    }
  }
  getfaviorites(storeId: any) {
    const token = this.localStorageService.get('token');
    if (token) { this.getfavioritesAPI(storeId); }
    else { this.getfavioritesLocal(); }
  }
  addProductToFavoritesAPI(productId: number | any) {
   //alert(productId);
    const obj = {
      "product_id": productId
    }
    this.post(`v3/api/${this.storeId}/favorites`, obj).subscribe({
      next: (response) => {
        if (response)
          this.toast.add({
            severity: 'success',
            summary: this.translate.instant('success'),
            detail: this.translate.instant('productaddtofavoritesListSuccessfully'),
          });
        this.getfaviorites(this.storeId);
      },
      error: (error) => {
        if (error.status === 401)
          this.toast.add({
            severity: 'error',
            summary: this.translate.instant('error'),
            detail: this.translate.instant('YouMustRegisterFirst'),
          });
      },
    });
  }
  addProductToFavoriteslocal(product: any) {
    console.log(product, 'product for Favorites ');
    const favoriteModel = {
      product_id: product.id,
      imageUrl: product.images != undefined ? this.productImage(product.images) : product?.imageUrl,
      price: product.price,
      discount_price: product.discount_price ? product.discount_price : 0,
      proName: product.name,
      description: product.description,
      stock: product.count ? product.count : 0
    }
    const favorite = this.localStorageService.get('favorite');
    if (favorite) {
      const favorites = JSON.parse(favorite);
       const alreadyExists = favorites.some((item: any) => item.product_id === favoriteModel.product_id);

  if (!alreadyExists) {

      favorites.push(favoriteModel);
      this.localStorageService.remove('favorite');
      this.localStorageService.set('favorite', JSON.stringify(favorites));
      this.toast.add({
        severity: 'success',
        summary: this.translate.instant('success'),
        detail: this.translate.instant('productaddtofavoritesListSuccessfully'),
      });
    }}
    else {
      const favorites = [];
      favorites.push(favoriteModel);
      this.localStorageService.set('favorite', JSON.stringify(favorites));
    }
    this.getfaviorites(this.storeId);
  }
  addProductToFavorites(product: any, cartPro = false) {
    const token = this.localStorageService.get('token');
    if (token) {
      if (cartPro) {
        this.addProductToFavoritesAPI(product.product_id)
      }
      else {
        this.addProductToFavoritesAPI(product?.id)
      }
    }
    else {
      if (cartPro) {
        product.id = product.product_id;
        this.addProductToFavoriteslocal(product);
      }
      else {
        this.addProductToFavoriteslocal(product);
      }
    }
  }
  DeleteProductFromFavorites(product_id: any) {
    //alert(product_id);
    const token = this.localStorageService.get('token');
    if (token) { this.DeleteProductFromFavoritesAPI(product_id); }
    else { this.DeleteProductFromFavoritesLocal(product_id); }

    // this.delete(`v3/api/favorite/${ID}`).subscribe({
    //   next: (response) => {
    //     this.toast.add({
    //       severity: 'success',
    //       summary: this.translate.instant('success'),
    //       detail: this.translate.instant('productdeletefromfavoritesListSuccessfully'),
    //     });
    //     this.getfaviorites(this.storeId);
    //   },
    //   error: (err) => {
    //     this.toast.add({
    //       severity: 'error',
    //       summary: this.translate.instant('error'),
    //       detail: this.translate.instant('errorTryAgain'),
    //     });
    //   },
    // });
  }
  DeleteProductFromFavoritesAPI(product_id: any) {
    this.delete(`v3/api/favorite/product/${product_id}`).subscribe({
      next: (response) => {
        this.toast.add({
          severity: 'success',
          summary: this.translate.instant('success'),
          detail: this.translate.instant('productdeletefromfavoritesListSuccessfully'),
        });
        this.getfaviorites(this.storeId);
      },
      error: (err) => {
        this.toast.add({
          severity: 'error',
          summary: this.translate.instant('error'),
          detail: this.translate.instant('errorTryAgain'),
        });
      },
    });
  }
  DeleteProductFromFavoritesLocal(product_id: any) {
    // alert(product_id);
    const favioriteData = this.localStorageService.get('favorite');
    //alert(favioriteData);
    //console.log(favioriteData,'faviorites getfavioritesLocal');
    let faviorites = JSON.parse(favioriteData) ? JSON.parse(favioriteData) : [];
    if (faviorites) {
      const foundProductIndex = faviorites.findIndex((product: any) => product.product_id === product_id);
      if (foundProductIndex !== -1) {
        // Remove the found product from the array
        faviorites = faviorites.filter((product: any, index: any) => index !== foundProductIndex);
        this.localStorageService.remove('favorite');
        this.localStorageService.set('favorite', JSON.stringify(faviorites));
        // localStorage.removeItem('cart');
        // localStorage.setItem('cart', JSON.stringify(this.cart));
        this.getfavioritesLocal();
      }
    }
  }
 

  // getCartnumber() {
  //   this.get(`v3/api/store/${this.storeId}/carts`).subscribe({
  //     next: (response) => {
  //       this.res = response;
  //       this.cart = this.res?.data;
  //       this.cartSer.SetCartCount(this.cart.length);

  //       console.log(this.cart, 'this.cart');
  //     },
  //     error: (error) => this.cartSer.SetCartCount(0,0),
  //   });
  // }
  getPrice(num: number | string): number {
    let price: number = 0;
    if (typeof num == 'string') {
      price = Math.ceil(parseInt(num));
      return price;
    }

    return Math.ceil(num);
  }
  productImage(images: any): string {

    if (!images?.length) {

      return '';
    }

    const main: any | undefined = images.find(
      (image: any) => {
        return image?.is_default == 1;
      }
    );
    //  thumbnail_path
    if (!main) {

      return images[0]?.url;
    }

    return main.url;
  }

  reload() {
    let currentRout = this._router.url;
    console.log(currentRout);
    this._router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this._router.navigate([currentRout]);
    });
  }
  updateUserByFavorities(storeId: any) {

    //const token = this.localStorageService.get('token');
    const faviorites = this.localStorageService.get('favorite');
    if (faviorites) {
      const faviorite = JSON.parse(faviorites);
      const favModelsArray = faviorite.map((item: any) => ({
        product_id: item.product_id
      }))
      this.post(`v4/api/store/${storeId}/favorites`, { favorites: favModelsArray }).subscribe({
        next: (response) => {
          console.log(response);
          this.localStorageService.remove("favorite");
        },
        error: (error) => {
          console.log(error);
        },
      });
    }
  }
}
