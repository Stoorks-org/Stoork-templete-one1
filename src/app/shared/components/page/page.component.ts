import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrl: './page.component.scss'
})
export class PageComponent {
storeId:any;
pageContent:any;
constructor(private route: ActivatedRoute,private _aut: AuthService,private _Settings:SettingsService){}
ngOnInit() {
  const slug = this.route.snapshot.paramMap.get('slug');
  this._Settings.loadSettings().subscribe(data => {

      
      this.storeId = data.storeId;
  this.getPage(slug);
  });
  
}
getPage(slug:any){
 let url: string = `v4/api/${this.storeId}/pages/${slug}`;
    this._aut.get(url).subscribe({
      next: (res) => {
        this.pageContent = res.data.content;
      },
      error: (err) => {
        console.log(err);
      },
    });
}
}
