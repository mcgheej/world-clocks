import { Service, inject } from '@angular/core';
import { AppBarMenuCommands } from '@core/app-commands/index';
import { CommandBusService } from '@core/command-bus/index';
import { editNumberOfColumns } from './app-bar-menu-commands/edit-number-of-columns';
import { Dialog } from '@angular/cdk/dialog';
import { ClockBoardDataService } from '@data/data-layer/index';
import { ClockProfile } from '@data/data-models/index';

@Service()
export class ClockBoardService {
  private readonly clockBoardDataService = inject(ClockBoardDataService);
  private commandBus = inject(CommandBusService);
  private dialog = inject(Dialog);

  private numberOfColumns = this.clockBoardDataService.numberOfColumns;

  constructor() {
    this.commandBus.commands$.subscribe((command) =>
      this.handleAppBarMenuCommands(command as AppBarMenuCommands.AppBarMenuCommands),
    );
  }

  private handleAppBarMenuCommands(command: AppBarMenuCommands.AppBarMenuCommands) {
    switch (command.type) {
      case AppBarMenuCommands.EDIT_NUMBER_OF_COLUMNS:
        this.doEditNumberOfColumns();
        break;
      case AppBarMenuCommands.ADD_NEW_CLOCK:
        console.log('Adding new clock...');
        break;
      case AppBarMenuCommands.REARRANGE_CLOCKS:
        console.log('Rearranging clocks...');
        break;
      case AppBarMenuCommands.ADD_CLOCK_FROM_RECENTLY_USED:
        this.doAddRecentlyUsedClock(command.payload.clock);
        console.log(`Adding clock ${command.payload.clock.placeName} from recently used...`);
        break;
    }
  }

  private doEditNumberOfColumns() {
    editNumberOfColumns(this.numberOfColumns(), this.dialog).subscribe((result) => {
      if (result !== undefined) {
        this.clockBoardDataService.updateNumberOfColumns(result);
      }
    });
  }

  private doAddRecentlyUsedClock(clockProfile: ClockProfile) {
    this.clockBoardDataService.addClockProfile(clockProfile);
  }
}
