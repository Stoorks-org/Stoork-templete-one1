import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { getToken, onMessage } from 'firebase/messaging';
import { environment } from '../../environments/environment';

import { Messaging } from '@angular/fire/messaging';

@Injectable({
  providedIn: 'root'
})
export class FCMServiceService {

  private messaging = inject(Messaging);
 constructor(private _auth:AuthService) {}
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
