import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject, signal, OnInit } from '@angular/core';
import { CdkDropList, CdkDrag, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ClockProfile } from '@data/data-models/index';

@Component({
  selector: 'app-move-clock-dialog',
  imports: [CdkDropList, CdkDrag],
  templateUrl: './move-clock-dialog.html',
  styleUrls: ['./move-clock-dialog.css'],
})
export class MoveClockDialog implements OnInit {
  protected dialogRef = inject(DialogRef);
  protected clocks = inject<ClockProfile[]>(DIALOG_DATA);

  protected readonly listUnchanged = signal(true);

  private initialClockList: ClockProfile[] = [...this.clocks];

  ngOnInit(): void {
    this.initialClockList = [...this.clocks];
  }

  protected drop(event: CdkDragDrop<ClockProfile[]>): void {
    if (event.previousIndex === event.currentIndex) {
      return;
    }
    moveItemInArray(this.clocks, event.previousIndex, event.currentIndex);
    this.listUnchanged.set(this.arraysEqual(this.clocks, this.initialClockList));
  }

  protected saveChanges(): void {
    this.dialogRef.close(this.clocks);
  }

  private arraysEqual(a: ClockProfile[], b: ClockProfile[]): boolean {
    if (a.length !== b.length) {
      return false;
    }
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        return false;
      }
    }
    return true;
  }
}
