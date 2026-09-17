import { computed, inject, Service } from '@angular/core';
import { ClockProfile } from '@data/data-models/index';
import { ClockBoardStoreService } from '@data/storage/index';
import { RecentlyUsedClocksDataService } from './recently-used-clocks-data-service';

@Service()
export class ClockBoardDataService {
  private readonly clockBoardStoreService = inject(ClockBoardStoreService);
  private readonly recentlyUsedClocksService = inject(RecentlyUsedClocksDataService);

  readonly clockBoardConfig = this.clockBoardStoreService.clockBoardConfig;

  readonly numberOfColumns = computed(() => this.clockBoardConfig().numberOfColumns);
  readonly clockProfiles = computed(() => this.clockBoardConfig().clockProfiles);
  readonly recentlyUsedClocks = this.recentlyUsedClocksService.recentlyUsedClocks;

  // Updates the number of columns in the clock board configuration
  // using immutable update pattern
  updateNumberOfColumns(columns: number): void {
    const updatedConfig = {
      ...this.clockBoardConfig(),
      numberOfColumns: columns,
    };
    this.clockBoardStoreService.saveClockBoardConfig(updatedConfig);
  }

  // Adds a new clock profile to the clock board configuration
  // using immutable update pattern. Also removes any entry
  // from the recently used clocks list if the place name exists
  // there.
  addClockProfile(clockProfile: ClockProfile): void {
    const updatedConfig = {
      ...this.clockBoardConfig(),
      clockProfiles: [...this.clockBoardConfig().clockProfiles, clockProfile],
    };
    this.clockBoardStoreService.saveClockBoardConfig(updatedConfig);
    this.recentlyUsedClocksService.removeClockProfile(clockProfile);
  }

  // Updates the clock profile at the specified index in the clock board configuration
  // using immutable update pattern. The profile being replaced is pushed to the
  // recently used clocks list and the new profile is removed from the cache list, if
  // present.
  updateClockProfile(index: number, clockProfile: ClockProfile): void {
    const currentConfig = this.clockBoardConfig();
    const replacedProfile = currentConfig.clockProfiles[index];
    const updatedConfig = {
      ...currentConfig,
      clockProfiles: currentConfig.clockProfiles.map((c, i) => (i === index ? clockProfile : c)),
    };
    this.clockBoardStoreService.saveClockBoardConfig(updatedConfig);
    this.recentlyUsedClocksService.removeClockProfile(clockProfile);
    this.recentlyUsedClocksService.addClockProfile(replacedProfile);
  }

  // Deletes the clock profile at the specified index in the clock board configuration
  // using immutable update pattern. The deleted profile is added to the recently used
  // clocks list.
  deleteClockProfile(index: number): void {
    const currentConfig = this.clockBoardConfig();
    if (
      currentConfig.clockProfiles.length <= 1 ||
      index < 0 ||
      index >= currentConfig.clockProfiles.length
    ) {
      return;
    }
    const deletedProfile = currentConfig.clockProfiles[index];
    const updatedConfig = {
      ...currentConfig,
      clockProfiles: currentConfig.clockProfiles.filter((_, i) => i !== index),
    };
    this.clockBoardStoreService.saveClockBoardConfig(updatedConfig);
    this.recentlyUsedClocksService.addClockProfile(deletedProfile);
  }

  // Rearranges the clock profiles in the clock board configuration
  // using the provided array of clock profiles. The update is done
  // using immutable update pattern. The provided array should have
  // the same entries as the current clock board configuration, just
  // in a different order.
  rearrangeClockProfiles(clocks: ClockProfile[]): void {
    const currentConfig = this.clockBoardConfig();
    if (clocks.length !== currentConfig.clockProfiles.length) {
      return;
    }

    // Loop through the provided clocks array and ensure each clock exists in the current configuration.
    for (let i = 0; i < clocks.length; i++) {
      if (
        currentConfig.clockProfiles.findIndex((c) => c.placeName === clocks[i].placeName) === -1
      ) {
        return;
      }
    }
    const updatedConfig = {
      ...currentConfig,
      clockProfiles: clocks,
    };
    this.clockBoardStoreService.saveClockBoardConfig(updatedConfig);
  }
}
