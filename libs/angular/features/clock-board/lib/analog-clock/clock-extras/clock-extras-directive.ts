import { Directive, effect, ElementRef, inject, input } from '@angular/core';
import { Rect } from '../data-types';
import { TZDate } from '@date-fns/tz';

@Directive({
  selector: '[tfxClockExtras]',
})
export class ClockExtrasDirective {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly clockRect = input.required<Rect>();
  readonly localTime = input.required<TZDate>();

  constructor() {
    effect(() => {
      this.drawClockExtras(this.clockRect(), this.localTime());
    });
  }

  private drawClockExtras(viewport: Rect, localTime: TZDate): void {
    const c = (this.elementRef.nativeElement as HTMLCanvasElement).getContext('2d');
    if (!c) {
      return;
    }

    const centerX = viewport.width / 2;
    const centerY = viewport.height / 2;
    const radius = Math.min(viewport.width, viewport.height) / 2;

    // Clear canvas
    c.clearRect(0, 0, viewport.width, viewport.height);
    c.save();

    // Calculate anchor point for date display
    const aX = centerX;
    const aY = centerY - radius * 0.5;

    // Draw date digit bounding boxes
    const boxWidth = radius * 0.08;
    const boxHeight = radius * 0.12;
    c.lineWidth = radius * 0.007;
    c.strokeStyle = '#9aa5af';
    c.lineCap = 'round';
    c.beginPath();
    c.moveTo(aX - boxWidth - 1, aY);
    c.lineTo(aX - boxWidth - 1, aY + boxHeight);
    c.lineTo(aX - 1, aY + boxHeight);
    c.lineTo(aX - 1, aY);
    c.lineTo(aX - boxWidth - 1, aY);
    c.stroke();

    c.beginPath();
    c.moveTo(aX + 1, aY);
    c.lineTo(aX + 1, aY + boxHeight);
    c.lineTo(aX + boxWidth + 1, aY + boxHeight);
    c.lineTo(aX + boxWidth + 1, aY);
    c.lineTo(aX + 1, aY);
    c.stroke();

    // Add date numbers
    const dayDate = localTime.getDate();
    c.fillStyle = '#9aa5af';
    c.font = `600 ${Math.max(10, Math.round(radius * 0.08))}px system-ui, -apple-system, "Segoe UI", Arial, sans-serif`;
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    const digit1 = Math.floor(dayDate / 10);
    const digit2 = dayDate % 10;
    c.fillText(digit1.toString(), aX - 1 - boxWidth / 2, aY + 1 + boxHeight / 2);
    c.fillText(digit2.toString(), aX + 1 + boxWidth / 2, aY + 1 + boxHeight / 2);

    // Calculate anchor point for day part display
    const pX = centerX;
    const pY = centerY + radius * 0.6;

    c.fillStyle = '#9aa5af';
    c.font = `600 ${Math.max(6, Math.round(radius * 0.06))}px system-ui, -apple-system, "Segoe UI", Arial, sans-serif`;
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    if (localTime.getHours() < 12) {
      c.fillText('AM', pX - radius * 0.15, pY);
    } else {
      c.fillText('PM', pX + radius * 0.15, pY);
    }

    c.restore();
  }

  private drawClockDayPart(viewport: Rect, localTime: TZDate): void {
    const c = (this.elementRef.nativeElement as HTMLCanvasElement).getContext('2d');
    if (!c) {
      return;
    }

    const centerX = viewport.width / 2;
    const centerY = viewport.height / 2;
    const radius = Math.min(viewport.width, viewport.height) / 2;

    // Calculate anchor point for day part display
    const aX = centerX;
    const aY = centerY + radius * 0.6;

    // Clear canvas
    c.clearRect(0, 0, viewport.width, viewport.height);
    c.save();

    c.fillStyle = '#9aa5af';
    c.font = `600 ${Math.max(12, Math.round(radius * 0.08))}px system-ui, -apple-system, "Segoe UI", Arial, sans-serif`;
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    if (localTime.getHours() < 12) {
      c.fillText('AM', aX - radius * 0.15, aY);
    } else {
      c.fillText('PM', aX + radius * 0.15, aY);
    }

    c.restore();
  }
}
