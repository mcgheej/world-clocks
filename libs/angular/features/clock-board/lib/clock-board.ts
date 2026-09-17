import { Component, computed, inject } from '@angular/core';
import { CommandBusService } from '@core/command-bus/index';
import { ClockPanel } from './clock-panel';
import { UTCTimerService } from '@core/utc-timer/index';
import { ClockBoardDataService } from '@data/data-layer/index';
import { ClockProfile } from '@data/data-models/index';
import { AppBarMenuCommands } from '@core/app-commands/index';

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
          [utcTime]="utcTime()"
          (editClock)="editClock(clock)"
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
})
export class ClockBoard {
  private readonly clockBoardDataService = inject(ClockBoardDataService);
  private readonly commandBus = inject(CommandBusService);

  protected readonly utcTime = inject(UTCTimerService).utcTime;
  protected readonly clockProfiles = this.clockBoardDataService.clockProfiles;
  private numberOfColumns = this.clockBoardDataService.numberOfColumns;

  protected gridTemplateColumnsCSS = computed(() => {
    const columnsToUse = Math.min(this.numberOfColumns(), this.clockProfiles().length);
    const t = `repeat(${columnsToUse}, 1fr)`;
    return t;
  });

  protected editClock(clockData: ClockProfile): void {
    console.log(`Edit clock: ${clockData.placeName}`);
  }

  constructor() {
    this.commandBus.commands$.subscribe((command) =>
      handleCommands(command as AppBarMenuCommands.AppBarMenuCommands),
    );
  }
}

function handleCommands(command: AppBarMenuCommands.AppBarMenuCommands) {
  switch (command.type) {
    case AppBarMenuCommands.EDIT_NUMBER_OF_COLUMNS:
      console.log('Changing number of columns...');
      break;
    case AppBarMenuCommands.ADD_NEW_CLOCK:
      console.log('Adding new clock...');
      break;
    case AppBarMenuCommands.REARRANGE_CLOCKS:
      console.log('Rearranging clocks...');
      break;
    case AppBarMenuCommands.ADD_CLOCK_FROM_RECENTLY_USED:
      console.log(`Adding clock ${command.payload.clock.placeName} from recently used...`);
      break;
  }
}
