import { CommonModule, Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { PatientStore } from '../../../../core/stores/patient.store';
import {
  SelectOptionExtraAttributeModel,
  SelectOptionModel,
} from '../../../../core/models/select-option.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../../core/services/alert.provided.service';
import { MedicalAppointmentPlanningStore } from '../../../../core/stores/medical-appointment-planning.store';
import { AuthService } from '../../../authentication/services/auth.service';
import {
  FormOfMedicalAppointmentModel,
  MedicalAppointmentModel,
} from '../../../../models/medical-appointment.model';
import {
  FormOfMedicalAppointmentPlanningThirdStepModel,
  MedicalAppointmentPlanningThirdStepModelOfForm,
} from '../../../../models/medical-appointment-planning-third-step.model';
import { WeekdayEnum } from '../../../../models/enum/weekday.enum';
import { TeamMedicalAppointmentPlanningStore } from '../../../../core/stores/team-medical-appointment-planning.store';
import { TabComponent, TabItem } from '../../../../core/components/tab/tab.component';
import { LoadingComponent } from '../../../../core/components/loading/loading.component';
import { NgxSkeletonLoaderComponent, NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { finalize } from 'rxjs';
import { alertApiError } from '../../../../core/operators/api-alert-error.operator';

@Component({
  selector: 'app-medical-appointment-planning-third-step-form',
  standalone: true,
  imports: [
    DropdownModule,
    CommonModule,
    ReactiveFormsModule,
    TabComponent,
    LoadingComponent,
    NgxSkeletonLoaderModule,
  ],
  templateUrl: './medical-appointment-planning-third-step-form.component.html',
  styleUrl: './medical-appointment-planning-third-step-form.component.scss',
  providers: [PatientStore, TeamMedicalAppointmentPlanningStore, MedicalAppointmentPlanningStore],
})
export class MedicalAppointmentPlanningThirdStepFormComponent implements OnInit {
  @Input()
  id!: number;
  form!: FormGroup;
  isLoading: boolean = false;

  teamsSelectOptions!: SelectOptionExtraAttributeModel<number, string, string>[];
  patientsSelecOptions!: SelectOptionModel<number, string>[];
  weekdaySelectOptions!: SelectOptionModel<string, string>[];

  private _editing: boolean | null = false;
  private _hasPermissionFormEdit: boolean = false;
  get hasPermissionFormEdit(): boolean {
    return this._hasPermissionFormEdit;
  }
  private _hasPermissionFormNew: boolean = false;
  get hasPermissionFormNew(): boolean {
    return this._hasPermissionFormNew;
  }
  get editing(): boolean | null {
    return this._editing;
  }
  tabItems!: TabItem[];
  constructor(
    private router: Router,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private medicalAppointmentPlanningStore: MedicalAppointmentPlanningStore,
    private teamMedicalAppointmentPlanningStore: TeamMedicalAppointmentPlanningStore,
    private patientStore: PatientStore,
    private authService: AuthService,
    private alertService: AlertService
  ) {}
  ngOnInit(): void {
    this._hasPermissionFormEdit = this.authService.hasPermission(
      'atendimento.planejamento-atendimento.form.edit'
    );
    this._hasPermissionFormNew = this.authService.hasPermission(
      'atendimento.planejamento-atendimento.form.new'
    );
    this.activatedRoute.queryParams.pipe(alertApiError()).subscribe({
      next: (params) => {
        this._editing = params['editing'] == undefined ? null : params['editing'] == 'true';
        if (this.editing && !this._hasPermissionFormEdit && !this._hasPermissionFormNew)
          this.location.back();
        this._loadPage();
      },
    });
  }
  clickBack(): void {
    this.router.navigate(['atendimento', this.id, 'equipes'], {
      queryParams: { editing: this.editing },
    });
  }
  clickSave(): void {
    this.isLoading = true;
    this.medicalAppointmentPlanningStore
      .updateThirdStep(this.id, MedicalAppointmentPlanningThirdStepModelOfForm(this.form))
      .pipe(
        finalize(() => (this.isLoading = false)),
        alertApiError()
      )
      .subscribe({
        next: () => {
          this.clickContinue();
        },
      });
  }
  clickContinue(): void {
    this.router.navigate(['atendimento', this.id, 'relatorios'], {
      queryParams: {
        editing: this.editing,
      },
    });
  }
  clickRemoveMedicalAppointment(
    medicalAppointmentForm: FormGroup,
    medicalAppointmentFormIndex: number
  ): void {
    this.alertService.showConfirm({
      message: 'Esta ação é irreversivel, tem certeza que deseja executa-la?',
      title: 'Excluir Equipe',
      callbackConfirmFn: () => {
        if (medicalAppointmentForm.getRawValue().id) {
          this.isLoading = true;
          this.medicalAppointmentPlanningStore
            .deleteMedicalAppointment(this.id, medicalAppointmentForm.getRawValue().id)
            .pipe(
              finalize(() => (this.isLoading = false)),
              alertApiError()
            )
            .subscribe({
              next: () => {
                this._removeFromMedicalAppointmentFormList(medicalAppointmentFormIndex);
              },
            });
        } else {
          this._removeFromMedicalAppointmentFormList(medicalAppointmentFormIndex);
        }
      },
    });
  }
  clickAddMedicalAppointment(): void {
    this.form.controls['medicalAppointmentForms'].setValue([
      ...(<FormGroup[]>this.form.getRawValue().medicalAppointmentForms),
      FormOfMedicalAppointmentModel(),
    ]);
  }
  onTabChange(tabItem: TabItem): void {
    if (tabItem.displayName == 'Pacientes') return;
    this.alertService.showConfirm({
      message:
        'Ao sair da página todas as alterções não salvas previamente seão perdidas, tem certeza que deseja executa-la?',
      callbackConfirmFn: () => {
        switch (tabItem.displayName) {
          case 'Informações Gerais':
            this.router.navigate(['atendimento', this.id], {
              queryParams: {
                editing: this.editing,
              },
            });
            return;
          case 'Equipes':
            this.router.navigate(['atendimento', this.id, 'equipes'], {
              queryParams: {
                editing: this.editing,
              },
            });
            return;
          case 'Relatórios':
            this.router.navigate(['atendimento', this.id, 'relatorios'], {
              queryParams: {
                editing: this.editing,
              },
            });
            return;
        }
      },
      callbackCancelFn: () =>
        this.tabItems.forEach((tabItem) => (tabItem.isActive = tabItem.displayName == 'Pacientes')),
    });
  }
  private _removeFromMedicalAppointmentFormList(medicalAppointmentFormIndex: number): void {
    this.form.controls['medicalAppointmentForms'].setValue(
      (<FormGroup[]>this.form.getRawValue().medicalAppointmentForms).filter(
        (tfg, i) => i != medicalAppointmentFormIndex
      )
    );
    if ((<FormGroup[]>this.form.getRawValue().medicalAppointmentForms).length == 0) {
      this.clickAddMedicalAppointment();
    }
  }
  private _loadPage(): void {
    this._initSelectOptions();
    this.medicalAppointmentPlanningStore
      .getThirdStep(this.id)
      .pipe(alertApiError())
      .subscribe({
        next: (model) => {
          model.medicalAppointments =
            (model.medicalAppointments || []).length > 0
              ? model.medicalAppointments
              : [{} as MedicalAppointmentModel];
          this.form = FormOfMedicalAppointmentPlanningThirdStepModel(model);
          this._changeFormControlStatus(this.form, !!this.editing);
          this._initTabs();
          this._selectTeam();
        },
      });
  }
  private _initSelectOptions(): void {
    this.teamMedicalAppointmentPlanningStore
      .getSelectOptions(this.id)
      .pipe(alertApiError())
      .subscribe({
        next: (options) => (this.teamsSelectOptions = options),
      });
    this.patientStore
      .getSelectOptions()
      .pipe(alertApiError())
      .subscribe({
        next: (options) => (this.patientsSelecOptions = options),
      });
    this.weekdaySelectOptions = WeekdayEnum.getAll().map(
      (e) => ({ id: e.name, name: e.displayName }) as SelectOptionModel<string, string>
    );
  }
  private _changeFormControlStatus(f: any, enable: boolean = false): void {
    enable ? f.enable() : f.disable();
    (<FormGroup[]>f.getRawValue().medicalAppointmentForms).forEach((fg) => {
      enable ? fg.enable() : fg.disable();
    });
  }
  private _selectTeam(): void {
    if (!this.form || !this.teamsSelectOptions) return;
    (<FormGroup[]>this.form.getRawValue().medicalAppointmentForms).forEach(
      (medicalAppointmentForm) => {
        medicalAppointmentForm.controls['team'].setValue(
          this.teamsSelectOptions.find(
            (o) => o.id == (medicalAppointmentForm.getRawValue().team || { id: undefined }).id
          )
        );
      }
    );
  }
  private _initTabs(): void {
    this.tabItems = [
      {
        isDisabled: false,
        displayName: 'Informações Gerais',
        isActive: false,
        titleSize: undefined,
        breakSize: undefined,
      },
      {
        isDisabled: false,
        displayName: 'Equipes',
        isActive: false,
        titleSize: undefined,
        breakSize: undefined,
      },
      {
        isDisabled: false,
        displayName: 'Pacientes',
        isActive: true,
        titleSize: undefined,
        breakSize: undefined,
      },
      {
        isDisabled: !this.form.getRawValue().nextStepIsEnable,
        displayName: 'Relatórios',
        isActive: false,
        titleSize: undefined,
        breakSize: undefined,
      },
    ];
  }
}
