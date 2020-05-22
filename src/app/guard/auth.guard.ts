import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import { AuthService } from '../service/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    return this.authService.getOrUpdateToken()
      .pipe(
        // get token fail or not won't break the route
        map(data => { return true }),
        catchError((e: HttpErrorResponse) => of(true))
      );
  }

}
