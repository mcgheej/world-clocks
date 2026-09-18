import { Component, input } from '@angular/core';
import { Rect } from '../data-types';
import { TZDate } from '@date-fns/tz';
import { ClockExtrasDirective } from './clock-extras-directive';

@Component({
  selector: 'tfx-clock-extras',
  imports: [ClockExtrasDirective],
  template: `
    <div
      class="container"
      [style.top.px]="clockRect().y"
      [style.left.px]="clockRect().x"
      [style.width.px]="clockRect().width"
      [style.height.px]="clockRect().height"
    >
      <canvas
        tfxClockExtras
        class="clock-extras"
        [clockRect]="clockRect()"
        [localTime]="localTime()"
        [width]="clockRect().width"
        [height]="clockRect().height"
      ></canvas>
    </div>
  `,
  styles: [
    `
      .container {
        position: absolute;
      }
      .clock-extras {
        width: 100%;
        height: 100%;
      }
    `,
  ],
})
export class ClockExtras {
  clockRect = input.required<Rect>();
  localTime = input.required<TZDate>();
}
