import { Service, inject } from '@angular/core';
import { AppBarMenuCommands } from '@core/app-commands/index';
import { ClockContextMenuCommands } from '@core/app-commands/index';
import { CommandBusService } from '@core/command-bus/index';
import { editNumberOfColumns } from './menu-command-handlers/edit-number-of-columns';
import { Dialog } from '@angular/cdk/dialog';
import { ClockBoardDataService } from '@data/data-layer/index';
import { ClockProfile } from '@data/data-models/index';
import {
  openEditClockDialog,
  openMoveClockDialog,
  openNewClockDialog,
} from '@ui/app-dialogs/index';

@Service()
export class ClockBoardService {
  private readonly clockBoardDataService = inject(ClockBoardDataService);
  private commandBus = inject(CommandBusService);
  private dialog = inject(Dialog);

  private numberOfColumns = this.clockBoardDataService.numberOfColumns;
  private clockProfiles = this.clockBoardDataService.clockProfiles;

  constructor() {
    this.commandBus.commands$.subscribe((command) =>
      this.handleAppBarMenuCommands(
        command as
          AppBarMenuCommands.AppBarMenuCommands | ClockContextMenuCommands.ClockContextMenuCommands,
      ),
    );
  }

  editClock(clockProfile: ClockProfile, clockIndex: number) {
    openEditClockDialog({ dialog: this.dialog, clockProfile, clockIndex }).subscribe((result) => {
      if (result) {
        if (result.operation === 'save') {
          this.clockBoardDataService.updateClockProfile(clockIndex, result.clock);
        } else if (result.operation === 'delete') {
          this.clockBoardDataService.deleteClockProfile(clockIndex);
        }
      }
    });
  }

  private handleAppBarMenuCommands(
    command:
      AppBarMenuCommands.AppBarMenuCommands | ClockContextMenuCommands.ClockContextMenuCommands,
  ) {
    switch (command.type) {
      case AppBarMenuCommands.EDIT_NUMBER_OF_COLUMNS:
        this.doEditNumberOfColumns();
        break;
      case AppBarMenuCommands.ADD_NEW_CLOCK:
        this.doAddNewClock();
        break;
      case AppBarMenuCommands.REARRANGE_CLOCKS:
        this.doRearrangeClocks();
        break;
      case AppBarMenuCommands.ADD_CLOCK_FROM_RECENTLY_USED:
        this.doAddRecentlyUsedClock(command.payload.clock);
        break;
      case ClockContextMenuCommands.TOGGLE_SHOW_SECONDS:
        this.doToggleShowSeconds(command.payload.index);
        break;
      case ClockContextMenuCommands.TOGGLE_HIGHLIGHT_CLOCK:
        this.doToggleHighlightClock(command.payload.index);
        break;
      case ClockContextMenuCommands.EDIT_CLOCK:
        this.editClock(command.payload.clock, command.payload.index);
        break;
      case ClockContextMenuCommands.DELETE_CLOCK:
        this.clockBoardDataService.deleteClockProfile(command.payload.index);
        break;
      case ClockContextMenuCommands.REPLACE_CLOCK_FROM_RECENTLY_USED:
        this.doReplaceClockFromRecentlyUsed(command.payload.clock, command.payload.index);
        break;
    }
  }

  private doEditNumberOfColumns(): void {
    editNumberOfColumns(this.numberOfColumns(), this.dialog).subscribe((result) => {
      if (result !== undefined) {
        this.clockBoardDataService.updateNumberOfColumns(result);
      }
    });
  }

  private doAddNewClock(): void {
    openNewClockDialog(this.dialog).subscribe((result) => {
      if (result && result.operation === 'save') {
        this.clockBoardDataService.addClockProfile(result.clock);
      }
    });
  }

  private doRearrangeClocks(): void {
    openMoveClockDialog(this.dialog, this.clockBoardDataService.clockProfiles()).subscribe(
      (result) => {
        if (result) {
          this.clockBoardDataService.rearrangeClockProfiles(result);
        }
      },
    );
  }

  private doAddRecentlyUsedClock(clockProfile: ClockProfile): void {
    this.clockBoardDataService.addClockProfile(clockProfile);
  }

  private doToggleShowSeconds(clockIndex: number): void {
    const clockProfile = this.clockBoardDataService.clockProfiles()[clockIndex];
    this.clockBoardDataService.updateClockProfile(clockIndex, {
      ...clockProfile,
      withSeconds: !clockProfile.withSeconds,
    });
  }

  private doToggleHighlightClock(clockIndex: number): void {
    const clockProfile = this.clockBoardDataService.clockProfiles()[clockIndex];
    this.clockBoardDataService.updateClockProfile(clockIndex, {
      ...clockProfile,
      withHighlight: !clockProfile.withHighlight,
    });
  }

  private doReplaceClockFromRecentlyUsed(clockProfile: ClockProfile, clockIndex: number): void {
    this.clockBoardDataService.updateClockProfile(clockIndex, { ...clockProfile });
  }
}
