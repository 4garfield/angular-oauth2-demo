import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs/observable/of'

import { AuthService } from '../service/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    return this.authService.getOrUpdateToken()
      .pipe(
        map(data => {
          if (data) {
            return true;
          }
        }),
        catchError(err => {
          // this.router.navigate(['/error']);
          return of(false);
        })
      );
  }

}
