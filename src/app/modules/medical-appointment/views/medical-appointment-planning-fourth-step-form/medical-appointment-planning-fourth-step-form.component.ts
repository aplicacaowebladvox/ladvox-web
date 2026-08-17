import { CommonModule, Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FileUploadComponent } from '../../../../core/components/file-upload/file-upload.component';
import { MedicalAppointmentPlanningModel } from '../../../../models/medical-appointment-planning.model';
import { MedicalAppointmentPlanningFirstStepModel } from '../../../../models/medical-appointment-planning-first-step.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../../core/services/alert.provided.service';
import { MedicalAppointmentPlanningStore } from '../../../../core/stores/medical-appointment-planning.store';
import { PatientStore } from '../../../../core/stores/patient.store';
import { TeamMedicalAppointmentPlanningStore } from '../../../../core/stores/team-medical-appointment-planning.store';
import { AuthService } from '../../../authentication/services/auth.service';
import { TabComponent, TabItem } from '../../../../core/components/tab/tab.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { alertApiError } from '../../../../core/operators/api-alert-error.operator';

@Component({
  selector: 'app-medical-appointment-planning-fourth-step-form',
  standalone: true,
  imports: [CommonModule, FileUploadComponent, TabComponent, NgxSkeletonLoaderModule],
  templateUrl: './medical-appointment-planning-fourth-step-form.component.html',
  styleUrl: './medical-appointment-planning-fourth-step-form.component.scss',
  providers: [MedicalAppointmentPlanningStore],
})
export class MedicalAppointmentPlanningFourthStepFormComponent implements OnInit {
  @Input()
  id!: number;
  model!: MedicalAppointmentPlanningFirstStepModel;

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
  attachmentStore = this.medicalAppointmentPlanningStore;
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
    this.router.navigate(['atendimento', this.id, 'pacientes'], {
      queryParams: { editing: this.editing },
    });
  }
  clickContinue(): void {
    this.router.navigate(['atendimento']);
  }
  onTabChange(tabItem: TabItem): void {
    if (tabItem.displayName == 'Relatórios') return;
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
          case 'Pacientes':
            this.router.navigate(['atendimento', this.id, 'pacientes'], {
              queryParams: {
                editing: this.editing,
              },
            });
            return;
        }
      },
      callbackCancelFn: () =>
        this.tabItems.forEach(
          (tabItem) => (tabItem.isActive = tabItem.displayName == 'Relatórios')
        ),
    });
  }
  private _loadPage(): void {
    this.medicalAppointmentPlanningStore
      .getFirstStep(this.id)
      .pipe(alertApiError())
      .subscribe({
        next: (model) => {
          this.model = model;
          this._initTabs();
        },
      });
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
        isActive: false,
        titleSize: undefined,
        breakSize: undefined,
      },
      {
        isDisabled: false,
        displayName: 'Relatórios',
        isActive: true,
        titleSize: undefined,
        breakSize: undefined,
      },
    ];
  }
}
