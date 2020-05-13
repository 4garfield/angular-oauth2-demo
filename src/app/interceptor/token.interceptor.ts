import { Injectable, Injector } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { AuthService } from '../service/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private injector: Injector) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // https://stackoverflow.com/questions/45654351/injector-error-provider-parse-errors-cannot-instantiate-cyclic-dependency
    const authService = this.injector.get(AuthService);

    console.log('TokenInterceptor, intercept:' + request.url);

    if (request.url !== 'http://localhost:3000/getToken') {
      this.update();
    }
    return next.handle(request);
  }

  async update() {
    // https://stackoverflow.com/questions/45654351/injector-error-provider-parse-errors-cannot-instantiate-cyclic-dependency
    const authService = this.injector.get(AuthService);
    await authService.getOrUpdateToken();
  }
}
