import { Component, signal } from '@angular/core';
import { AppBar } from '@ui/app-bar/index';

@Component({
  imports: [AppBar],
  selector: 'app-root',
  template: `
    <div class="app-container">
      <tfx-app-bar />
      <h1>Hello, {{ title() }}</h1>
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
  protected readonly title = signal('angular-app');
}
