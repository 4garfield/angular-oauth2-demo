import { Injectable, Injector } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import isEmpty from 'lodash-es/isEmpty';

import { AuthService } from '../service/auth.service';

@Injectable()
export class ApiCsrInterceptor implements HttpInterceptor {

  constructor(private injector: Injector) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // https://stackoverflow.com/questions/45654351/injector-error-provider-parse-errors-cannot-instantiate-cyclic-dependency
    const authService = this.injector.get(AuthService);
    const accessToken = authService.getTokenFromStorage();

    if (request.headers.has('client_id') && !isEmpty(accessToken)) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`
        }
      });
    }
    return next.handle(request);
  }
}
