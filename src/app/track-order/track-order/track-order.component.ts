import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { CartService } from '../../cart/cart.service';
import { SettingsService } from '../../shared/services/settings.service';

@Component({
  selector: 'app-track-order',
  templateUrl: './track-order.component.html',
  styleUrl: './track-order.component.scss',
  standalone:false
})
export class TrackOrderComponent {
 codeForm:FormGroup;
 storeId:any;
  constructor(
    private _fb: FormBuilder,
    public _auth: AuthService,
    private translate:TranslateService,
    private router: Router,
    public cartSer: CartService,
     private _setting:SettingsService,
  ){
    this.codeForm = this._fb.group({
    code: ['', Validators.required]})
  }
   ngOnInit(): void {
     this._setting.loadSettings().subscribe(data => {

      this.storeId = data.storeId;
      //  this.getOrder(this.storeId);
    });
   
    
  }
  searchOrderByCode(){
  const  orderNum=this.codeForm.get('code')?.value;
    this._auth.get(`v4/api/stores/${this.storeId}/orders/${orderNum}`).subscribe({
      next: (res) => {
       this.router.navigateByUrl(`/trackOrder/order/${orderNum}`);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
