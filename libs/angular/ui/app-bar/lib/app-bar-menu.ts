import { Component, computed, inject } from '@angular/core';
import { ClockBoardDataService } from '@data/data-layer/index';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'tfx-app-bar-menu',
  imports: [CdkMenu, CdkMenuItem, CdkMenuTrigger, MatIcon],
  template: `
    <div class="tfx-menu" cdkMenu>
      <button cdkMenuItem>Edit number of columns...</button>
      <button cdkMenuItem>Add new clock...</button>
      <button
        cdkMenuItem
        [disabled]="numberOfRecentlyUsedClocks() <= 0"
        [cdkMenuTriggerFor]="recentlyUsedMenu"
      >
        Add clock from recently used...
        <mat-icon>arrow_right</mat-icon>
      </button>
      <button cdkMenuItem [disabled]="numberOfClockProfiles() <= 1">Rearrange clocks...</button>
      <button cdkMenuItem>Exit</button>

      <ng-template #recentlyUsedMenu>
        <div class="tfx-menu" cdkMenu>
          @for (clock of recentlyUsedClocks(); track clock.placeName) {
            <button cdkMenuItem>{{ clock.placeName }}</button>
          }
        </div>
      </ng-template>
    </div>
  `,
  standalone: true,
})
export class AppBarMenu {
  private readonly clockProfiles = inject(ClockBoardDataService).clockProfiles;
  protected readonly recentlyUsedClocks = inject(ClockBoardDataService).recentlyUsedClocks;

  protected readonly numberOfClockProfiles = computed(() => this.clockProfiles().length);
  protected readonly numberOfRecentlyUsedClocks = computed(() => this.recentlyUsedClocks().length);

  protected changeNumberOfColumns() {}
}
