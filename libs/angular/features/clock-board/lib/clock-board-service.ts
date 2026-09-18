import { Service, inject } from '@angular/core';
import { AppBarMenuCommands } from '@core/app-commands/index';
import { CommandBusService } from '@core/command-bus/index';
import { editNumberOfColumns } from './menu-command-handlers/edit-number-of-columns';
import { Dialog } from '@angular/cdk/dialog';
import { ClockBoardDataService } from '@data/data-layer/index';
import { ClockProfile } from '@data/data-models/index';
import { openNewClockDialog } from '@ui/app-dialogs/index';

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
        this.doAddNewClock();
        break;
      case AppBarMenuCommands.REARRANGE_CLOCKS:
        console.log('Rearranging clocks...');
        break;
      case AppBarMenuCommands.ADD_CLOCK_FROM_RECENTLY_USED:
        this.doAddRecentlyUsedClock(command.payload.clock);
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

  private doAddNewClock() {
    openNewClockDialog(this.dialog).subscribe((result) => {
      if (result && result.operation === 'save') {
        this.clockBoardDataService.addClockProfile(result.clock);
      }
    });
  }

  private doAddRecentlyUsedClock(clockProfile: ClockProfile) {
    this.clockBoardDataService.addClockProfile(clockProfile);
  }
}
