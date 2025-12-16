import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem, MessageService } from 'primeng/api';
import { AuthService } from '../../shared/services/auth.service';
import { ResponsiveService } from '../../shared/services/responsive.service';
import { FavoriteService } from '../favorite.service';
import { of } from 'rxjs';
import { SettingsService } from '../../shared/services/settings.service';
@Component({
  selector: 'app-favorities',
  templateUrl: './favorities.component.html',
  styleUrl: './favorities.component.scss'
})
export class FavoritiesComponent {
  constructor(
    
    private toast: MessageService,
    private formBuilder: FormBuilder,
    public _aut: AuthService,
    public fav: FavoriteService,
    private translate:TranslateService,
    private _ResponsiveService:ResponsiveService,
    private _setting:SettingsService
  ) {}

  showfavoriteSt: string = 'Favorites';
  isResponsive:boolean=true;
  //listLength!: number;
  resList: any;
  lists: any;
  show: any;
  items: MenuItem[] | undefined;
  home: MenuItem | undefined;
  storeId:any;
  AddListForm = new FormGroup({
    name: new FormControl('', Validators.required),
    store_id:new FormControl(''),
  });
  showAddListDiolog: boolean = false;
  showOrders(str: string): void {
    this.showfavoriteSt = str;
  }
  ngOnInit() {
    this._setting.loadSettings().subscribe(data => {

      this.storeId = data.storeId;
      this.fav.itemsLength.subscribe();
      this.fav.listsLength.subscribe();
    
    });
    
   this._ResponsiveService.FavoriteStatus(true);
   this._ResponsiveService.isFavorites$.subscribe({
    next: (res) => {
      this.isResponsive = res;
    },
    error: (err) => {
      console.log(err);
    },} )
    this.items = [
      { label: this.translate.instant('home'), routerLink: '/' },
      { label:this.translate.instant('Favorites') , routerLink: '/favorites' },
    ];
  
  }
  ngOnDestroy() {
    this._ResponsiveService.FavoriteStatus(false);
  }
  //for create list diologe
  onSubmit() {
    this.AddListForm.value.store_id=this.storeId;
    this._aut.post(`v3/api/lists`, this.AddListForm.value, false).subscribe({
      next: (response) => {
        this.toast.add({
          severity:'success',
          summary:this.translate.instant('success') ,
          detail: this.translate.instant('listaddedsuccessfully') ,
        });
        this.ShowAddListDiolage();
        this.getlists();
        // this.showOrders('Favorites');
        // this.showOrders('lists');
        //this.addListlength(100);
        this.AddListForm.controls.name.setValue('');

      },
      error: (error) => {
        if (error.status === 422)
          this.toast.add({
            severity:error ,
            summary:this.translate.instant('error') ,
            detail: this.translate.instant('retryagain') ,
          });
          
      },
    });
  }
  getlists() {
    this._aut.get(`v3/api/lists/${this.storeId}`, false).subscribe({
      next: (response) => {
        this.resList = response;

        this.lists = this.resList.data;
        // this.show = this.lists.slice(
        //   this.fav.first$.getValue(),
        //   this.fav.rows$.getValue()
        // );
        // this.fav.lists$ = of(this.show);
        this.fav.lists$ = of(this.lists);
        this.fav.lists$.subscribe();
        //  this.listsLength.emit(this.lists.length);

        this.fav.listsLength.next(this.lists.length);
        //console.log(this.lists, 'lists');
      },
    });
  }
  ShowAddListDiolage() {
    this.showAddListDiolog = !this.showAddListDiolog;
  }

}
