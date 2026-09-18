import { Directive, effect, ElementRef, inject, input } from '@angular/core';
import type { Rect } from '../data-types';
import { TZDate } from '@date-fns/tz';

@Directive({
  selector: '[tfxClockHands]',
})
export class ClockHandsDirective {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly clockRect = input.required<Rect>();
  readonly localTime = input.required<TZDate>();
  readonly showSeconds = input<boolean>(true);

  constructor() {
    effect(() => {
      this.drawClockHands(this.clockRect(), this.localTime());
    });
  }

  private drawClockHands(viewport: Rect, localTime: TZDate): void {
    const c = (this.elementRef.nativeElement as HTMLCanvasElement).getContext('2d');
    if (!c) {
      return;
    }

    const centerX = viewport.width / 2;
    const centerY = viewport.height / 2;
    const radius = Math.min(viewport.width, viewport.height) / 2;

    const hours = localTime.getHours() % 12;
    const minutes = localTime.getMinutes();
    const seconds = localTime.getSeconds();

    // Clear canvas
    c.clearRect(0, 0, viewport.width, viewport.height);
    c.save();

    // Draw hour hand
    const hourAngle = ((hours + minutes / 60) * Math.PI) / 6 - Math.PI / 2;
    this.drawHand(c, centerX, centerY, hourAngle, radius * 0.5, radius * 0.04, '#1f2933');

    // Draw minute hand
    const minuteAngle = ((minutes + seconds / 60) * Math.PI) / 30 - Math.PI / 2;
    this.drawHand(c, centerX, centerY, minuteAngle, radius * 0.7, radius * 0.03, '#3e4c59');

    // Draw second hand (thinner and red)
    if (this.showSeconds()) {
      const secondAngle = (seconds * Math.PI) / 30 - Math.PI / 2;
      this.drawHand(c, centerX, centerY, secondAngle, radius * 0.75, radius * 0.012, '#e63946');
    }

    // Draw center dot
    c.beginPath();
    c.arc(centerX, centerY, radius * 0.05, 0, Math.PI * 2);
    c.fillStyle = '#1f2933';
    c.fill();

    c.restore();
  }

  private drawHand(
    c: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    angle: number,
    length: number,
    width: number,
    color: string,
  ): void {
    c.beginPath();
    c.moveTo(centerX, centerY);
    c.lineTo(centerX + Math.cos(angle) * length, centerY + Math.sin(angle) * length);
    c.lineWidth = width;
    c.strokeStyle = color;
    c.lineCap = 'round';
    c.stroke();
  }
}
