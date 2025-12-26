import { ChangeDetectorRef, Component, HostListener, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CartService } from './cart/cart.service';
import { AuthService } from './shared/services/auth.service';
import { MessageService } from 'primeng/api';
import { SettingsService } from './shared/services/settings.service';
import { ResponsiveService } from './shared/services/responsive.service';
import { FavoriteService } from './favorities/favorite.service';
import { AccountService } from './account/account.service';
import { LocalStorageService } from './shared/services/local-storage.service';
import { NavigationStart, Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone:false
})
export class AppComponent {
  title = 'StoorkTemplete-One';
  mainColor: any;
  textColor: any;
  isCart: boolean = false;
  storeId: any;
  isResponsiveProDetails = false;
  categories: any = [];
  //storeName:any;
  store: any;
  FooterSocialMediaData: any;
  isLoging: any = false;
  isSignUp: any = false;
  isforgetpassword: any = false;
  iscreatenewpassword: any = false;
  isverifypassword: any = false;
  socialMediaLinks: any;
  Whatslink = '';
  private loadedTypes: Set<string> = new Set();
  isFooterVisible: boolean=false;
notifactionData:any;
  constructor(
    private translate: TranslateService,
    private renderer: Renderer2,
    public cartService: CartService,
    private _changes: ChangeDetectorRef,
    public accountService: AccountService,
    public _aut: AuthService,
    private toast: MessageService,
    private _Settings: SettingsService,
    private _ResponsiveService: ResponsiveService,
    public fav: FavoriteService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        console.log(event.url);
        window.scrollTo(0, 0);
      }
    });
    translate.setDefaultLang('en'); // Set the default language
    this.cartService.checkCart$.subscribe({
      next: (res) => {
        this.isCart = res;
      },
      error: (err) => {
        console.log(err);
      },
    });
    this._ResponsiveService.isProductDetails$.subscribe({
      next: (res) => {
        this.isResponsiveProDetails = res;
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.accountService.checkLogin$.subscribe({
      next: (res: any) => {
        this.isLoging = res;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
    this.accountService.checkSignUp$.subscribe({
      next: (res) => {
        this.isSignUp = res;
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.accountService.checkforgetpassword$.subscribe({
      next: (res) => {
        this.isforgetpassword = res;
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.accountService.checkverifypassword$.subscribe({
      next: (res) => {
        this.isverifypassword = res;
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.accountService.checkcreatenewpassword$.subscribe({
      next: (res) => {
        this.iscreatenewpassword = res;
      },
      error: (err) => {
        console.log(err);
      },
    });
    let lang = this.localStorageService.get('lang')
      ? this.localStorageService.get('lang')
      : 'ar';
    if (lang) {
      translate.use(lang);
    }
    if (lang == 'en') this._aut.isValueEn.next(true);
    else this._aut.isValueEn.next(false);
  }
  ngOnInit() {
    this.getStoreById();
    this._Settings.loadSettings().subscribe((data) => {
      console.log(data, 'data data');
      this.storeId = data.storeId;
      this.mainColor = data.mainColor;
      this.textColor = data.textColor;
      this.title = data.storeName;
      this.Whatslink = data.whatsapp;

      this.insertMainColor();
      this.cartService.getCart(this.storeId);
      this._aut.getfaviorites(this.storeId);
      //this.cartService.getCart();
      this.loadCurrentUser();
      this.loadPixels();
      //this.getFooterNavData();
      //this.getAllSocialUrl();
      //this.getAllCats();
    });
    // Set the mainColor as a Sass variable
  }
  getStoreById() {
    this._aut.get(`v3/api/store/${this.storeId}`).subscribe({
      next: (response) => {
        this.store = response;
        console.log(this.store, 'this.store');
      },
      error: (error) => {
        if (error.status == 404)
          this.toast.add({
            severity: 'error',
            summary: this.translate.instant('error'),
            detail: this.translate.instant(
              'youdonothaveaddressPleaseAddAddress'
            ),
          });
      },
    });
  }
  loadCurrentUser() {
    //const token = localStorage.getItem('token');
    const token = this.localStorageService.get('token');
    console.log(token, 'this.userData');
    if (token) {
      this.accountService.loadCurrentUser(token);
      // this._aut.getCartnumber();
    }
  }
  insertMainColor() {
    console.log(this.store, 'this.store from insert');
    const styleEl = this.renderer.createElement('style');
    const css = `:root { --main-co: ${this.mainColor}; }`;
    const css2 = `:root { --text-co: ${this.textColor}; }`;
    const css3 = `:root { --border-co: ${this.textColor}; }`;
    this.renderer.appendChild(styleEl, this.renderer.createText(css));
    this.renderer.appendChild(styleEl, this.renderer.createText(css2));
    this.renderer.appendChild(styleEl, this.renderer.createText(css3));
    this.renderer.appendChild(document.head, styleEl);
  }
  ngAfterContentChecked(): void {
    this._changes.detectChanges();
  }

  //  getAllSocialUrl(){
  //   this._aut.get(`v3/api/social/store/${this.storeId}`).subscribe({
  //     next: (res) => {
  //      this.socialMediaLinks=res;
  //      this.Whatslink =this.socialMediaLinks.find((item: { link_type: string; }) => item.link_type === "WhatsApp")?.url;
  //      console.log(res,'v3/api/social');
  //     },
  //     error: (err) => {
  //       // this._tosat.showToast(
  //       //   'error',
  //       //   'OOops !',
  //       //   err.error.message,
  //       //   'pi-thumbs-down',
  //       //   false
  //       // );
  //       console.log(err);
  //     },
  //   });
  // }
  upclick() {
    // if (isPlatformBrowser(this.platformId)) {
    window.scroll(0, 0);
  }
  ///////////

  loadPixels() {
    this._aut.get(`v4/api/stores/${this.storeId}/social-links`).subscribe({
      next: (res) => {
        const socialPixcelLinks = res?.data?.data;
        socialPixcelLinks.forEach(
          (pixel: { type: string; client_id: string }) =>
            this.loadPixel(pixel.type, pixel.client_id)
        );
        //console.log(res,'v3/api/social');
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  loadPixel(type: string, clientId: string) {
    const lowerType = type.toLowerCase();
    if (this.loadedTypes.has(lowerType)) return;

    switch (lowerType) {
      case 'facebook':
        this.loadFacebookPixel(clientId);
        break;
      case 'tiktok':
        this.loadTikTokPixel(clientId);
        break;
      case 'snapchat':
        this.loadSnapchatPixel(clientId);
        break;
      case 'pinterest':
        this.loadPinterestPixel(clientId);
        break;
      // case 'whatsapp':
      //   this.loadWhatsAppPixel(clientId);
      //   break;
      case 'google':
        this.loadGooglePixel(clientId);
        break;
      default:
        console.warn(`Pixel type ${type} not supported.`);
    }

    this.loadedTypes.add(lowerType);
  }

  loadFacebookPixel(id: string) {
    // لو fbq موجود بالفعل، استخدمه مباشرة
    if ((window as any).fbq && typeof (window as any).fbq === 'function') {
      (window as any).fbq('init', id);
      (window as any).fbq('track', 'PageView');
      return;
    }

    // لو السكريبت مضاف بالفعل، ما تضيفهوش تاني
    if (
      document.querySelector(
        'script[src="https://connect.facebook.net/en_US/fbevents.js"]'
      )
    ) {
      const interval = setInterval(() => {
        if ((window as any).fbq && typeof (window as any).fbq === 'function') {
          clearInterval(interval);
          (window as any).fbq('init', id);
          (window as any).fbq('track', 'PageView');
        }
      }, 100);
      return;
    }

    // ✅ تعريف fbq قبل تحميل السكريبت
    (window as any).fbq = function () {
      (window as any).fbq.callMethod
        ? (window as any).fbq.callMethod.apply((window as any).fbq, arguments)
        : (window as any).fbq.queue.push(arguments);
    };
    (window as any).fbq.queue = [];
    (window as any).fbq.push = (window as any).fbq;
    (window as any).fbq.loaded = true;
    (window as any).fbq.version = '2.9.243';

    // تحميل السكريبت
    const script = document.createElement('script');
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    script.async = true;
    document.head.appendChild(script);

    // بعد التحميل، نبدأ التهيئة
    script.onload = () => {
      (window as any).fbq('init', id);
      (window as any).fbq('track', 'PageView');
    };
  }

  loadTikTokPixel(id: string) {
    // لو ttq موجود بالفعل، استخدمه
    if ((window as any).ttq && typeof (window as any).ttq.load === 'function') {
      (window as any).ttq.load(id);
      (window as any).ttq.page();
      return;
    }

    // ✅ تعريف ttq بالطريقة الرسمية قبل تحميل السكريبت
    (function (w: any, d: any, t: string) {
      w.TiktokAnalyticsObject = t;
      const ttq = (w[t] = w[t] || []);
      ttq.methods = [
        'page',
        'track',
        'identify',
        'instances',
        'debug',
        'on',
        'off',
        'once',
        'ready',
        'alias',
        'group',
        'enableCookie',
        'disableCookie',
      ];
      ttq.setAndDefer = function (t: any, e: any) {
        ttq[e] = function () {
          ttq.push([e].concat(Array.prototype.slice.call(arguments, 0)));
        };
      };
      for (let i = 0; i < ttq.methods.length; i++) {
        ttq.setAndDefer(0, ttq.methods[i]);
      }
      ttq.instance = function (t: any) {
        const e = ttq._i[t] || [];
        for (let i = 0; i < ttq.methods.length; i++) {
          ttq.setAndDefer(t, ttq.methods[i]);
        }
        return e;
      };
      ttq.load = function (e: any) {
        const n = d.createElement('script');
        n.type = 'text/javascript';
        n.async = true;
        n.src = 'https://analytics.tiktok.com/i18n/pixel/events.js';
        const s = d.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(n, s);
        ttq._i = ttq._i || {};
        ttq._i[e] = [];
        ttq._i[e]._u = 'https://analytics.tiktok.com/i18n/pixel/events.js';
        ttq._t = +new Date();
        ttq._o = e;
      };
    })(window, document, 'ttq');

    // ✅ تهيئة الـ Pixel
    (window as any).ttq.load(id);
    (window as any).ttq.page();
  }
  loadSnapchatPixel(id: string) {
    const script = document.createElement('script');
    script.src = 'https://sc-static.net/scevent.min.js';
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      (window as any).snaptr =
        (window as any).snaptr ||
        function () {
          (window as any).snaptr.handleRequest
            ? (window as any).snaptr.handleRequest.apply(
                (window as any).snaptr,
                arguments
              )
            : (window as any).snaptr.queue.push(arguments);
        };
      (window as any).snaptr('init', id);
      (window as any).snaptr('track', 'PAGE_VIEW');
    };
  }

  loadTwitterPixel(id: string) {
    const script = document.createElement('script');
    script.src = 'https://static.ads-twitter.com/uwt.js';
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      (window as any).twq =
        (window as any).twq ||
        function () {
          (window as any).twq.exe
            ? (window as any).twq.exe.apply(null, arguments)
            : (window as any).twq.queue.push(arguments);
        };
      (window as any).twq.queue = [];
      (window as any).twq.version = 1;
      (window as any).twq('init', id);
      (window as any).twq('track', 'PageView');
    };
  }
  loadGooglePixel(id: string) {
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      (window as any).dataLayer = (window as any).dataLayer || [];
      function gtag(...args: any[]) {
        (window as any).dataLayer.push(args);
      }
      gtag('js', new Date());
      gtag('config', id);
    };
  }
  loadPinterestPixel(id: string) {
    const script = document.createElement('script');
    script.src = 'https://s.pinimg.com/ct/core.js';
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      (window as any).pintrk =
        (window as any).pintrk ||
        function () {
          (window as any).pintrk.queue.push(arguments);
        };
      (window as any).pintrk.queue = [];
      (window as any).pintrk('load', id);
      (window as any).pintrk('page');
    };
  }
}
