import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class ApiService {

  constructor(private http: HttpClient) { }

  getProtectedApi(): Observable<any> {
    return this.http.get('https://demo.identityserver.io/api/test', {
      headers: {
        client_id: 'm2m'
      }
    });
  }
}
