import { ClockProfile } from '@data/data-models/index';
import { ClockDialog, ClockDialogData, ClockDialogResult } from './clock-dialog';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Observable } from 'rxjs';

export interface EditClockDialogData {
  clockProfile: ClockProfile;
  clockIndex: number;
  dialog: Dialog;
}

export function openEditClockDialog({
  clockProfile,
  clockIndex,
  dialog,
}: EditClockDialogData): Observable<ClockDialogResult | undefined> {
  const dialogRef: DialogRef<ClockDialogResult, ClockDialog> = dialog.open(ClockDialog, {
    width: '375px',
    height: '400px',
    data: {
      createOrEdit: 'edit',
      clock: {
        placeName: clockProfile.placeName,
        ianaTimezone: clockProfile.ianaTimezone,
        withHighlight: clockProfile.withHighlight,
        withSeconds: clockProfile.withSeconds,
      },
      clockIndex,
    } as ClockDialogData,
  });

  return dialogRef.closed;
  // dialogRef.closed.subscribe((result) => {
  //   if (result) {
  //     if (result.operation === 'save') {
  //       appSettingsService.updateClock(clockIndex, result.clock);
  //     } else if (result.operation === 'delete') {
  //       appSettingsService.deleteClock(clockIndex);
  //     }
  //   }
  // });
}
