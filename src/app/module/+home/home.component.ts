import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TransferState, makeStateKey } from '@angular/platform-browser';

import { ApiService } from '../../service/api.service';

const RESULT_KEY = makeStateKey<string>('api-json');

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {

  subs: any;

  constructor(private state: TransferState, private apiService: ApiService) { }

  ngOnInit() {
    if (this.state.hasKey(RESULT_KEY)) {
      console.log('HomeComponent, get subs from ssr json');
      this.subs = this.state.get(RESULT_KEY, null as any);
    } else {
      console.log('HomeComponent, get subs from api');
      this.apiService.getProtectedApi().subscribe(data => {
        this.subs = data;
        this.state.set(RESULT_KEY, this.subs);
      });
    }
  }

}
