import { Service, signal } from '@angular/core';
import { ClockProfile } from '@data/data-models/index';

const RECENTLY_USED_CLOCKS_KEY = 'world-clocks.recentlyUsedClocks';

const initialRecentlyUsed: ClockProfile[] = [
  {
    placeName: 'Paris',
    ianaTimezone: 'Europe/Paris',
    withHighlight: false,
    withSeconds: false,
  },
  {
    placeName: 'Barcelona',
    ianaTimezone: 'Europe/Madrid',
    withHighlight: false,
    withSeconds: false,
  },
  {
    placeName: 'New York',
    ianaTimezone: 'America/New_York',
    withHighlight: false,
    withSeconds: false,
  },
  {
    placeName: 'Chicago',
    ianaTimezone: 'America/Chicago',
    withHighlight: false,
    withSeconds: false,
  },
  {
    placeName: 'Seattle',
    ianaTimezone: 'America/Los_Angeles',
    withHighlight: false,
    withSeconds: false,
  },
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
