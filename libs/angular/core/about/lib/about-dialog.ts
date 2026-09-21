import { Component } from '@angular/core';

@Component({
  selector: 'tfx-about-dialog',
  template: `
    <h2>World Clocks</h2>
    <p>Version 1.0.0</p>
  `,
  styles: [
    `
      :host {
        display: block;
        background: #fff;
        color: CanvasText;
        border-radius: 8px;
        padding: 8px 16px 16px;
        width: 100%;
        height: 100%;
        overflow: auto;
      }

      h2 {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 20px;
      }
      p {
        width: 100%;
        font-size: 14px;
        text-align: center;
      }
    `,
  ],
})
export class AboutDialog {}
