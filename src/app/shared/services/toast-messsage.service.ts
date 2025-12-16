import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToastMesssageService {
  constructor(private toast: MessageService) {}

  showToast(
    type: string = 'custom',
    title: string,
    message: string,
    icon: string = 'pi-thumbs-up',
    sticky: boolean = false
  ) {
    this.toast.add({
      severity: type,
      summary: title,
      detail: message,
      icon: icon,
      sticky: sticky,
    });
  }
}
