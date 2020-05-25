import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import * as jwt from 'jsonwebtoken';
import { Observable } from 'rxjs/Observable';
import { map, publishReplay, refCount } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import isEmpty from 'lodash-es/isEmpty';

const ACCESS_TOKEN_KEY = 'access_token';
const TOKEN_EXPIRES_KEY = 'token_expires';

@Injectable()
export class AuthService {

  private tokenObservable$: Observable<string>;

  constructor(
    private http: HttpClient,
    @Inject(LOCAL_STORAGE) private storage: StorageService
  ) { }

  public getTokenFromStorage(): string {
    return this.storage.get(ACCESS_TOKEN_KEY);
  }

  public getTokenExpiresFromStorage(): Number {
    return this.storage.get(TOKEN_EXPIRES_KEY);
  }

  // in ssr, the storage will fallback as InMemoryStorageService
  public getOrUpdateToken(): Observable<string> {
    const currentTimeInSecond = Math.floor(Date.now() / 1000);
    const accessToken = this.getTokenFromStorage();
    const tokenExpires = this.getTokenExpiresFromStorage();
    if (!isEmpty(accessToken) && tokenExpires && (currentTimeInSecond < tokenExpires)) {
      return of(accessToken);
    } else if (!this.tokenObservable$) {
      this.tokenObservable$ = this.getTokenFromSSR();
    }
    return this.tokenObservable$;
  }

  private getTokenFromSSR(): Observable<string> {

    return this.http.get('http://localhost:3000/token').pipe(
      map(data => {
        const accessToken: string = data['access_token'];
        this.storage.set(ACCESS_TOKEN_KEY, accessToken);
        const decoded = jwt.decode(accessToken);
        this.storage.set(TOKEN_EXPIRES_KEY, decoded['exp']);

        return accessToken;
      }),
      // All subscribers to ReplaySubject before completion of Source will get emitted values
      // (in our case just 1 value as Http emits only once). For all new subscribers ReplaySubject
      // will replay N buffered values.
      // publishReplay(1),
      // refCount()
    );
  }

}
