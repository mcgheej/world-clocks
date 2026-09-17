import { Component, computed, inject } from '@angular/core';
import { ClockBoardDataService } from '@data/data-layer/index';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { MatIcon } from '@angular/material/icon';
import { AppBarMenuCommands } from '@core/app-commands/index';
import { ClockProfile } from '@data/data-models/index';
import { CommandBusService } from '@core/command-bus/index';
import { ElectronApiService } from '@electron-api/index';

@Component({
  selector: 'tfx-app-bar-menu',
  imports: [CdkMenu, CdkMenuItem, CdkMenuTrigger, MatIcon],
  template: `
    <div class="tfx-menu" cdkMenu>
      <button cdkMenuItem (click)="changeNumberOfColumns()">Edit number of columns...</button>
      <button cdkMenuItem (click)="addNewClock()">Add new clock...</button>
      <button
        cdkMenuItem
        [disabled]="numberOfRecentlyUsedClocks() <= 0"
        [cdkMenuTriggerFor]="recentlyUsedMenu"
      >
        Add clock from recently used...
        <mat-icon>arrow_right</mat-icon>
      </button>
      <button cdkMenuItem [disabled]="numberOfClockProfiles() <= 1" (click)="rearrangeClocks()">
        Rearrange clocks...
      </button>
      @if (electronApi() !== null) {
        <button cdkMenuItem (click)="exitApp()">Exit</button>
      }

      <ng-template #recentlyUsedMenu>
        @if (numberOfRecentlyUsedClocks() > 0) {
          <div class="tfx-menu" cdkMenu>
            @for (clock of recentlyUsedClocks(); track clock.placeName) {
              <button cdkMenuItem (click)="addClockFromRecentlyUsed(clock, $index)">
                {{ clock.placeName }}
              </button>
            }
          </div>
        }
      </ng-template>
    </div>
  `,
  standalone: true,
})
export class AppBarMenu {
  private readonly commandBus = inject(CommandBusService);

  private readonly clockProfiles = inject(ClockBoardDataService).clockProfiles;
  protected readonly recentlyUsedClocks = inject(ClockBoardDataService).recentlyUsedClocks;
  protected readonly electronApi = inject(ElectronApiService).electronApi;

  protected readonly numberOfClockProfiles = computed(() => this.clockProfiles().length);
  protected readonly numberOfRecentlyUsedClocks = computed(() => this.recentlyUsedClocks().length);

  protected changeNumberOfColumns() {
    this.commandBus.emit(AppBarMenuCommands.editNumberOfColumns());
  }

  protected rearrangeClocks() {
    this.commandBus.emit(AppBarMenuCommands.rearrangeClocks());
  }

  protected addNewClock() {
    this.commandBus.emit(AppBarMenuCommands.addNewClock());
  }

  protected addClockFromRecentlyUsed(clock: ClockProfile, index: number) {
    this.commandBus.emit(AppBarMenuCommands.addClockFromRecentlyUsed({ clock, index }));
  }

  protected exitApp() {
    this.commandBus.emit(AppBarMenuCommands.exitApp());
  }
}
