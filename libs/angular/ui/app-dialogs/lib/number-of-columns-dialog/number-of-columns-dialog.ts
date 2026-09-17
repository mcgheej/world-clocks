import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject, signal } from '@angular/core';
import { form, FormField, max, min, required } from '@angular/forms/signals';
import { FocusSelectDirective } from '../focus-select-directive';

interface FormData {
  numberOfColumns: number | null;
}

@Component({
  selector: 'app-number-of-columns-dialog',
  imports: [FormField, FocusSelectDirective],
  templateUrl: './number-of-columns-dialog.html',
  styleUrl: './number-of-columns-dialog.css',
})
export class NumberOfColumnsDialog {
  protected dialogRef = inject(DialogRef);
  private data = inject<{ numberOfColumns: number }>(DIALOG_DATA);

  protected formData = signal<FormData>({
    numberOfColumns: this.data.numberOfColumns,
  });

  protected numberOfColumnsForm = form(this.formData, (s) => {
    required(s.numberOfColumns, { message: 'Number of columns is required' });
    min(s.numberOfColumns, 1, { message: 'Number of columns must be at least 1' });
    max(s.numberOfColumns, 5, { message: 'Number of columns must be at most 5' });
  });

  protected onNumberOfColumnsKeydown(ev: KeyboardEvent): void {
    const allowedKeys = [
      'Backspace',
      'Delete',
      'Tab',
      'Escape',
      'Enter',
      'ArrowLeft',
      'ArrowRight',
    ];

    if (allowedKeys.includes(ev.key)) {
      return;
    }

    if (!/^\d$/.test(ev.key)) {
      ev.preventDefault();
    }
  }
}
