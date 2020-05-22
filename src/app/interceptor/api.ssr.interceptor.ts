import { Inject, Injectable, Optional } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import isEmpty from 'lodash-es/isEmpty';

@Injectable()
export class ApiSsrInterceptor implements HttpInterceptor {

  constructor(
    @Optional() @Inject('accessTokenInSSr') protected accessToken: string
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (!isEmpty(this.accessToken)) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.accessToken}`
        }
      });
    }

    return next.handle(request);
  }
}
