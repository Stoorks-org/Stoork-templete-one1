import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
//import { getToken, onMessage } from 'firebase/messaging';
import { environment } from '../../environments/environment';
import { initializeApp } from 'firebase/app';
import {
  getMessaging,
  getToken,
  onMessage,
  Messaging,
} from 'firebase/messaging';

@Injectable({
  providedIn: 'root'
})
export class FCMServiceService {

  private messaging : Messaging;
   constructor(private _auth: AuthService) {
    const app = initializeApp(environment.firebase);
    this.messaging = getMessaging(app);
  }

  requestPermission(userId: string) {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        getToken(this.messaging, {
          vapidKey: environment.vapidKey
        }).then((token) => {
          console.log('FCM Token:', token);
          this._auth.updateFcmToken(token,userId);
        });
      }
    });
  }

  listenForMessages() {
    onMessage(this.messaging, (payload) => {
      console.log('Message received:', payload);
    });
  }
}
