import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { cart } from '../models/order/cart';
import { SettingsService } from '../shared/services/settings.service';
import { LocalStorageService } from '../shared/services/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cart: any;
  idSelected: any = [];
  public Shipping: any = 0;
  allAddress: any;
  CartFromToken = true;
  resAddress: any;
  storeId: any;
  private cartDataForcheckout: any[] = [];
  constructor(
    private http: HttpClient,
    private translate: TranslateService,
    private toast: MessageService,
    private _setting: SettingsService,
    private localStorageService: LocalStorageService
  ) {
    this._setting.loadSettings().subscribe((data) => {
      this.storeId = data.storeId;
      //this.getUserCart();
    });
  }
  baseUrl = environment.apiUrl;
  res: any;
  totalCartPrice: number = 0;
  totalCartPriceWithCheckAll: number = 0;
  OrderWithOutRegister: any;
  private isCart = new BehaviorSubject<boolean>(false);
  OrderItems = new BehaviorSubject<string>('');
  checkOrderItems$ = this.OrderItems.asObservable();
  checkCart$ = this.isCart.asObservable();
  public basketSource = new BehaviorSubject<any | null>(null);
  basketSource$ = this.basketSource.asObservable();
  CartStatus(status: boolean): void {
    this.isCart.next(status);
  }
  CartPrice: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  CartCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  SetCartCount(num: number, cartPrice: number): void {
    this.CartCount.next(num);
    this.CartPrice.next(cartPrice);
  }

  getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${this.getToken()}`,
    });
  }
  getOpition() {
    return { headers: this.getHeaders() };
  }
  getToken(): string | null {
    return this.localStorageService.get('token') || '';
    // const token = localStorage.getItem('token');
    //  return token;
  }
  SetOrderItem(orderItem: string) {
    this.OrderItems.next(orderItem);
  }
  productImage(images: any): string {
    if (!images?.length) {
      return '';
    }

    const main: any | undefined = images.find((image: any) => {
      return image?.is_main == 1;
    });
    //  thumbnail_path
    if (!main) {
      return images[0]?.thumbnail_path;
    }
    return main.thumbnail_path;
  }
  getProductCountInCart(productId: number): number {
    const item = this.cart.find((i: any) => i.product_id === productId);
    return item ? item.count : 0;
  }
  calculateTotals(cart: any) {
    if (cart) {
      let total = cart?.reduce(
        (total: any, item: { count: any }) => total + item.count,
        0
      );
      let totalPrice = cart.reduce(
        (sum: number, item: { price: number; count: number }) => {
          return sum + item.price * item.count;
        },
        0
      );

      //  alert(JSON.stringify(this.cart));

      //  alert(total);
      //  alert(totalPrice);
      this.SetCartCount(total, totalPrice);
    } else this.SetCartCount(0, 0);
  }
  getWithBodyParams(url: string, params: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const options = {
      headers: headers,
      body: params,
    };

    return this.http.get(url, options);
  }
  getCart(storeId: any) {
    const token = this.localStorageService.get('token');

    //const token = localStorage.getItem('token');

    if (token) {
      this.http
        .get(this.baseUrl + `/v3/api/store/${storeId}/carts`, {
          headers: this.getHeaders(),
        })
        .subscribe({
          next: (response) => {
            this.res = response;
            this.cart = this.res.data;
            console.log(this.res.data, 'this.res.data to mapped');
            this.cart = this.cart.map((item: any) => ({
              id: item.id,
              product_id: item.product.id,
              count: +item.count,
              imageUrl: this.productImage(item.product.images),
              price:
                item.product.discount_price != null
                  ? item.product.discount_price
                  : item.product.price,
              proName: item.product.name,
              description: item.product.description,
            }));
            this.basketSource.next(this.cart);

            this.totalCartPrice = 0;
            this.totalCartPriceWithCheckAll = 0;
            //this.items=[];
            for (const item of this.cart) {
              this.totalCartPriceWithCheckAll += item.count * item.price;
              if (item.selected) {
                this.totalCartPrice += item.count * item.price;
                this.idSelected.push(item.id);
              }
              console.log(this.res.data, 'this.cart from service');
            }
            this.calculateTotals(this.cart);
          },
          error: (error) => {
            console.log(error, 'errorerror cart');
            this.basketSource.next(null);
          },
        });
    } else {
      this.CartFromToken = false;
      //const Carts = this.localStorageService.get('cart');
      //const Carts =localStorage.getItem('cart');
      const cartData = this.localStorageService.get('cart');

      //const Carts = cartData ? JSON.parse(cartData) : [];
      //const Carts = JSON.parse(JSON.stringify(cartData));

      const Carts = cartData ? (typeof cartData === 'string' && JSON.parse(cartData) !== null ? JSON.parse(cartData) : []) : [];

      if (Carts) {
        // this.cart = JSON.parse(Carts)?JSON.parse(Carts):[];
        console.log(Carts, 'Carts Carts after map ser');
        this.cart = Carts;
        this.cart = this.cart.map((item: any) => ({
          id: 0,

          product_id: item.product_id,
          count: +item.count,
          imageUrl: item.imageUrl,
          price: item.price,
          proName: item.proName,
          description: item.description,
          stock: item.stock ? item.stock : 0,
          selected: true,
          options: item.options,
        }));
        let cartPrice = 0;
        for (const item of this.cart) {
          cartPrice += item.count * item.price;
        }
        //this.basketSource.next(this.cart);
        this.calculateTotals(this.cart);
      }
    }
    console.log(this.cart, 'this.cart from cart id');
  }
  getCurrentBsketValue() {
    return this.basketSource.value;
  }
  addItemToCart(
    product_id: any,
    count: any,
    store_id: any,
    selectedValues: any,
    selectedValueObject: any,
    stock: any,
    imageUrl: string | any,
    proName: string | any,
    description: string | any,
    price: any,
    showHeaderCart?: boolean
  ) {
    const showHeader = showHeaderCart ?? true;

    const cartModel = {
      product_id: product_id,
      count: count,
      store_id: store_id,
      stoork_option_values: selectedValues,
    };

    const token = this.localStorageService.get('token');
    if (token) {
      this.http
        .post(this.baseUrl + '/v3/api/carts', cartModel, {
          headers: this.getHeaders(),
        })
        .subscribe({
          next: (response) => {
            if (showHeader) {
              this.CartStatus(true);
              this.checkCart$.subscribe();
            }
            this.getCart(this.storeId);
          },
          error: (error) => {
            console.log(error);
          },
        });
    } else {
      if (count > stock) {
        count = stock;
      }
      // const cart = localStorage.getItem('cart');
      const cart = this.localStorageService.get('cart');
      if (cart) {
        const carts = JSON.parse(cart);
        const foundItemIndex = carts.findIndex((item: any) => {
          const hasMatchingProduct = item?.product_id === product_id;

          if (!hasMatchingProduct) return false;

          const cartOptions = item.options || [];

          // Compare lengths first — must be exact match
          if (cartOptions.length !== selectedValues.length) return false;

          // Ensure every selected value matches an option in the cart
          const isFullMatch = selectedValues.every((selected: any) =>
            cartOptions.some((option: any) => selected.id === option.idForValue)
          );

          return isFullMatch;
        });

        if (foundItemIndex !== -1) {
          count = carts[foundItemIndex].count + count;
          if (count > stock) {
            count = stock;
          }
          carts[foundItemIndex].count = count;

          console.log(carts, 'localStorage.setItem( JSON.stringify(carts)); ');
          this.localStorageService.remove('cart');
          // this.localStorageService.set('cart', JSON.stringify(carts));
          //localStorage.removeItem('cart');
          ///localStorage.setItem('cart', JSON.stringify(carts));
          this.localStorageService.set('cart', JSON.stringify(carts));
        } else {
          const cartModelForLocalStorg = {
            product_id: product_id,
            count: +count,
            imageUrl: imageUrl,
            price: price,
            proName: proName,
            description: description,
            stock: stock,
            options: selectedValueObject,
            selected: true,
          };
          carts.push(cartModelForLocalStorg);
          this.localStorageService.set('cart', JSON.stringify(carts));
          //localStorage.setItem('cart', JSON.stringify(carts));
        }
        if (showHeader) {
          this.CartStatus(true);
          this.checkCart$.subscribe();
        }
        this.getCart(this.storeId);
        console.log(cartModel, 'cartModel cart cart cart');
      } else {
        const carts = [];
        const cartModelForLocalStorg = {
          id: 0,
          product_id: product_id,
          count: +count,
          imageUrl: imageUrl,
          price: price,
          proName: proName,
          description: description,
          stock: stock,
          options: selectedValueObject,
          selected: true,
        };
        carts.push(cartModelForLocalStorg);
        this.localStorageService.set('cart', JSON.stringify(carts));
        // localStorage.setItem('cart', JSON.stringify(carts));
        if (showHeader) {
          this.CartStatus(true);
          this.checkCart$.subscribe();
        }
        this.getCart(this.storeId);
        console.log(cartModel, 'cartModel cart cart cart');
      }
    }
  }

  deleteBasket(basket: cart) {
    return this.http
      .delete(this.baseUrl + 'cart?id=' + basket.cart_id)
      .subscribe({
        next: () => {
          this.deleteLocalBasket();
        },
      });
  }
  deleteLocalBasket() {
    //this.basketSource.next(null);
    this.localStorageService.remove('cart');
    //localStorage.removeItem("cart");
  }
  updateUserByCardId(storeId: any) {
    const token = this.localStorageService.get('token');
    //const token = localStorage.getItem('token');

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    const Cart = this.localStorageService.get('cart');
    //const Cart = localStorage.getItem('cart');
    if (Cart) {
      const carts = JSON.parse(Cart);
      const cartModelsArray = carts.map((item: any) => ({
        product_id: item.product_id,
        count: item.count,
        store_id: +storeId,
        stoork_option_values: item.options.map((item: { idForValue: any }) => ({
          id: item.idForValue, // ✅ Change `idForValue` to `id`
        })),
      }));
      this.http
        .post(
          this.baseUrl + `/v4/api/stores/${this.storeId}/cart`,
          cartModelsArray,
          {
            headers: this.getHeaders(),
          }
        )
        .subscribe({
          next: (response) => {
            this.deleteLocalBasket();
            this.getCart(this.storeId);
          },
          error: (error) => {
            console.log(error);
          },
        });
    }
  }
  mapToCartModel(source: any): any {
    return {
      product_id: source.product_id,
      count: source.count,
      product_variant_id: source.product_variant_id,
      size_id: source.size_id,
    };
  }
  changeSelectIntoCart(pro: any, selected: any) {
    if (this.CartFromToken) {
      console.log('id', pro.id);
      console.log('selected', selected);
      this.http
        .put(
          this.baseUrl + '/v3/api/carts',
          { id: [pro.id], selected: selected },
          {
            headers: this.getHeaders(),
          }
        )
        .subscribe({
          next: (response) => {
            this.getCart(this.storeId);
          },
          error: (error) => {
            console.log(error);
          },
        });
    } else {
      const foundProductIndex = this.cart.findIndex(
        (product: any) =>
          product.product_id === pro.product_id &&
          product.product_variant_id === pro.product_variant_id &&
          product.size_id === pro.size_id
      );

      if (foundProductIndex !== -1) {
        this.cart[foundProductIndex].selected = selected;
        this.localStorageService.remove('cart');
        this.localStorageService.set('cart', JSON.stringify(this.cart));
        // localStorage.removeItem('cart');
        // localStorage.setItem('cart', JSON.stringify(this.cart));
      }
      this.getCart(this.storeId);
    }
  }
  // changeSelectAllIntoCart(selectedArray: any, selected: any) {
  //   if (this.CartFromToken) {
  //     //console.log('id',pro.id );
  //     console.log('selected', selected);
  //     this.http.put(this.baseUrl + `/v4/api/stores/${this.storeId}/cart/update-selected-items`, { cart_ids: selectedArray, is_selected: selected }, {
  //       headers: this.getHeaders(),
  //     }).subscribe({
  //       next: (response) => {

  //         this.getCart(this.storeId);
  //       },
  //       error: (error) => {
  //         console.log(error);
  //       },
  //     });
  //   }
  //   else {
  //     this.cart = this.cart.map((product: any) => ({ ...product, selected: selected }));
  //     this.localStorageService.remove('cart');
  //     this.localStorageService.set('cart', JSON.stringify(this.cart));
  //     // localStorage.removeItem('cart');
  //     // localStorage.setItem('cart', JSON.stringify(this.cart));
  //     this.getCart(this.storeId);
  //   }
  // }
  changeSelectAllIntoCart(selectedArray: any, selected: any) {
    if (this.CartFromToken) {
      this.http
        .patch(
          this.baseUrl +
            `/v4/api/stores/${this.storeId}/cart/update-selected-items`,
          { cart_ids: selectedArray, is_selected: selected },
          { headers: this.getHeaders() }
        )
        .subscribe({
          next: () => {
            this.getCart(this.storeId);
          },
          error: (error) => {
            console.log(error);
          },
        });
    } else {
      this.cart = this.cart.map((product: any) => {
        return { ...product, selected: selected };
      });

      this.localStorageService.remove('cart');
      this.localStorageService.set('cart', JSON.stringify(this.cart));
      this.getCart(this.storeId);
    }
  }
  DeleteSelectfromCart(pro: any) {
    if (this.CartFromToken) {
      this.deleteWithBodyParams('api/v1/cartss/delete', {
        ids: [pro.id],
      }).subscribe({
        next: (response) => {
          if (response)
            this.toast.add({
              severity: 'success',
              summary: this.translate.instant('success'),
              detail: this.translate.instant('productdeletesuccessfully'),
            });
          this.getCart(this.storeId);
        },
        error: (error) => {
          console.log(error);
        },
      });
    } else {
      const foundProductIndex = this.cart.findIndex(
        (product: any) =>
          product.product_id === pro.product_id &&
          product.product_variant_id === pro.product_variant_id &&
          product.size_id === pro.size_id
      );

      if (foundProductIndex !== -1) {
        // Remove the found product from the array
        this.cart = this.cart.filter(
          (product: any, index: any) => index !== foundProductIndex
        );
        this.localStorageService.remove('cart');
        this.localStorageService.set('cart', JSON.stringify(this.cart));
        // localStorage.removeItem('cart');
        // localStorage.setItem('cart', JSON.stringify(this.cart));
        this.getCart(this.storeId);
      }
    }
  }
  DeleteAllSelectfromCart(selectedIDs: any) {
    if (this.CartFromToken) {
      this.deleteWithBodyParams('api/v1/cartss/delete', {
        ids: selectedIDs,
      }).subscribe({
        next: (response) => {
          if (response)
            this.toast.add({
              severity: 'success',
              summary: this.translate.instant('success'),
              detail: this.translate.instant('productdeletesuccessfully'),
            });
          this.getCart(this.storeId);
        },
        error: (error) => {
          console.log(error);
        },
      });
    } else {
      this.localStorageService.remove('cart');
      this.localStorageService.set('cart', JSON.stringify(this.cart));
      // localStorage.removeItem('cart');
      //localStorage.setItem('cart', JSON.stringify(this.cart));
    }
  }
  deleteWithBodyParams(url: string, params: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const options = {
      headers: this.getHeaders(),
      body: params,
    };

    return this.http.delete(`${this.baseUrl}/${url}`, options);
  }
  updateCountOfProductFromHome(pro: any, count: any, type: any) {
    if (this.CartFromToken) {
      console.log(this.cart, 'this.cart');
      console.log(pro, 'pro');
      const matchedCart = this.cart.find(
        (item: { product_id: any }) => item.product_id === pro.id
      );

      const cartId = matchedCart?.id;
      this.http
        .put(
          this.baseUrl + `/v3/api/carts/${cartId}`,
          { count: count },
          {
            headers: this.getHeaders(),
          }
        )
        .subscribe({
          next: (response) => {
            if (response)
              this.toast.add({
                severity: 'success',
                summary: this.translate.instant('success'),
                detail: this.translate.instant(
                  'productcountupdatesuccessfully'
                ),
              });
            //  this.getTotalPrice();
            this.getCart(this.storeId);
          },
          error: (error) => {
            console.log(error);
          },
        });
    } else {
      // alert(count);
      // const foundProductIndex = this.cart.findIndex((product: any) => product.product_id === pro.product_id
      //   && product.product_variant_id === pro.product_variant_id

      //   && product.size_id === pro.size_id);
      const foundItemIndex = this.cart.findIndex((item: any) => {
        const hasMatchingProduct = item.product_id === pro.id;
        // const hasMatchingOption = item.options.some((option: any) =>
        //     pro.options.some((selected: any) => selected.id === option.idForValue)
        // );&& hasMatchingOption;

        return hasMatchingProduct;
      });

      if (foundItemIndex !== -1) {
        if (type == 'inc') {
          this.cart[foundItemIndex].count += 1;
        } else if (type == 'dec') {
          this.cart[foundItemIndex].count -= 1;
        }

        // console.log(carts,'localStorage.setItem( JSON.stringify(carts)); ')
        // ;
        this.localStorageService.remove('cart');
        this.localStorageService.set('cart', JSON.stringify(this.cart));
        // localStorage.removeItem('cart');
        //localStorage.setItem('cart', JSON.stringify(this.cart));
        this.getCart(this.storeId);
      }
    }
  }
  getAllAdress(): void {
    let url = this.baseUrl + `/api/v1/addresses`;
    this.http
      .get(url, {
        headers: this.getHeaders(),
      })
      .subscribe({
        next: (res) => {
          this.resAddress = res;
          this.allAddress = this.resAddress?.data;
          console.log(this.allAddress, 'this.allAddress');
          const defaultAddress = this.allAddress.find(
            (address: any) => address.is_default == true
          );
          console.log(defaultAddress, 'address');
          if (defaultAddress) {
            this.Shipping = defaultAddress.governorate.extra_charge;
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  calculateTotalCountItemPrice(count: any, price: any) {
    return Number(count) * Number(price);
  }
  setOrderWithOutRegister(order: any) {
    this.OrderWithOutRegister = order;
  }

  getOrderWithOutRegister() {
    return this.OrderWithOutRegister;
  }
  removeItemsFromCart(itemsOrder: any[]) {
    this.cart = this.cart.filter((item: any) => {
      // Check if the current item in the cart has a productId that doesn't match any of the productIds in the itemsOrder array
      return !itemsOrder.some(
        (orderItem) => orderItem.variant_id === item.product_variant_id
      );
    });
    this.localStorageService.remove('cart');
    this.localStorageService.set('cart', JSON.stringify(this.cart));
    // localStorage.removeItem('cart');
    //localStorage.setItem('cart', JSON.stringify(this.cart));
    this.getCart(this.storeId);
  }
  setCartForcheckout(data: any[]) {
    this.cartDataForcheckout = data;
  }
  getCartForcheckout(): any[] {
    return this.cartDataForcheckout;
  }
  DeleteItemfromCart(pro: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const options = {
      headers: this.getHeaders(),
    };
    if (this.CartFromToken) {
      //const targetProductId = 51;

      const matchedCart = this.cart.find(
        (item: { product_id: any }) => item.product_id === pro.id
      );

      const cartId = matchedCart?.id;

      //console.log(cartId); // هيطبع 199 لو لقى العنصر
      this.http
        .delete(this.baseUrl + `/v3/api/carts/${cartId}`, options)
        .subscribe({
          next: (response) => {
            if (response)
              this.toast.add({
                severity: 'success',
                summary: this.translate.instant('success'),
                detail: this.translate.instant('productdeletesuccessfully'),
              });
            this.getCart(this.storeId);
          },
          error: (error) => {
            console.log(error);
          },
        });
    } else {
      const foundProductIndex = this.cart.findIndex(
        (product: any) => product.product_id === pro.id
      );

      if (foundProductIndex !== -1) {
        // Remove the found product from the array
        this.cart = this.cart.filter(
          (product: any, index: any) => index !== foundProductIndex
        );
        this.localStorageService.remove('cart');
        this.localStorageService.set('cart', JSON.stringify(this.cart));
        // localStorage.removeItem('cart');
        // localStorage.setItem('cart', JSON.stringify(this.cart));
        this.getCart(this.storeId);
      }
    }
  }
  incrementOrDecrementQuantityInCart(product: any, count: any, operation: any) {
    // "opration":"decrement" or "increment"
    const token = this.localStorageService.get('token');
    if (token) {
      const matchedCart = this.cart.find(
        (item: { product_id: any }) => item.product_id === product.id
      );

      const cartId = matchedCart?.id;
      const obj = {
        count: count,
        opration: operation,
      };
      this.http
        .post(this.baseUrl + `/v3/api/carts/${cartId}/update-quantity`, obj, {
          headers: this.getHeaders(),
        })
        .subscribe({
          next: (response) => {
            this.getCart(this.storeId);
          },
          error: (error) => {
            console.log(error);
          },
        });
    } else {
      //const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const matchedItem = this.cart.find(
        (item: { product_id: any }) => item.product_id === product.id
      );
      if (matchedItem) {
        matchedItem.count = Math.max(0, matchedItem.count - count);
      }
      this.localStorageService.set('cart', JSON.stringify(this.cart));

      this.getCart(this.storeId);
    }
  }
}
