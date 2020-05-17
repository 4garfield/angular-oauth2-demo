import { NgModule } from '@angular/core'
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserTransferStateModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { ApiCsrInterceptor } from './interceptor/api.csr.interceptor';

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    BrowserAnimationsModule,
    BrowserTransferStateModule,
    AppModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: ApiCsrInterceptor,
    multi: true
  }]
})
export class AppBrowserModule { }
