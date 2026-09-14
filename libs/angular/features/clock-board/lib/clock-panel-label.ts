import { Component, input, output } from '@angular/core';

@Component({
  selector: 'tfx-clock-panel-label',
  imports: [],
  template: `
    <div class="clock-panel-label no-text-select" (click)="editClock.emit()">
      {{ placeName() }}
    </div>
  `,
  styles: [
    `
      .clock-panel-label {
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--mat-sys-primary-fixed-dim);
        color: var(--mat-sys-on-primary-fixed);
        cursor: pointer;
        font: var(--mat-sys-title-medium);
        letter-spacing: var(--mat-sys-title-medium-tracking);
        padding: 4px 0;
      }
    `,
  ],
})
export class ClockPanelLabel {
  placeName = input.required<string>();
  editClock = output<void>();
}
