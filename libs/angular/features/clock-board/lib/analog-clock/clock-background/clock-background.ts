import { Component, input } from '@angular/core';
import { Rect } from '../data-types';
import { ClockBackgroundDirective } from './clock-background-directive';

@Component({
  selector: 'tfx-clock-background',
  imports: [ClockBackgroundDirective],
  template: `
    <div
      class="container"
      [style.top.px]="clockRect().y"
      [style.left.px]="clockRect().x"
      [style.width.px]="clockRect().width"
      [style.height.px]="clockRect().height"
    >
      <canvas
        tfxClockBackground
        class="background-canvas"
        [clockRect]="clockRect()"
        [highlightClock]="highlightClock()"
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
      .background-canvas {
        height: 100%;
        width: 100%;
      }
    `,
  ],
})
export class ClockBackground {
  clockRect = input.required<Rect>();
  highlightClock = input<boolean>(false);
}
