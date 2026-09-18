import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { ClockProfile } from '@data/data-models/index';
import { Observable } from 'rxjs';
import { MoveClockDialog } from './move-clock-dialog';

export function openMoveClockDialog(
  dialog: Dialog,
  clocks: ClockProfile[],
): Observable<ClockProfile[] | undefined> {
  const dialogRef: DialogRef<ClockProfile[], MoveClockDialog> = dialog.open(MoveClockDialog, {
    width: '375px',
    height: 'auto',
    maxHeight: '90%',
    data: [...clocks],
  });
  return dialogRef.closed;
}
