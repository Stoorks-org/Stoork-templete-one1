import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { HttpCacheService } from '../services/http-cache.service';

@Injectable()
export class CacheInterceptorInterceptor implements HttpInterceptor {

  constructor(private cacheService: HttpCacheService) {}

  // intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
  //   return next.handle(request);
  // }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Check if the request is cacheable
    if (request.method !== 'GET') {
      this.cacheService.invalidateCache();
      return next.handle(request);
    }

    // Attempt to retrieve response from cache
    const cachedResponse = this.cacheService.get(request.url);
    if (cachedResponse) {
      return of(cachedResponse.clone());
    }

    // Cache miss, send the request and cache the response
    return next.handle(request).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          this.cacheService.put(request.url, event.clone());
        }
      })
    );
  }

}
