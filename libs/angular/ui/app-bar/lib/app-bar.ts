/**
 * AppBar Component
 * ----------------
 * A command bar designed to sit at the top of an Electron application window. The
 * initial configuration provides a menu button, Application title, and window control buttons.
 * The menu button is intended to provide access to the application's main menu, which
 * is initially configured to have a single menu item - "Exit". The window control
 * buttons provide standard window management functionality such as minimize, maximize, and close.
 * The bar is also configured to repond to drag operations, allowing the user to move the
 * application window by dragging the bar itself.
 */

import { Component, inject } from '@angular/core';
import { AppBarButton } from './app-bar-button';
import { AppBarMenu } from './app-bar-menu';
import { ElectronApiService } from '@electron-api/index';
import { CdkMenuTrigger } from '@angular/cdk/menu';

@Component({
  selector: 'tfx-app-bar',
  imports: [CdkMenuTrigger, AppBarButton, AppBarMenu],
  template: `
    <nav class="app-bar">
      <tfx-app-bar-button
        iconName="menu"
        [stopPropagation]="false"
        [cdkMenuTriggerFor]="appMenu"
      ></tfx-app-bar-button>
      <div class="app-bar-title app-bar-drag">World Clocks</div>
      @if (electronApi() !== null) {
        <tfx-app-bar-button iconName="remove" (buttonClick)="minimizeWindow()"></tfx-app-bar-button>
        @if (windowMaximized()) {
          <tfx-app-bar-button
            iconName="filter_none"
            (buttonClick)="restoreDownWindow()"
          ></tfx-app-bar-button>
        } @else {
          <tfx-app-bar-button
            iconName="crop_square"
            (buttonClick)="maximizeWindow()"
          ></tfx-app-bar-button>
        }
        <tfx-app-bar-button iconName="close" (buttonClick)="closeApp()"></tfx-app-bar-button>
      }
      <ng-template #appMenu>
        <tfx-app-bar-menu></tfx-app-bar-menu>
      </ng-template>
    </nav>
  `,
  styles: [
    `
      .app-bar {
        display: grid;
        grid-template-columns: auto 1fr repeat(3, auto);
        height: 32px;
        background-color: var(--mat-sys-primary);
        color: var(--mat-sys-on-primary);
        padding-inline: 8px;
      }

      .app-bar-title {
        align-self: center;
        font: var(--mat-sys-title-medium);
        letter-spacing: var(--mat-sys-title-medium-tracking);
        padding-inline: 8px;
      }
    `,
  ],
})
export class AppBar {
  private readonly electronIF = inject(ElectronApiService);

  protected readonly electronApi = this.electronIF.electronApi;
  protected readonly windowMaximized = this.electronIF.windowMaximized;

  protected minimizeWindow(): void {
    this.electronApi()?.minimizeWindow();
  }

  protected restoreDownWindow(): void {
    this.electronApi()?.restoreDownWindow();
  }

  protected maximizeWindow(): void {
    this.electronApi()?.maximizeWindow();
  }

  protected closeApp(): void {
    this.electronApi()?.closeWindow();
  }
}
