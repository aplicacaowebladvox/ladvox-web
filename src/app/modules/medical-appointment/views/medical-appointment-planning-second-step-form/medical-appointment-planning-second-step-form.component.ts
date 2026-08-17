import { CommonModule, Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MultiSelectModule } from 'primeng/multiselect';
import { MedicalAppointmentPlanningStore } from '../../../../core/stores/medical-appointment-planning.store';
import { AuthService } from '../../../authentication/services/auth.service';
import { AlertService } from '../../../../core/services/alert.provided.service';
import {
  FormOfMedicalAppointmentPlanningSecondStepModel,
  MedicalAppointmentPlanningSecondStepModelOfForm,
} from '../../../../models/medical-appointment-planning-second-step.model';
import { UserStore } from '../../../../core/stores/user.store';
import { SelectOptionModel } from '../../../../core/models/select-option.model';
import {
  FormOfTeamMedicalAppointmentPlanningModel,
  TeamMedicalAppointmentPlanningModel,
} from '../../../../models/team-medical-appointment-planning.model';
import { TabComponent, TabItem } from '../../../../core/components/tab/tab.component';
import { LoadingComponent } from '../../../../core/components/loading/loading.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { alertApiError } from '../../../../core/operators/api-alert-error.operator';

@Component({
  selector: 'app-medical-appointment-planning-second-step-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MultiSelectModule,
    TabComponent,
    NgxSkeletonLoaderModule,
  ],
  templateUrl: './medical-appointment-planning-second-step-form.component.html',
  styleUrl: './medical-appointment-planning-second-step-form.component.scss',
  providers: [MedicalAppointmentPlanningStore, UserStore],
})
export class MedicalAppointmentPlanningSecondStepFormComponent implements OnInit {
  @Input()
  id!: number;
  form!: FormGroup;

  therapistsSelectOptions!: SelectOptionModel<string, string>[];

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
    private userStore: UserStore,
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
    this.router.navigate(['atendimento', this.id], { queryParams: { editing: this.editing } });
  }
  clickSave(): void {
    this.medicalAppointmentPlanningStore
      .updateSecondStep(this.id, MedicalAppointmentPlanningSecondStepModelOfForm(this.form))
      .pipe(alertApiError())
      .subscribe({
        next: () => {
          this.clickContinue();
        },
      });
  }
  clickContinue(): void {
    this.router.navigate(['atendimento', this.id, 'pacientes'], {
      queryParams: {
        editing: this.editing,
      },
    });
  }
  clickRemoveTeam(teamForm: FormGroup, teamFormIndex: number): void {
    this.alertService.showConfirm({
      message: 'Esta ação é irreversivel, tem certeza que deseja executa-la?',
      title: 'Excluir Equipe',
      callbackConfirmFn: () => {
        if (teamForm.getRawValue().id) {
          this.medicalAppointmentPlanningStore
            .deleteTeam(this.id, teamForm.getRawValue().id)
            .pipe(alertApiError())
            .subscribe({
              next: () => {
                this._removeFromTeamFormList(teamFormIndex);
              },
            });
        } else {
          this._removeFromTeamFormList(teamFormIndex);
        }
      },
    });
  }
  clickAddTeam(): void {
    this.form.controls['teamsForms'].setValue([
      ...(<FormGroup[]>this.form.getRawValue().teamsForms),
      FormOfTeamMedicalAppointmentPlanningModel(),
    ]);
  }
  onTabChange(tabItem: TabItem): void {
    if (tabItem.displayName == 'Equipes') return;
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
          case 'Pacientes':
            this.router.navigate(['atendimento', this.id, 'pacientes'], {
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
        this.tabItems.forEach((tabItem) => (tabItem.isActive = tabItem.displayName == 'Equipes')),
    });
  }
  private _removeFromTeamFormList(teamFormIndex: number): void {
    this.form.controls['teamsForms'].setValue(
      (<FormGroup[]>this.form.getRawValue().teamsForms).filter((tfg, i) => i != teamFormIndex)
    );
    if ((<FormGroup[]>this.form.getRawValue().teamsForms).length == 0) {
      this.clickAddTeam();
    }
  }
  private _loadPage(): void {
    this._initSelectOptions();
    this.medicalAppointmentPlanningStore
      .getSecondStep(this.id)
      .pipe(alertApiError())
      .subscribe({
        next: (model) => {
          model.teams =
            (model.teams || []).length > 0
              ? model.teams
              : [{} as TeamMedicalAppointmentPlanningModel];
          this.form = FormOfMedicalAppointmentPlanningSecondStepModel(model);
          this._changeFormControlStatus(this.form, !!this.editing);
          this._initTabs();
        },
      });
  }
  private _initSelectOptions(): void {
    this.userStore
      .getSelectOptions(true)
      .pipe(alertApiError())
      .subscribe({
        next: (options) => (this.therapistsSelectOptions = options),
      });
  }
  private _changeFormControlStatus(f: any, enable: boolean = false): void {
    enable ? f.enable() : f.disable();
    (<FormGroup[]>f.getRawValue().teamsForms).forEach((fg) =>
      enable ? fg.enable() : fg.disable()
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
        isActive: true,
        titleSize: undefined,
        breakSize: undefined,
      },
      {
        isDisabled: !this.form.getRawValue().nextStepIsEnable,
        displayName: 'Pacientes',
        isActive: false,
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
