import { AnamnesisPatientAttachmentModel } from './../../../../models/anamnesis-patient-attachment.model';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  AnamnesisPatientModel,
  AnamnesisPatientModelOfForm,
  FormOfAnamnesisPatientModel,
} from './../../../../models/anamnesis-patient.model';
import { CommonModule, Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { EditorModule } from 'primeng/editor';
import { FileUploadComponent } from '../../../../core/components/file-upload/file-upload.component';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../../../../core/services/alert.provided.service';
import { AuthService } from '../../../authentication/services/auth.service';
import { AnamnesisPatientStore } from '../../../../core/stores/anamnesis-patient.store';
import { HasPermissionDirective } from '../../../../core/has-permission.directive';
import { error } from 'console';
import { AnamnesisPatientAttachmentStore } from '../../../../core/stores/anamnesis-patient-attachment.store';
import { AttachmentModel } from '../../../../models/attachment.model';
import { PatientStore } from '../../../../core/stores/patient.store';
import { LoadingComponent } from '../../../../core/components/loading/loading.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { finalize } from 'rxjs';
import { alertApiError } from '../../../../core/operators/api-alert-error.operator';

@Component({
  selector: 'app-patients-anamnesis-form',
  standalone: true,
  imports: [
    CommonModule,
    EditorModule,
    FileUploadComponent,
    ReactiveFormsModule,
    HasPermissionDirective,
    LoadingComponent,
    NgxSkeletonLoaderModule,
  ],
  templateUrl: './patients-anamnesis-form.component.html',
  styleUrl: './patients-anamnesis-form.component.scss',
  providers: [AnamnesisPatientStore, AnamnesisPatientAttachmentStore, PatientStore],
})
export class PatientsAnamnesisFormComponent implements OnInit {
  @Input()
  id!: number;
  @Input()
  anamnesisId?: number;
  isLoading: boolean = false;
  patientName!: string | undefined;
  form!: FormGroup;

  private _attachments: AnamnesisPatientAttachmentModel[] = [];
  get attachmentsModel(): AttachmentModel[] {
    return this._attachments.map((a) => a.attachment);
  }

  private _editing: boolean | null = false;
  private _hasPermissionFormEdit: boolean = false;
  get editing(): boolean | null {
    return this._editing;
  }
  attachmentStore = this.anamnesisPatientAttachmentStore;
  constructor(
    private anamnesisPatientStore: AnamnesisPatientStore,
    private patientStore: PatientStore,

    private anamnesisPatientAttachmentStore: AnamnesisPatientAttachmentStore,
    private location: Location,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this._hasPermissionFormEdit = this.authService.hasPermission('paciente.anamnese.form.edit');
    this.activatedRoute.queryParams.pipe(alertApiError()).subscribe({
      next: (params) => {
        this._editing = params['editing'] == undefined ? null : params['editing'] == 'true';
        if (this.editing && !this._hasPermissionFormEdit) this.location.back();
        this.patientStore
          .getSelectOptions(this.id)
          .pipe(alertApiError())
          .subscribe({
            next: (options) =>
              (this.patientName = options && options.length > 0 ? options[0].name : undefined),
          });
        this._loadPage();
      },
    });
  }
  canShow(item: string): boolean {
    switch (item) {
      case 'buttonCreate':
        return !this.anamnesisId;
      case 'buttonSave':
        return !!this.anamnesisId;
    }
    return false;
  }

  clickBack(): void {
    this.router.navigate(['pacientes', this.id, 'anamnese']);
  }
  clickCreate(): void {
    this.isLoading = true;
    this.anamnesisPatientStore
      .insert(AnamnesisPatientModelOfForm(this.form))
      .pipe(
        finalize(() => (this.isLoading = false)),
        alertApiError()
      )
      .subscribe({
        next: (model) => {
          this.router.navigate(['pacientes', this.id, 'anamnese', model.id]);
          this.router.navigate([this.id], { relativeTo: this.activatedRoute });
        },
      });
  }
  clickSave(): void {
    this.isLoading = true;
    this.anamnesisPatientStore
      .update(this.anamnesisId!, AnamnesisPatientModelOfForm(this.form))
      .pipe(
        finalize(() => (this.isLoading = false)),
        alertApiError()
      )
      .subscribe({
        next: () => {
          this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: { patientName: this.patientName },
          });
        },
      });
  }
  clickEnableEdit(): void {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { editing: true, patientName: this.patientName },
    });
  }
  onEntityIdGenerated(anamnesisPatientId: number | string): void {
    this.anamnesisId = <number>anamnesisPatientId;
    this.form.controls['id'].setValue(this.anamnesisId);
  }
  private _loadPage(): void {
    if (!this.anamnesisId) {
      this.form = FormOfAnamnesisPatientModel({ patientId: this.id } as AnamnesisPatientModel);
      this._changeFormControlStatus(this.form, true);
    } else {
      this.anamnesisPatientStore
        .getById(this.anamnesisId)
        .pipe(alertApiError())
        .subscribe({
          next: (anamnesisPatient: AnamnesisPatientModel) => {
            this.form = FormOfAnamnesisPatientModel(anamnesisPatient);
            this._changeFormControlStatus(this.form, !!this.editing);
          },
        });
    }
  }
  private _changeFormControlStatus(f: FormGroup, enable: boolean = false): void {
    enable ? f.enable() : f.disable();
  }
}
