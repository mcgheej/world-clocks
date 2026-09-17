import { Service, signal } from '@angular/core';
import { ClockBoardConfig } from '@data/data-models/index';

const CLOCK_BOARD_KEY = 'world-clocks.clockBoardConfig';

const initialClockBoardConfig: ClockBoardConfig = {
  numberOfColumns: 3,
  clockProfiles: [
    {
      placeName: 'London',
      ianaTimezone: 'Europe/London',
      withHighlight: true,
      withSeconds: true,
    },
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
  ],
};

@Service()
export class ClockBoardStoreService {
  private _clockBoardConfig = signal<ClockBoardConfig>(initialClockBoardConfig);
  readonly clockBoardConfig = this._clockBoardConfig.asReadonly();

  constructor() {
    try {
      // TODO: Implement retrieval from localStorage when ready
      // const rawClockBoardConfig = localStorage.getItem(CLOCK_BOARD_KEY);
      const rawClockBoardConfig = null;
      rawClockBoardConfig
        ? this._clockBoardConfig.set(JSON.parse(rawClockBoardConfig) as ClockBoardConfig)
        : this.saveClockBoardConfig(initialClockBoardConfig);
    } catch {
      this.saveClockBoardConfig(initialClockBoardConfig);
    }
  }

  saveClockBoardConfig(config: ClockBoardConfig) {
    try {
      localStorage.setItem(CLOCK_BOARD_KEY, JSON.stringify(config));
      this._clockBoardConfig.set(config);
    } catch (err) {
      console.error('Failed to save clock board config', err);
    }
  }
}
