import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import * as jwt from 'jsonwebtoken';

import { AuthService } from '../service/auth.service';

const ACCESS_TOKEN_KEY = 'access_token';
const TOKEN_EXPIRES_KEY = 'token_expires';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private http: HttpClient
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    // this.authService.getOrUpdateToken().subscribe();
    this.update().then();
    return true;
  }

  async update() {
    await this.authService.getOrUpdateToken();
  }

}
