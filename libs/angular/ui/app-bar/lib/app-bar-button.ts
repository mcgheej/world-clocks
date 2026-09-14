/**
 * AppBarButton
 * ------------
 * A simple icon button that can be placed on the application's
 * command bar. The component uses the Angular Material library,
 * specifically the MatIconModule.
 */
import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'tfx-app-bar-button',
  imports: [MatIconModule],
  template: `
    <div class="bar-button" (click)="onButtonClick($event)">
      <div class="icon-container">
        <mat-icon [fontIcon]="iconName()"></mat-icon>
      </div>
    </div>
  `,
  styles: [
    `
      .bar-button {
        height: 100%;
        width: 28px;
        display: grid;
        place-items: center;
      }

      mat-icon {
        transform: scale(0.75);
      }

      .icon-container {
        height: 88%;
        width: 100%;
        display: grid;
        place-items: center;
      }

      .icon-container:hover {
        cursor: pointer;
        background-color: var(--mat-sys-primary-fixed-dim);
        color: var(--mat-sys-on-primary-fixed-variant);
      }
    `,
  ],
})
export class AppBarButton {
  readonly iconName = input.required<string>();
  readonly preventDefault = input<boolean>(true);
  readonly stopPropagation = input<boolean>(true);
  readonly buttonClick = output<void>();

  protected onButtonClick(ev: MouseEvent): void {
    if (this.stopPropagation()) {
      ev.stopPropagation();
    }
    if (this.preventDefault()) {
      ev.preventDefault();
    }
    this.buttonClick.emit();
  }
}
