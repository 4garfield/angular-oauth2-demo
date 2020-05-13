import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { APP_BASE_HREF } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { PrebootModule } from 'preboot';
import { StorageServiceModule } from 'ngx-webstorage-service';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';
import { HomeModule } from './module/+home/home.module';
import { AuthGuard } from './guard/auth.guard';
import { ApiService } from './service/api.service';
import { AuthService } from './service/auth.service';

@NgModule({
  imports: [
    BrowserModule.withServerTransition({
      appId: 'angular-oauth2-demo-app'
    }),
    PrebootModule.withConfig({ appRoot: 'app' }),
    HttpClientModule,
    TransferHttpCacheModule,
    StorageServiceModule,
    HomeModule,
    AppRoutingModule
  ],
  declarations: [AppComponent],
  providers: [
    {
      provide: APP_BASE_HREF, useValue: '/'
    },
    AuthGuard,
    ApiService,
    AuthService
  ],
  exports: [AppComponent]
})
export class AppModule { }
