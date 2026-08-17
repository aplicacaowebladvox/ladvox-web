import { CommonModule, Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { DropdownModule } from 'primeng/dropdown';
import { FormOfPatientModel, PatientModelOfForm } from '../../../../models/patient.model';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../authentication/services/auth.service';
import { PatientStore } from '../../../../core/stores/patient.store';
import { ConvertUtils } from '../../../shared/utils/convert.utils';
import { PrimeNGConfig } from 'primeng/api';
import { translationConfig } from '../../../../config/primeng-translation.config';
import {
  SelectOptionExtraAttributeModel,
  SelectOptionModel,
} from '../../../../core/models/select-option.model';
import { GenderStore } from '../../../../core/stores/gender.store';
import { EducationStore } from '../../../../core/stores/education.store';
import { HasPermissionDirective } from '../../../../core/has-permission.directive';
import { AlertService } from '../../../../core/services/alert.provided.service';
import { LoadingComponent } from '../../../../core/components/loading/loading.component';
import { finalize } from 'rxjs';
import { alertApiError } from '../../../../core/operators/api-alert-error.operator';

@Component({
  selector: 'app-patients-form',
  standalone: true,
  imports: [
    CommonModule,
    NgxMaskDirective,
    DropdownModule,
    ReactiveFormsModule,
    HasPermissionDirective,
    LoadingComponent,
  ],
  templateUrl: './patients-form.component.html',
  styleUrl: './patients-form.component.scss',
  providers: [provideNgxMask(), PatientStore, GenderStore, EducationStore],
})
export class PatientsFormComponent implements OnInit {
  @Input()
  id?: number;
  form!: FormGroup;
  isLoading: boolean = false;

  genderSelectOptions!: SelectOptionExtraAttributeModel<number, string, boolean>[];
  educationSelectOptions!: SelectOptionExtraAttributeModel<number, string, boolean>[];

  private _editing: boolean | null = false;
  private _hasPermissionFormEdit: boolean = false;
  get editing(): boolean | null {
    return this._editing;
  }
  age(birthDate: string): string {
    let birthDateAsDate = ConvertUtils.stringToDate(birthDate);
    if (!birthDateAsDate) return '';
    return ConvertUtils.age(birthDateAsDate);
  }
  constructor(
    private router: Router,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private patientStore: PatientStore,
    private genderStore: GenderStore,
    private educationStore: EducationStore,
    private alertService: AlertService,
    primengConfig: PrimeNGConfig
  ) {
    primengConfig.setTranslation(translationConfig);
  }
  ngOnInit(): void {
    this._hasPermissionFormEdit = this.authService.hasPermission('paciente.paciente.form.edit');
    this.activatedRoute.queryParams.pipe(alertApiError()).subscribe({
      next: (params) => {
        this._editing = params['editing'] == undefined ? null : params['editing'] == 'true';
        if (this.editing && !this._hasPermissionFormEdit) this.location.back();
        this._loadPage();
      },
    });
  }
  canShow(item: string): boolean {
    switch (item) {
      case 'buttonCreate':
        return !this.id;
      case 'buttonEvolution':
      case 'buttonAnamnesis':
      case 'buttonSave':
      case 'buttonQuestions':
        return !!this.id;
    }
    return false;
  }

  clickCreate(): void {
    this.patientStore
      .insert(PatientModelOfForm(this.form))
      .pipe(alertApiError())
      .subscribe({
        next: (data) =>
          this.router.navigate(['pacientes', data.id], {
            queryParams: { editing: true },
          }),
      });
  }
  clickProtocolHistory(): void {
    this.router.navigate(['historico-protocolos'], {
      relativeTo: this.activatedRoute,
      queryParams: {
        editing: this.editing,
      },
    });
  }

  clickAnamnesis(): void {
    this.router.navigate(['anamnese'], {
      relativeTo: this.activatedRoute,
    });
  }
  clickSave(): void {
    this.isLoading;
    this.patientStore
      .update(this.id!, PatientModelOfForm(this.form))
      .pipe(
        finalize(() => (this.isLoading = false)),
        alertApiError()
      )
      .subscribe({
        next: () =>
          this.alertService.showSuccess({
            message: 'Paciente salvo',
            title: 'Sucesso',
            callbackCancelFn: () =>
              this.router.navigate([], {
                relativeTo: this.activatedRoute,
                queryParams: { editing: true },
              }),
          }),
      });
  }
  clickEnableEdit(): void {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { editing: true },
    });
  }
  clickBack(): void {
    this.router.navigate(['pacientes']);
  }
  private _loadPage(): void {
    this._getPatient();
    this._initGenderSelectOptions();
    this._initEducationSelectOptions();
  }
  private _getPatient(): void {
    if (this.id) {
      this.isLoading = true;
      this.patientStore
        .getById(this.id)
        .pipe(
          finalize(() => (this.isLoading = false)),
          alertApiError()
        )
        .subscribe({
          next: (data) => {
            this.form = FormOfPatientModel(data);
            this._changeFormControlStatus(this.form, !!this.editing);
            this.form.controls['document'].disable();
            this._selectGender();
            this._selectEducation();
          },
        });
    } else {
      this.form = FormOfPatientModel();
      this._changeFormControlStatus(this.form, true);
    }
  }
  private _initGenderSelectOptions(): void {
    this.genderStore
      .getSelectOptions()
      .pipe(alertApiError())
      .subscribe({
        next: (options) => {
          this.genderSelectOptions = options;
          this._selectGender();
        },
      });
  }
  private _initEducationSelectOptions(): void {
    this.educationStore
      .getSelectOptions()
      .pipe(alertApiError())
      .subscribe({
        next: (options) => {
          this.educationSelectOptions = options;
          this._selectEducation();
        },
      });
  }
  private _selectGender(): void {
    if (!this.form || !this.genderSelectOptions) return;
    this.form.controls['genderSelected'].setValue(
      this.genderSelectOptions.find(
        (o) => o.id == (this.form.getRawValue().genderSelected || { id: undefined }).id
      )
    );
  }
  private _selectEducation(): void {
    if (!this.form || !this.educationSelectOptions) return;
    this.form.controls['educationSelected'].setValue(
      this.educationSelectOptions.find(
        (o) => o.id == (this.form.getRawValue().educationSelected || { id: undefined }).id
      )
    );
  }
  private _changeFormControlStatus(f: FormGroup, enable: boolean = false): void {
    enable ? f.enable() : f.disable();
    enable ? f.getRawValue().addressForm.enable() : f.getRawValue().addressForm.disable();
  }
}
