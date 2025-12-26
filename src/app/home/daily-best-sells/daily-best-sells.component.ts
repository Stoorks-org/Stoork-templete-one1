import { Component, Input } from '@angular/core';
// import { FavoritesService } from 'src/app/favorites/favorites.service';
// import { prouct } from 'src/app/shared/models/product/product';
import { HomeserviceService } from '../homeservice.service';
import { AuthService } from '../../shared/services/auth.service';
import { environment } from '../../environments/environment';
import { FavoriteService } from '../../favorities/favorite.service';
//import { AuthService } from 'src/app/shared/services/auth.service';
//import { FavoriteService } from 'src/app/favoritenew/favorite.service';
//import { utils } from 'src/app/shared/utils/utils';
@Component({
  selector: 'app-daily-best-sells',
  templateUrl: './daily-best-sells.component.html',
  styleUrls: ['./daily-best-sells.component.scss'],
  standalone:false
})
export class DailyBestSellsComponent {
  @Input() MostSold: any = [];
  @Input() bottomSliderImge: any = [];
  src1: string = '';
  src2: string = '';
  baseLinkUrl: string = environment.apiUrl;
  res: any;

  constructor(
    public _auth: AuthService,
    private homeService: HomeserviceService,
    public fav: FavoriteService
  ) {}
  ngOnInit(): void {
    this._auth.getfaviorites;
  }

  // getMostSold() {
  //   this.homeService.getall().subscribe({
  //     next: (response) => {
  //       this.res = response;
  //       //console.log(response, 'response');
  //       this.MostSold = this.res.data.most_sold.slice(0, 4);
  //     },
  //     error: (error) => console.log(error),
  //   });
  // }
}
