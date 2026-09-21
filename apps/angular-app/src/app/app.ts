import { Component, inject, signal } from '@angular/core';
import { AboutService } from '@core/about/index';
import { ClockBoard } from '@features/clock-board/index';
import { AppBar } from '@ui/app-bar/index';

@Component({
  imports: [AppBar, ClockBoard],
  selector: 'app-root',
  template: `
    <div class="app-container">
      <tfx-app-bar />
      <tfx-clock-board />
    </div>
  `,
  styles: [
    `
      .app-container {
        height: 100%;
        width: 100%;
        display: grid;
        grid-template-rows: auto minmax(0, 1fr);
      }
    `,
  ],
})
export class App {
  private readonly aboutService = inject(AboutService);
  protected readonly title = signal('angular-app');
}
