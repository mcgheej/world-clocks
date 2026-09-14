import { Service, signal } from '@angular/core';
import { ClockProfile } from '@data/data-models/index';

const RECENTLY_USED_CLOCKS_KEY = 'world-clocks.recentlyUsedClocks';

const initialRecentlyUsed: ClockProfile[] = [
  {
    placeName: 'Mumbai',
    ianaTimezone: 'Asia/Kolkata',
    withHighlight: false,
    withSeconds: false,
  },
  {
    placeName: 'Seoul',
    ianaTimezone: 'Asia/Seoul',
    withHighlight: false,
    withSeconds: false,
  },
  {
    placeName: 'Auckland',
    ianaTimezone: 'Pacific/Auckland',
    withHighlight: false,
    withSeconds: false,
  },
];

@Service()
export class RecentlyUsedClocksStoreService {
  private _recentlyUsedClocks = signal<ClockProfile[]>(initialRecentlyUsed);
  readonly recentlyUsedClocks = this._recentlyUsedClocks.asReadonly();

  constructor() {
    try {
      const stored = localStorage.getItem(RECENTLY_USED_CLOCKS_KEY);
      stored
        ? this._recentlyUsedClocks.set(JSON.parse(stored) as ClockProfile[])
        : this.saveRecentlyUsedClocks(initialRecentlyUsed);
    } catch {
      this.saveRecentlyUsedClocks(initialRecentlyUsed);
    }
  }

  saveRecentlyUsedClocks(clocks: ClockProfile[]) {
    try {
      localStorage.setItem(RECENTLY_USED_CLOCKS_KEY, JSON.stringify(clocks));
      this._recentlyUsedClocks.set(clocks);
    } catch (err) {
      console.error('Failed to save recently used clocks', err);
    }
  }
}
