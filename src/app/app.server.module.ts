import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';

import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { ApiSsrInterceptor } from './interceptor/api.ssr.interceptor';

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    AppModule,
    ServerModule,
    ServerTransferStateModule,
    NoopAnimationsModule,
    ModuleMapLoaderModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: ApiSsrInterceptor,
    multi: true
  }],
})
export class AppServerModule { }
