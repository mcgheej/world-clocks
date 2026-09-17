import { Directive, ElementRef, inject, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[tfxAutoFocus]',
})
export class AutoFocusDirective implements AfterViewInit {
  private readonly el = inject<ElementRef<HTMLInputElement>>(ElementRef);

  ngAfterViewInit(): void {
    this.el.nativeElement.focus();
  }
}
