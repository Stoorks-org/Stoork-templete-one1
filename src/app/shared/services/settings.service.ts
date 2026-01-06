import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Settings {
    logoPath: any;
    storeId: string;
    mainColor: string;
    textColor: string;
    storeName:string;
    currency_symbol_native:string;
    secondaryColor:string;
    
    bodyColor: string;
    navColor: string;
    footerColor: string;
    
    mainImagePath: string;
    announcementsPath: string;
    themeId: string;
    socialMedia:any;
    storeUrl: string;
    currency: string;
    languageId: string;
    build_id: string;
    currency_code: string;
    currency_symbol: string;
   
    currency_name: string;
    phone: string;
    email: string;
   whatsapp: string;
}
@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private settingsUrl = 'assets/setting.json';
  private settings: Settings | undefined;

  constructor(private http: HttpClient) { }
  loadSettings(): Observable<Settings> {
    return this.http.get<Settings>(this.settingsUrl);
}

getStoreId(): string | undefined {
    return this.settings?.storeId;
}

setSettings(settings: Settings): void {
    this.settings = settings;
}
// this.storeId = this.configService.getStoreId();
}
