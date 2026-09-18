import { ChangeDetectorRef, Component, computed, inject, input, signal } from '@angular/core';
import type { TZDate } from '@date-fns/tz';
import { ClockBackground } from './clock-background/clock-background';
import { Rect, Size } from './data-types';
import { TfxResizeEvent, ClockResizeObserver } from './clock-resize-observer';
import { ClockProfile } from '@data/data-models/index';
import { ClockHands } from './clock-hands/clock-hands';
import { ClockExtras } from './clock-extras/clock-extras';

@Component({
  selector: 'tfx-analog-clock',
  imports: [ClockBackground, ClockHands, ClockExtras, ClockResizeObserver],
  host: {
    'style.display': 'block',
    'style.height': '100%',
  },
  template: `
    <!-- clock-container -->
    <!-- canvas-container -->
    <!-- clock background -->

    <div class="container" (tfxResizeObserver)="clockSizeChanged($event)">
      <div class="clock-overlay">
        <tfx-clock-background [clockRect]="clockRect()" [highlightClock]="highlightClock()" />
      </div>
      <div class="clock-overlay">
        <tfx-clock-extras [clockRect]="clockRect()" [localTime]="localTime()" />
      </div>
      <div class="clock-overlay">
        <tfx-clock-hands
          [clockRect]="clockRect()"
          [localTime]="localTime()"
          [showSeconds]="showSeconds()"
        />
      </div>
    </div>
  `,
  styles: [
    `
      .container {
        height: 100%;
        width: 100%;
        display: grid;
        grid-template-rows: minmax(0, 1fr);
        grid-template-columns: minmax(0, 1fr);
      }

      .clock-overlay {
        position: relative;
        grid-column-start: 1;
        grid-column-end: 2;
        grid-row-start: 1;
        grid-row-end: 2;
      }
    `,
  ],
})
export class AnalogClock {
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  readonly clockProfile = input.required<ClockProfile>();
  readonly localTime = input.required<TZDate>();

  protected readonly showSeconds = computed(() => this.clockProfile().withSeconds);
  protected readonly highlightClock = computed(() => this.clockProfile().withHighlight);

  protected readonly clockRect = signal<Rect>({ x: 0, y: 0, width: 300, height: 300 });

  protected clockSizeChanged(event: TfxResizeEvent): void {
    const { width, height } = {
      width: event.newRect.width,
      height: event.newRect.height,
    };
    this.clockRect.set(this.getViewport({ width, height }));
    this.changeDetectorRef.detectChanges();
  }

  private getViewport({ width: canvasWidth, height: canvasHeight }: Size): Rect {
    const viewportLength =
      canvasWidth <= canvasHeight ? Math.round(canvasWidth * 0.9) : Math.round(canvasHeight * 0.9);
    const x = Math.round(canvasWidth / 2 - viewportLength / 2);
    const y = Math.round(canvasHeight / 2 - viewportLength / 2);
    return { x, y, width: viewportLength, height: viewportLength };
  }
}
