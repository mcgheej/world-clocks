import { Dialog } from '@angular/cdk/dialog';
import { NumberOfColumnsDialog } from '@ui/app-dialogs/index';
import { Observable } from 'rxjs';

export function editNumberOfColumns(
  currentNumberOfColumns: number,
  dialog: Dialog,
): Observable<number | undefined> {
  const dialogRef = dialog.open<number>(NumberOfColumnsDialog, {
    width: '275px',
    height: '225px',
    data: { numberOfColumns: currentNumberOfColumns },
  });
  return dialogRef.closed;
}
