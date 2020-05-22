import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{
  path: '',
  redirectTo: 'home',
  pathMatch: 'full',
}, {
  path: 'lazy',
  loadChildren: './module/+lazy/lazy.module#LazyModule'
},
  // {
  //   path: 'error',
  //   loadChildren: './module/+error/error.module#ErrorModule'
  // }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { initialNavigation: 'enabled' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
