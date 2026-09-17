import { Directive, ElementRef, inject, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[tfxFocusSelect]',
  host: {
    '(focus)': 'onFocus()',
    '(blur)': 'onBlur()',
  },
})
export class FocusSelectDirective {
  private readonly el = inject<ElementRef<HTMLInputElement>>(ElementRef);

  onFocus(): void {
    this.el.nativeElement.select();
  }

  onBlur(): void {
    this.el.nativeElement.setSelectionRange(0, 0);
  }
}
