import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TherapeuticPlanStore } from '../../../core/stores/therapeutic-plan.store';
import { SelectOptionExtraAttributeModel } from '../../../core/models/select-option.model';
import { AvatarModule } from 'primeng/avatar';
import { ConvertUtils } from '../../shared/utils/convert.utils';
import { finalize } from 'rxjs';
import { alertApiError } from '../../../core/operators/api-alert-error.operator';

@Component({
  selector: 'app-select-new-therapist-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, AvatarModule],
  templateUrl: './select-new-therapist-modal.component.html',
  styleUrl: './select-new-therapist-modal.component.scss',
  providers: [TherapeuticPlanStore],
})
export class SelectNewTherapistModalComponent {
  isLoading: boolean = false;
  therapists: SelectOptionExtraAttributeModel<string, string, string>[] = [];
  generateInitials = ConvertUtils.generateInitials;
  constructor(
    public dialogRef: MatDialogRef<SelectNewTherapistModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      therapeuticPlanId: number;
      medicalAppointmentId: number;
      currentEditorId: string;
    },
    private therapeuticPlanStore: TherapeuticPlanStore
  ) {
    this.therapeuticPlanStore
      .loadTherapists(data.therapeuticPlanId, data.medicalAppointmentId)
      .subscribe((therapists) => {
        this.therapists = therapists;
      });
  }

  selectTherapist(newUserEditorId: string): void {
    this.isLoading = true;
    this.therapeuticPlanStore
      .changeCurrentEditor(
        this.data.therapeuticPlanId,
        this.data.medicalAppointmentId,
        newUserEditorId
      )
      .pipe(
        finalize(() => (this.isLoading = false)),
        alertApiError()
      )
      .subscribe({
        next: () => this.dialogRef.close(newUserEditorId),
      });
  }
}
