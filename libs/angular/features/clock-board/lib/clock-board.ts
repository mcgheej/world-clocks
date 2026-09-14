import { Component, computed, inject } from '@angular/core';
import { ClockBoardDataService } from '@data/data-layer/index';

@Component({
  selector: 'tfx-clock-board',
  imports: [],
  template: `
    <div
      class="clock-board"
      [style.gridTemplateColumns]="gridTemplateColumnsCSS()"
      [style.columnRule]="'2px solid black'"
      [style.rowRule]="'2px solid black'"
    >
      @for (clock of clockProfiles(); track clock.placeName) {
        <div class="clock"></div>
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
})
export class ClockBoard {
  private readonly clockBoardDataService = inject(ClockBoardDataService);

  protected readonly clockProfiles = this.clockBoardDataService.clockProfiles;
  private numberOfColumns = this.clockBoardDataService.numberOfColumns;

  protected gridTemplateColumnsCSS = computed(() => {
    const columnsToUse = Math.min(this.numberOfColumns(), this.clockProfiles().length);
    const t = `repeat(${columnsToUse}, 1fr)`;
    return t;
  });
}
