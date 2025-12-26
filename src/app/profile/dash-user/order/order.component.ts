import { Component } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { AuthService } from '../../../shared/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { ResponsiveService } from '../../../shared/services/responsive.service';
import { PageEvent } from '../../../shared/models/PageEvent';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { SettingsService } from '../../../shared/services/settings.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
  standalone:false
})
export class OrderComponent {
showOrderSt: string = 'all';
  allOrder: any;
  Orders: any = [];
  items: MenuItem[] | undefined;
  first: number = 0;
  rows: number = 2;
  showOpenOrder: any;
  btnCancelOrder: boolean = false;
  isResponsive: boolean=false;
  userData: any;
  pageNum:any=1;
  per_page:any=10;
  //  @Output() Orders = new EventEmitter<any[]>();
  // ____________properties______________

  constructor(
    public _auth: AuthService,
    private _toast: MessageService,
    private translate: TranslateService,
    private _ResponsiveService:ResponsiveService,
    private localStorageService:LocalStorageService,
     private _setting:SettingsService,
  ) {
    this.items = [
      { label: this.translate.instant('orders'), routerLink: 'Order' },
      { label: this.translate.instant('OrderDetails') },
    ];
    this.userData = JSON.parse(this.localStorageService.get('userInfo') || '');
  }

  ngOnInit(): void {
 //  alert(this.userData)
    this._ResponsiveService.FavoriteStatus(true);
    //this._ResponsiveService.ProfileStatus(true);
     //console.log(this.isResponsive,'this._ResponsiveService.isCart$');
    this.getAllOrder(this.showOrderSt);
    this.showOpenOrder = this.Orders.slice(this.first, this.rows);
  }
  ngOnDestroy() {
    this._ResponsiveService.FavoriteStatus(false);
  }
  onPageChange(event: PageEvent | any) {
    // this.getAllOrder(this.showOrderSt);
    // for test

    // for test

    this.first = event.first;
    this.rows = event.rows;

    this.showOpenOrder = this.Orders.slice(
      event.first,
      event.first + this.rows
    );
  }
  // *__________________ Methods __________________
  // ?__________________ Methods __________________
  showOrders(str: string): void {
    // console.log(str, 'strstrstrstr');
    this.showOrderSt = str;
    this.getAllOrder(this.showOrderSt);
  }

  getAllOrder(status: string,current_page:any=1) {
    if (status == 'all') {
      let url: string = `v3/api/users/${this.userData?.id}/orders?per_page=${this.per_page}&current_page=${current_page}`;
      this._auth.get(url).subscribe({
        next: (res) => {
          this.allOrder = res.orders; 
          console.log(res,'this.allOrder this.allOrder');
          // this.Orders.emit(this.allOrder);
          this.Orders = this.allOrder;
        
          this.showOpenOrder = this.Orders.slice(this.first, this.rows);
         
        },
        error: (err) => {
          console.log(err);
        },
      });
    } else if (status == 'active') {
      this.btnCancelOrder = true;
      this.Orders = this.allOrder.filter((order: any) => {
        return (
          order.status == 'Pending' ||
          order.status == 'Arriving' ||
          order.status == 'In-Delivery'
        );
      });
      this.showOpenOrder = this.Orders.slice(this.first, this.rows);

      console.log(this.Orders, 'this.Ordersthis.Ordersthis.Orders from active');
    } else if (status == 'completed') {
      console.log(status, 'strstrstrstr');
      this.Orders =
        //.emit(
        this.allOrder.filter((order: any) => {
          return order.order.status == 'SuccessArriving';
        });
      this.showOpenOrder = this.Orders.slice(this.first, this.rows);
      //);
      console.log(
        this.Orders,
        'this.Ordersthis.Ordersthis.Orders from arriving'
      );
    } else if (status == 'cancel') {
      console.log(status, 'strstrstrstr');
      this.Orders = this.allOrder.filter((order: any) => {
        return order.status == 'Canceled';
      });
      this.showOpenOrder = this.Orders.slice(this.first, this.rows);
      console.log(
        this.Orders,
        'this.Ordersthis.Ordersthis.Orders from arriving'
      );
    }
  }

}
