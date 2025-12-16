import { Component, Input } from '@angular/core';
import { MainCat } from '../../models/categories/main-Category';
import { AuthService } from '../../services/auth.service';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  res: any;
   FooterData: any = [];
   FooterSocialMediaData:any;
   categories: any = [];
   storeId:any;
   pages:any;
   storeEmail:any=" ";
   storePhone:any=" ";
   storeSocialMediaLinks:any;
 
  // *_________properties_______________
  // categories: MainCat[] = [
  //   {
  //     id: 1,
  //     name: 'Electronics',
  //   },
  //   {
  //     id: 2,
  //     name: 'Mobile',
  //   },
  //   {
  //     id: 3,
  //     name: 'Tablets ',
  //   },
  //   {
  //     id: 4,
  //     name: 'Laptops',
  //   },
  //   {
  //     id: 5,
  //     name: 'Home Appliances',
  //   },
  //   {
  //     id: 6,
  //     name: 'Camera, Photo & Video',
  //   },
  //   {
  //     id: 7,
  //     name: 'Televisions',
  //   },
  // ];

  // *_________properties_______________
  constructor(private _aut: AuthService,private _Settings:SettingsService) {

  }
  ngOnInit() {
    
    this._Settings.loadSettings().subscribe(data => {

     
      this.storeId = data.storeId;
      this.storeEmail=data.email;
      this.storePhone=data.phone;
      this.storeSocialMediaLinks=data.socialLinks;
      this.getFooterNavData();
      this.getAllCats();
      this.getFooterPages();
    });
    
  }
   getAllCats() {
    let url: string = `v3/api/${this.storeId}/categories`;
    this._aut.get(url).subscribe({
      next: (res) => {
        
        //this.isLoadingcategories=false;
        //this.isLoadingcategories=false;
        this.categories = res.data;
        console.log(this.categories,'categories from app');
      
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  getFooterNavData() {
    this._aut.get(`v3/api/social/store/${this.storeId}`).subscribe({
      next: (response) => {

       

        this.FooterSocialMediaData = response;
         //console.log(this.FooterSocialMediaData,'this.FooterSocialMediaData');        

      },
      error: (error) => console.log(error),
    });
  }
  getFooterPages(){

    let url: string = `v4/api/${this.storeId}/pages`;
    this._aut.get(url).subscribe({
      next: (res) => {
        this.pages = res.data;
        
      
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  // getfooterCategory() {
  //   this._aut.get('api/v1/settings/footers').subscribe({
  //     next: (res) => {
  //      // this.res = response;
  //       this.Footers = res.data?.sort((a:any, b:any) => a.order - b.order);;
  //       // this.navCat = this.categories.slice(0, 5);
  //        console.log(this.Footers, 'this.Footers footer');
  //     },
  //     error: (error) => {
  //       console.log(error.message);
  //     },
  //   });
  // }
//   socialLinks = [
//   { type: 'facebook', url: 'https://www.youtube.com/watch?v=Apl8h-P0F9Q' },
//   { type: 'instagram', url: 'https://www.youtube.com/watch?v=Apl8h-P0F9Q' },
//   { type: 'youtube', url: 'https://www.youtube.com/watch?v=Apl8h-P0F9Q' },
//   { type: 'tikTok', url: 'https://www.youtube.com/watch?v=Apl8h-P0F9Q' }
// ];

getSocialIcon(type: string): string {
  switch (type.toLowerCase()) {
    case 'facebook':
      return 'assets/images/footer/faceBook.png';
    case 'instagram':
      return 'assets/images/footer/camera.png';
    case 'youtube':
      return 'assets/images/footer/youtube.png';
    case 'tiktok':
      return 'assets/images/footer/music.png';
    case 'xlink':
      return 'assets/images/footer/x.png';
    case 'snapchat':
      return 'assets/images/footer/snapChat.png';
    case 'pentress':
      return 'assets/images/footer/p.png';
    default:
      return 'assets/images/footer/default.png';
  }
}
}
