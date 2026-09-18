import { Component, computed, input } from '@angular/core';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { inject } from '@angular/core';
import { CommandBusService } from '@core/command-bus/index';
import { ClockProfile } from '@data/data-models/index';
import { ClockBoardDataService } from '@data/data-layer/index';
import { MatIcon } from '@angular/material/icon';
import { ClockContextMenuCommands } from '@core/app-commands/index';

@Component({
  selector: 'tfx-clock-context-menu',
  imports: [CdkMenu, CdkMenuItem, CdkMenuTrigger, MatIcon],
  template: `
    <div class="tfx-menu" cdkMenu>
      <button cdkMenuItem (click)="toggleShowSeconds()">
        {{ showData() ? 'Hide seconds' : 'Show seconds' }}
      </button>
      <button cdkMenuItem (click)="toggleHighlightClock()">
        {{ highlightClock() ? 'Unhighlight clock' : 'Highlight clock' }}
      </button>
      <button cdkMenuItem (click)="editClock()">Edit clock...</button>
      <button
        cdkMenuItem
        [disabled]="numberOfRecentlyUsedClocks() <= 0"
        [cdkMenuTriggerFor]="recentlyUsedMenu"
      >
        Replace clock from recently used...
        <mat-icon>arrow_right</mat-icon>
      </button>
      <button [disabled]="numberOfClockProfiles() <= 1" cdkMenuItem (click)="deleteClock()">
        Delete
      </button>

      <ng-template #recentlyUsedMenu>
        @if (numberOfRecentlyUsedClocks() > 0) {
          <div class="tfx-menu" cdkMenu>
            @for (clock of recentlyUsedClocks(); track clock.placeName) {
              <button cdkMenuItem (click)="replaceClockFromRecentlyUsed(clock)">
                {{ clock.placeName }}
              </button>
            }
          </div>
        }
      </ng-template>
    </div>
  `,
})
export class ClockContextMenu {
  private readonly commandBus = inject(CommandBusService);
  private readonly clockBoardDataService = inject(ClockBoardDataService);

  clockProfile = input.required<ClockProfile>();
  clockIndex = input.required<number>();

  protected recentlyUsedClocks = this.clockBoardDataService.recentlyUsedClocks;

  protected showData = computed(() => this.clockProfile().withSeconds);
  protected highlightClock = computed(() => this.clockProfile().withHighlight);

  protected readonly numberOfClockProfiles = computed(
    () => this.clockBoardDataService.clockProfiles().length,
  );
  protected readonly numberOfRecentlyUsedClocks = computed(() => this.recentlyUsedClocks().length);

  protected toggleShowSeconds(): void {
    this.commandBus.emit(ClockContextMenuCommands.toggleShowSeconds({ index: this.clockIndex() }));
  }
  protected toggleHighlightClock(): void {
    this.commandBus.emit(ClockContextMenuCommands.toggleHighlightClock());
  }
  protected editClock(): void {
    this.commandBus.emit(
      ClockContextMenuCommands.editClock({
        clock: this.clockProfile(),
        index: this.clockIndex(),
      }),
    );
  }
  protected deleteClock(): void {
    this.commandBus.emit(
      ClockContextMenuCommands.deleteClock({
        index: this.clockIndex(),
      }),
    );
  }
  protected replaceClockFromRecentlyUsed(clock: ClockProfile): void {
    this.commandBus.emit(
      ClockContextMenuCommands.replaceClockFromRecentlyUsed({
        clock,
        index: this.clockIndex(),
      }),
    );
  }
}
