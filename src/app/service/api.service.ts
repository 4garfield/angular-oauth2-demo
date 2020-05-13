import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of'

@Injectable()
export class ApiService {

  constructor(private http: HttpClient) { }

  getProtectedApi(): Observable<any> {
    console.log('ApiService, getProtectedApi');
    return this.http.get('https://demo.identityserver.io/api/test', {
      headers: {
        client_id: 'm2m'
      }
    }).pipe(
      catchError((e: HttpErrorResponse) => of(`API has Error: ${e.status} ${e.statusText}`)),
    );
  }
}
