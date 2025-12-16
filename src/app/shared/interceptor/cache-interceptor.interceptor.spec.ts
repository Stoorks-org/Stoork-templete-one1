import { TestBed } from '@angular/core/testing';

import { CacheInterceptorInterceptor } from './cache-interceptor.interceptor';

describe('CacheInterceptorInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      CacheInterceptorInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: CacheInterceptorInterceptor = TestBed.inject(CacheInterceptorInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
