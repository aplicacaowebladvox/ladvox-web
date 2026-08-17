import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BaseCardTableActionConfig } from '../config/base-card-table-action.config';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pick-card-table-action-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './pick-card-table-action-modal.component.html',
  styleUrl: './pick-card-table-action-modal.component.scss',
})
export class PickCardTableActionModalComponent {
  constructor(
    public dialogRef: MatDialogRef<PickCardTableActionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { actions: BaseCardTableActionConfig[]; item: any }
  ) {}

  choose(action: BaseCardTableActionConfig): void {
    this.dialogRef.close(action);
  }
}
