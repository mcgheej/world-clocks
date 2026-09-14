import { inject, Service } from '@angular/core';
import { ClockProfile } from '@data/data-models/index';
import { RecentlyUsedClocksStoreService } from '@data/storage/index';

const RECENTLY_USED_CLOCKS_CACHE_SIZE = 10;

@Service()
export class RecentlyUsedClocksDataService {
  private readonly recentlyUsedClocksStoreService = inject(RecentlyUsedClocksStoreService);
  readonly recentlyUsedClocks = this.recentlyUsedClocksStoreService.recentlyUsedClocks;

  // Removes a clock profile from the recently used clocks list
  // using immutable update pattern if the clock profile place
  // name matches an entry in the recently used list.
  removeClockProfile(clockProfile: ClockProfile): void {
    const current = this.recentlyUsedClocks();
    const updated = current.filter((c) => c.placeName !== clockProfile.placeName);
    this.recentlyUsedClocksStoreService.saveRecentlyUsedClocks(updated);
  }

  // Adds a clock profile to the recently used clocks list
  // using immutable update pattern. If the profile already exists
  // in the list, it is not added again. If the list exceeds the
  // cache size, the oldest entry is removed.
  addClockProfile(clockProfile: ClockProfile): void {
    const current = [...this.recentlyUsedClocks()];
    if (current.findIndex((c) => c.placeName === clockProfile.placeName) !== -1) {
      return;
    }
    if (current.length >= RECENTLY_USED_CLOCKS_CACHE_SIZE) {
      current.pop();
    }
    current.unshift(clockProfile);
    this.recentlyUsedClocksStoreService.saveRecentlyUsedClocks(current);
  }
}
