import { Directive, ElementRef, inject, input, effect, computed } from '@angular/core';
import { Rect } from '../data-types';

@Directive({
  selector: '[tfxClockBackground]',
})
export class ClockBackgroundDirective {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly clockRect = input.required<Rect>();
  readonly highlightClock = input<boolean>(false);

  constructor() {
    effect(() => {
      this.drawClockFace(this.clockRect(), this.highlightClock());
    });
  }

  private drawClockFace(viewport: Rect, highlightClock: boolean): void {
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

    // Draw outer bezel with metallic gradient
    const bezelGradient = c.createRadialGradient(
      centerX - radius * 0.2,
      centerY - radius * 0.2,
      radius * 0.1,
      centerX,
      centerY,
      radius,
    );
    if (highlightClock) {
      bezelGradient.addColorStop(0, '#eef2f5');
      bezelGradient.addColorStop(0.38, '#c8d0d7');
      bezelGradient.addColorStop(0.72, '#7f8b96');
      bezelGradient.addColorStop(1, '#4f5b66');
    } else {
      bezelGradient.addColorStop(0, '#ffffff');
      bezelGradient.addColorStop(0.35, '#f4f7fa');
      bezelGradient.addColorStop(0.68, '#d7dde3');
      bezelGradient.addColorStop(1, '#9ea9b3');
    }

    c.beginPath();
    c.arc(centerX, centerY, radius * 0.98, 0, Math.PI * 2);
    c.fillStyle = bezelGradient;
    c.fill();
    c.lineWidth = radius * 0.03;
    c.strokeStyle = highlightClock ? '#394651' : '#c8d3dc';
    c.stroke();

    // Draw clock face/dial with subtle gradient
    const dialGradient = c.createRadialGradient(
      centerX - radius * 0.25,
      centerY - radius * 0.3,
      radius * 0.05,
      centerX,
      centerY,
      radius * 0.88,
    );
    dialGradient.addColorStop(0, '#ffffff');
    dialGradient.addColorStop(1, '#eef2f5');

    c.beginPath();
    c.arc(centerX, centerY, radius * 0.88, 0, Math.PI * 2);
    c.fillStyle = dialGradient;
    c.fill();
    c.lineWidth = radius * 0.008;
    c.strokeStyle = '#d2d9df';
    c.stroke();

    // Draw tick marks (60 total: 12 hours + 48 minutes)
    for (let i = 0; i < 60; i++) {
      const angle = ((i - 15) * Math.PI) / 30;
      const isHourMark = i % 5 === 0;
      const markLength = isHourMark ? radius * 0.12 : radius * 0.06;
      const outer = radius * 0.82;
      const inner = outer - markLength;

      c.beginPath();
      c.moveTo(centerX + Math.cos(angle) * inner, centerY + Math.sin(angle) * inner);
      c.lineTo(centerX + Math.cos(angle) * outer, centerY + Math.sin(angle) * outer);
      c.lineWidth = isHourMark ? radius * 0.02 : radius * 0.007;
      c.strokeStyle = isHourMark ? '#1f2933' : '#9aa5af';
      c.lineCap = 'round';
      c.stroke();
    }

    // Draw numbers 1-12
    c.fillStyle = '#1f2933';
    c.font = `600 ${Math.max(8, Math.round(radius * 0.12))}px system-ui, -apple-system, "Segoe UI", Arial, sans-serif`;
    c.textAlign = 'center';
    c.textBaseline = 'middle';

    for (let number = 1; number <= 12; number++) {
      const angle = ((number - 3) * Math.PI) / 6;
      const numberRadius = radius * 0.62;
      const x = centerX + Math.cos(angle) * numberRadius;
      const y = centerY + Math.sin(angle) * numberRadius;
      c.fillText(String(number), x, y);
    }

    // Draw center cap
    c.beginPath();
    c.arc(centerX, centerY, radius * 0.06, 0, Math.PI * 2);
    c.fillStyle = '#f8fafc';
    c.fill();
    c.lineWidth = radius * 0.012;
    c.strokeStyle = '#556270';
    c.stroke();

    c.restore();
  }
}
