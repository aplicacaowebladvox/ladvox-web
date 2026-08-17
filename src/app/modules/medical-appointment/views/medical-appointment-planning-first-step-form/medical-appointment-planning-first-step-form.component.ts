import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MedicalAppointmentPlanningStore } from '../../../../core/stores/medical-appointment-planning.store';
import { AuthService } from '../../../authentication/services/auth.service';
import { AlertService } from '../../../../core/services/alert.provided.service';
import { CommonModule, Location } from '@angular/common';
import {
  FormOfMedicalAppointmentPlanningFirstStepModel,
  MedicalAppointmentPlanningFirstStepModelOfForm,
} from '../../../../models/medical-appointment-planning-first-step.model';
import { HasPermissionDirective } from '../../../../core/has-permission.directive';
import { TabComponent, TabItem } from '../../../../core/components/tab/tab.component';
import { finalize } from 'rxjs';
import { LoadingComponent } from '../../../../core/components/loading/loading.component';
import { alertApiError } from '../../../../core/operators/api-alert-error.operator';

@Component({
  selector: 'app-medical-appointment-planning-first-step-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HasPermissionDirective,
    TabComponent,
    LoadingComponent,
  ],
  templateUrl: './medical-appointment-planning-first-step-form.component.html',
  styleUrl: './medical-appointment-planning-first-step-form.component.scss',
  providers: [MedicalAppointmentPlanningStore],
})
export class MedicalAppointmentPlanningFirstStepFormComponent implements OnInit {
  @Input()
  id?: number;
  form!: FormGroup;
  isLoading: boolean = false;
  private _editing: boolean | null = false;
  private _hasPermissionFormEdit: boolean = false;
  private _hasPermissionFormNew: boolean = false;
  get editing(): boolean | null {
    return this._editing;
  }
  tabItems!: TabItem[];
  constructor(
    private router: Router,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private medicalAppointmentPlanningStore: MedicalAppointmentPlanningStore,
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
    this.router.navigate(['atendimento']);
  }
  clickSave(): void {
    this.isLoading = true;
    this.medicalAppointmentPlanningStore
      .updateFirstStep(MedicalAppointmentPlanningFirstStepModelOfForm(this.form), this.id)
      .pipe(
        finalize(() => (this.isLoading = false)),
        alertApiError()
      )
      .subscribe({
        next: (model) => {
          this.clickContinue(model.id);
        },
      });
  }
  clickContinue(id?: number): void {
    this.router.navigate(['atendimento', id || this.id, 'equipes'], {
      queryParams: {
        editing: this.editing,
      },
    });
  }
  onTabChange(tabItem: TabItem): void {
    if (tabItem.displayName == 'Informações Gerais') return;
    this.alertService.showConfirm({
      message:
        'Ao sair da página todas as alterções não salvas previamente serão perdidas, tem certeza que deseja executa-la?',
      callbackConfirmFn: () => {
        switch (tabItem.displayName) {
          case 'Equipes':
            this.router.navigate(['atendimento', this.id, 'equipes'], {
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
        this.tabItems.forEach(
          (tabItem) => (tabItem.isActive = tabItem.displayName == 'Informações Gerais')
        ),
    });
  }
  private _loadPage(): void {
    if (this.id) {
      this.isLoading = true;
      this.medicalAppointmentPlanningStore
        .getFirstStep(this.id)
        .pipe(
          finalize(() => (this.isLoading = false)),
          alertApiError()
        )
        .subscribe({
          next: (model) => {
            this.form = FormOfMedicalAppointmentPlanningFirstStepModel(model);
            this._changeFormControlStatus(this.form, !!this.editing);
            this._initTabs();
          },
        });
    } else {
      this.form = FormOfMedicalAppointmentPlanningFirstStepModel();
      this._changeFormControlStatus(this.form, true);
      this._initTabs();
    }
  }
  private _changeFormControlStatus(f: any, enable: boolean = false): void {
    enable ? f.enable() : f.disable();
  }
  private _initTabs(): void {
    this.tabItems = [
      {
        isDisabled: false,
        displayName: 'Informações Gerais',
        isActive: true,
        titleSize: undefined,
        breakSize: undefined,
      },
      {
        isDisabled: !this.form.getRawValue().nextStepIsEnable,
        displayName: 'Equipes',
        isActive: false,
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
