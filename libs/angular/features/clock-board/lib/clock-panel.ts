import { Component, computed, input, output } from '@angular/core';
import { TZDate } from '@date-fns/tz';
import { ClockProfile } from '@data/data-models/index';
import { ClockPanelLabel } from './clock-panel-label';
import { AnalogClock } from './analog-clock/analog-clock';

@Component({
  selector: 'tfx-clock-panel',
  imports: [ClockPanelLabel, AnalogClock],
  template: `
    <div class="clock-panel">
      <div class="clock-container">
        <tfx-analog-clock
          [clockProfile]="clockProfile()"
          [localTime]="localTime()"
        ></tfx-analog-clock>
      </div>
      <tfx-clock-panel-label
        [placeName]="clockProfile().placeName"
        (editClock)="editClock.emit()"
      ></tfx-clock-panel-label>
    </div>
  `,
  styles: [
    `
      .clock-panel {
        height: 100%;
        width: 100%;
        display: grid;
        // grid-template-columns: minmax(0, 1fr);
        grid-template-rows: minmax(0, 1fr) auto;
        // background-color: bisque;
      }

      .clock-container {
        background-color: bisque;
        display: grid;
        grid-template-rows: minmax(0, 1fr);
        grid-template-columns: minmax(0, 1fr);
      }
    `,
  ],
})
export class ClockPanel {
  clockProfile = input.required<ClockProfile>();
  utcTime = input.required<Date>();
  editClock = output<void>();
  // TODO: add output the emits when user clicks the clock panel label.This
  // will signal the parent component to open an edit dialog.

  protected readonly localTime = computed(() => {
    return TZDate.tz(this.clockProfile().ianaTimezone, this.utcTime());
  });
}
