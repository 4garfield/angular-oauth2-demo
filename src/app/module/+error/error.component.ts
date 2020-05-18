import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorComponent {

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe(params => console.log(params));
  }

}
