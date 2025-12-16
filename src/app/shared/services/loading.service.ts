import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private loadingCount = 0;

  get isLoading(): boolean {
    return this.loadingCount > 0;
  }

  show(): void {
    this.loadingCount++;
  }

  hide(): void {
    this.loadingCount--;
    if (this.loadingCount < 0) {
      this.loadingCount = 0;
    }
  }
}
