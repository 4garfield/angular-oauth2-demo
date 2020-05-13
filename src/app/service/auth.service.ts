import { APP_ID, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';

import * as jwt from 'jsonwebtoken';
import { Observable } from 'rxjs/Observable';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of'

const ACCESS_TOKEN_KEY = 'access_token';
const TOKEN_EXPIRES_KEY = 'token_expires';

enum TOKEN_STATUS {
  VALID,
  EXPIRES
}

@Injectable()
export class AuthService {

  constructor(private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(SESSION_STORAGE) private storage: StorageService) { }

  public getTokenFromStorage(): string {
    return this.storage.get(ACCESS_TOKEN_KEY);
  }

  public getTokenExpiresFromStorage(): Number {
    return this.storage.get(TOKEN_EXPIRES_KEY);
  }

  public getOrUpdateToken() {
    const currentTimeInSecond = Math.floor(Date.now() / 1000);
    if (this.getTokenFromStorage() &&
      this.getTokenExpiresFromStorage() &&
      currentTimeInSecond < this.getTokenExpiresFromStorage()
    ) {
      return of(this.getTokenFromStorage()).toPromise();
    } else {
      return this.getTokenFromSSR();
    }
  }

  //Observable<string>
  private getTokenFromSSR() {
    return this.http.get('http://localhost:3000/getToken').pipe(
      map(data => {
        const accessToken: string = data['access_token'];
        console.log('accessToken:' + accessToken);
        if (isPlatformBrowser(this.platformId)) {
          this.storage.set(ACCESS_TOKEN_KEY, accessToken);
          const decoded = jwt.decode(accessToken);
          this.storage.set(TOKEN_EXPIRES_KEY, decoded['exp']);
          console.log(JSON.stringify(decoded));
        }
        return accessToken;
      })
    ).toPromise();
  }

}
