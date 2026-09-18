import { Component, input } from '@angular/core';
import { ClockHandsDirective } from './clock-hands-directive';
import type { Rect } from '../data-types';
import type { TZDate } from '@date-fns/tz';

@Component({
  selector: 'tfx-clock-hands',
  imports: [ClockHandsDirective],
  template: `
    <div
      class="container"
      [style.top.px]="clockRect().y"
      [style.left.px]="clockRect().x"
      [style.width.px]="clockRect().width"
      [style.height.px]="clockRect().height"
    >
      <canvas
        tfxClockHands
        class="clock-hands"
        [clockRect]="clockRect()"
        [localTime]="localTime()"
        [showSeconds]="showSeconds()"
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
      .clock-hands {
        height: 100%;
        width: 100%;
      }
    `,
  ],
})
export class ClockHands {
  clockRect = input.required<Rect>();
  localTime = input.required<TZDate>();
  showSeconds = input<boolean>(true);
}
