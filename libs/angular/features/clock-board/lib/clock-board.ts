import { Component, computed, inject } from '@angular/core';
import { ClockPanel } from './clock-panel';
import { UTCTimerService } from '@core/utc-timer/index';
import { ClockBoardDataService } from '@data/data-layer/index';
import { ClockProfile } from '@data/data-models/index';
import { ClockBoardService } from './clock-board-service';

@Component({
  selector: 'tfx-clock-board',
  imports: [ClockPanel],
  template: `
    <div
      class="clock-board"
      [style.gridTemplateColumns]="gridTemplateColumnsCSS()"
      [style.columnRule]="'2px solid black'"
      [style.rowRule]="'2px solid black'"
    >
      @for (clock of clockProfiles(); track clock.placeName) {
        <tfx-clock-panel
          [clockProfile]="clock"
          [clockIndex]="$index"
          [utcTime]="utcTime()"
          (editClock)="editClock(clock, $index)"
        />
        <!-- <div class="clock"></div> -->
      }
    </div>
  `,
  styles: [
    `
      .clock-board {
        height: 100%;
        width: 100%;
        display: grid;
        gap: 2px;
        border: 2px solid black;
      }
    `,
  ],
  providers: [ClockBoardService],
})
export class ClockBoard {
  private readonly clockBoardDataService = inject(ClockBoardDataService);
  private readonly clockBoardService = inject(ClockBoardService);

  protected readonly utcTime = inject(UTCTimerService).utcTime;
  protected readonly clockProfiles = this.clockBoardDataService.clockProfiles;
  private numberOfColumns = this.clockBoardDataService.numberOfColumns;

  protected gridTemplateColumnsCSS = computed(() => {
    const columnsToUse = Math.min(this.numberOfColumns(), this.clockProfiles().length);
    const t = `repeat(${columnsToUse}, 1fr)`;
    return t;
  });

  protected editClock(clockData: ClockProfile, index: number): void {
    this.clockBoardService.editClock(clockData, index);
  }
}
