import { Component, computed, inject, signal } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { debounce, form, FormField, required, validate } from '@angular/forms/signals';
import { TZDate } from '@date-fns/tz';
import { ClockProfile } from '@data/data-models/index';
import { ClockBoardDataService } from '@data/data-layer/index';

export interface ClockDialogData {
  createOrEdit: 'create' | 'edit';
  clock: ClockProfile;
  clockIndex?: number;
}

export type ClockDialogResult =
  { operation: 'save'; clock: ClockProfile } | { operation: 'delete' };

interface FormData {
  placeName: string;
  ianaTimezone: string;
  withHighlight: boolean;
  withSeconds: boolean;
}

@Component({
  selector: 'tfx-clock-dialog',
  imports: [FormField],
  templateUrl: './clock-dialog.html',
  styleUrls: ['./clock-dialog.css'],
})
export class ClockDialog {
  protected dialogRef = inject(DialogRef);
  protected clockDialogData = inject<ClockDialogData>(DIALOG_DATA);
  private readonly clockBoardDataService = inject(ClockBoardDataService);
  private readonly clockProfiles = this.clockBoardDataService.clockProfiles;
  private readonly recentlyUsedClocks = this.clockBoardDataService.recentlyUsedClocks;

  protected readonly dialogTitle = computed(() => {
    return this.clockDialogData.createOrEdit === 'create' ? 'Add Clock' : 'Edit Clock';
  });

  protected numberOfClocks = computed(() => this.clockProfiles().length);

  protected formData = signal<FormData>({
    placeName: this.clockDialogData.clock.placeName,
    ianaTimezone: this.clockDialogData.clock.ianaTimezone,
    withHighlight: this.clockDialogData.clock.withHighlight,
    withSeconds: this.clockDialogData.clock.withSeconds,
  });

  protected clockForm = form(this.formData, (s) => {
    required(s.placeName, { message: 'Place name is required' });
    required(s.ianaTimezone, { message: 'Time zone is required' });
    validate(s.ianaTimezone, ({ value }) => {
      const t = TZDate.tz(value());
      if (isNaN(t.valueOf())) {
        return { kind: 'invalidTimeZone', message: 'Invalid IANA time zone' };
      }
      return null;
    });
    validate(s.placeName, ({ value }) => {
      const currentClockIndex = this.clockDialogData.clockIndex ?? -1;
      for (let i = 0; i < this.numberOfClocks(); i++) {
        if (i !== currentClockIndex && this.clockProfiles()[i].placeName === value()) {
          return { kind: 'duplicatePlaceName', message: 'Place name must be unique' };
        }
      }
      for (let i = 0; i < this.recentlyUsedClocks().length; i++) {
        if (this.recentlyUsedClocks()[i].placeName === value()) {
          return { kind: 'cacheClash', message: 'Place name is in cache' };
        }
      }
      return null;
    });
    debounce(s.ianaTimezone, 500);
    // debounce(s.placeName, 500);
  });

  protected saveClock(): void {
    if (this.clockForm().dirty()) {
      this.dialogRef.close({ operation: 'save', clock: this.clockForm().value() });
    } else {
      console.log('No changes made');
      this.dialogRef.close();
    }
  }
}
