import { Service, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';

@Service()
export class UTCTimerService {
  readonly utcTime = signal<Date>(this.getUTC());

  constructor() {
    let seconds = new Date().getSeconds();
    interval(200)
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        const newSeconds = new Date().getSeconds();
        if (newSeconds !== seconds) {
          seconds = newSeconds;
          this.utcTime.set(this.getUTC());
        }
      });
  }

  private getUTC(): Date {
    const now = new Date();
    const hours = now.getUTCHours();
    const minutes = now.getUTCMinutes();
    const seconds = now.getUTCSeconds();
    const year = now.getUTCFullYear();
    const month = now.getUTCMonth(); // Months are zero-based
    const day = now.getUTCDate();
    // return { year, month, day, hours, minutes, seconds };
    return new Date(Date.UTC(year, month, day, hours, minutes, seconds));
  }
}
