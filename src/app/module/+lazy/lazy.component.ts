import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'app-lazy',
  templateUrl: './lazy.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LazyComponent { }
