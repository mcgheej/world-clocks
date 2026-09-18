import { ClockDialog, ClockDialogData, ClockDialogResult } from './clock-dialog';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Observable } from 'rxjs';

export interface NewClockDialogData {
  dialog: Dialog;
}

export function openNewClockDialog(dialog: Dialog): Observable<ClockDialogResult | undefined> {
  const dialogRef: DialogRef<ClockDialogResult, ClockDialog> = dialog.open(ClockDialog, {
    width: '375px',
    height: '400px',
    data: {
      createOrEdit: 'create',
      clock: {
        placeName: '',
        ianaTimezone: '',
        withHighlight: false,
        withSeconds: false,
      },
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
