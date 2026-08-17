import { SearchReturn } from './../../../../core/models/search-return.model';
import {
  FormOfTherapeuticPlanOptions,
  TherapeuticPlanOptions,
  TherapeuticPlanOptionsOfForm,
} from './../../../../models/options/therapeutic-plan.options';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { provideNgxMask } from 'ngx-mask';
import { ActionCardTableComponent } from '../../../shared/components/card-table/action-card-table.component';
import { CardTableComponent } from '../../../shared/components/card-table/card-table.component';
import { BaseCardTableConfig } from '../../../shared/components/card-table/config/base-card-table.config';
import { ColumnCardTableConfig } from '../../../shared/components/card-table/config/column-card-table.config';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseCardTableActionConfig } from '../../../shared/components/card-table/config/base-card-table-action.config';
import { TherapeuticPlanStore } from '../../../../core/stores/therapeutic-plan.store';
import { MultiSelectModule } from 'primeng/multiselect';
import { AlertService } from '../../../../core/services/alert.provided.service';
import { SelectOptionModel } from '../../../../core/models/select-option.model';
import { PatientStore } from '../../../../core/stores/patient.store';
import { DropdownModule } from 'primeng/dropdown';
import { AuthService } from '../../../authentication/services/auth.service';
import { TherapeuticPlanGrid } from '../../../../models/grid/therapeutic-plan.grid';
import { LoadingComponent } from '../../../../core/components/loading/loading.component';
import { finalize } from 'rxjs';
import { alertApiError } from '../../../../core/operators/api-alert-error.operator';
import { SelectNewTherapistModalComponent } from '../../select-new-therapist-modal/select-new-therapist-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-therapeutic-plan-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ActionCardTableComponent,
    CardTableComponent,
    MultiSelectModule,
    DropdownModule,
    LoadingComponent,
  ],
  templateUrl: './therapeutic-plan-list.component.html',
  styleUrl: './therapeutic-plan-list.component.scss',
  providers: [provideNgxMask(), TherapeuticPlanStore, PatientStore],
})
export class TherapeuticPlanListComponent implements OnInit {
  form!: FormGroup;
  pacienteId?: number;
  isLoading: boolean = false;

  therapeuticPlanBaseCardTable!: TherapeuticPlanBaseCardTableConfig;
  takeOverAsEditorCardTableActionConfig!: TakeOverAsEditorCardTableActionConfig;
  resignAsEditorCardTableActionConfig!: ResignAsEditorCardTableActionConfig;
  changeEditorCardTableActionConfig!: ChangeEditorCardTableActionConfig;
  editCardTableActionConfig!: EditCardTableActionConfig;
  viewCardTableActionConfig!: ViewCardTableActionConfig;
  patientsSelectOptions!: SelectOptionModel<number, string>[];
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: TherapeuticPlanStore,
    private patientStore: PatientStore,
    private alertService: AlertService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.activatedRoute.queryParams.pipe(alertApiError()).subscribe({
      next: (params) => {
        this.pacienteId =
          params['pacienteId'] == undefined ? undefined : Number.parseInt(params['pacienteId']);
        this._loadPage();
      },
    });
  }
  clickClean(): void {
    this.therapeuticPlanBaseCardTable.clear();
  }
  clickFilter(): void {
    this.therapeuticPlanBaseCardTable.actualOptions = TherapeuticPlanOptionsOfForm(this.form);
    this.therapeuticPlanBaseCardTable.refreshRegisters();
  }
  clickAddNew(): void {
    this.router.navigate(['plano-terapeutico', 'form']);
  }
  private _loadPage(): void {
    this._initForm();
    this._initTable();
    this._initSelectOptions();
  }
  private _initTable(): void {
    this.therapeuticPlanBaseCardTable = new TherapeuticPlanBaseCardTableConfig(
      this.store,
      this.alertService
    );
    this.takeOverAsEditorCardTableActionConfig = new TakeOverAsEditorCardTableActionConfig(
      this.router,
      this.activatedRoute,
      this.store,
      this.authService,
      this.alertService,
      this
    );
    this.resignAsEditorCardTableActionConfig = new ResignAsEditorCardTableActionConfig(
      this.authService,
      this.store,
      this,
      this.alertService
    );
    this.changeEditorCardTableActionConfig = new ChangeEditorCardTableActionConfig(
      this.alertService,
      this.store,
      this,
      this.dialog,
      this.authService
    );
    this.editCardTableActionConfig = new EditCardTableActionConfig(
      this.router,
      this.activatedRoute,
      this.authService
    );
    this.viewCardTableActionConfig = new ViewCardTableActionConfig(
      this.router,
      this.activatedRoute,
      this.authService
    );
  }
  private _initForm(): void {
    this.form = FormOfTherapeuticPlanOptions({
      patientId: this.pacienteId,
    } as TherapeuticPlanOptions);
  }
  private _initSelectOptions(): void {
    this.patientStore
      .getSelectOptions()
      .pipe(alertApiError())
      .subscribe({
        next: (options: SelectOptionModel<number, string>[]) => {
          this.patientsSelectOptions = options;
        },
      });
  }
}

class TherapeuticPlanBaseCardTableConfig extends BaseCardTableConfig {
  get actualOptions(): TherapeuticPlanOptions {
    return <TherapeuticPlanOptions>this.options;
  }
  set actualOptions(op: TherapeuticPlanOptions) {
    op.page = this.options.page;
    op.pageSize = this.options.pageSize;
    op.orderByFilters = this.options.orderByFilters;
    this.options = <TherapeuticPlanOptions>op;
  }
  constructor(
    private store: TherapeuticPlanStore,
    private alertService: AlertService
  ) {
    super();
    this.columns = this._mountColumns();
  }
  public override refreshRegisters(): void {
    this.store
      .search(this.actualOptions)
      .pipe(alertApiError())
      .subscribe({
        next: (searchReturn: SearchReturn) => {
          this.registers = searchReturn.registers;
          this.totalRegisters = searchReturn.totalRegisters;
        },
      });
  }

  private _mountColumns(): ColumnCardTableConfig[] {
    return [
      {
        title: 'Paciente',
        field: 'patientName',
        sortable: false,
        width: 50,
      },
      {
        title: 'Planejamento de atendimentos',
        field: 'medicalAppointmentPlanningDescription',
        sortable: false,
        width: 50,
      },
      {
        title: 'Equipe',
        field: 'medicalAppointmentTeamDescription',
        sortable: false,
        width: 50,
        convertStyleByLine: (line) =>
          `${line.medicalAppointmentTeamColor ? 'color:' + line.medicalAppointmentTeamColor + ';' : ''}`,
      },
      {
        title: 'Sala',
        field: 'medicalAppointmentRoom',
        sortable: false,
        width: 25,
      },
      {
        title: 'Data da consulta',
        field: 'medicalAppointmentConsultDescription',
        sortable: false,
        width: 25,
      },
    ] as ColumnCardTableConfig[];
  }
}

class TakeOverAsEditorCardTableActionConfig extends BaseCardTableActionConfig {
  private _hasPermission: boolean = false;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private therapeuticPlanStore: TherapeuticPlanStore,
    authService: AuthService,
    private alertService: AlertService,
    private parent: TherapeuticPlanListComponent
  ) {
    super();
    this.iconClass = 'fa-solid fa-arrow-right-to-bracket';
    this.tooltip = 'Assumir como editor';
    this._hasPermission = authService.hasPermission(
      'atendimento.plano-terapeutico.assumir-como-editor'
    );
  }
  override isVisible(line: any): boolean {
    return this._hasPermission && !line.currentEditorId;
  }
  public override click(line: TherapeuticPlanGrid): void {
    this.parent.isLoading = true;
    this.therapeuticPlanStore
      .takeOverAsEditor(line.id, line.medicalAppointmentId)
      .pipe(
        finalize(() => (this.parent.isLoading = false)),
        alertApiError()
      )
      .subscribe({
        next: (model) => {
          line.id = model.id;
          this.alertService.showConfirm({
            message: 'Deseja iniciar a edição agora?',
            callbackConfirmFn: () => {
              this.router.navigate([model.id], {
                relativeTo: this.activatedRoute,
                queryParams: {
                  editing: true,
                },
              });
            },
            callbackCancelFn: () => {
              this.parent.clickFilter();
            },
          });
        },
      });
  }
}

class ResignAsEditorCardTableActionConfig extends BaseCardTableActionConfig {
  private _userId?: string;
  get userId(): string | undefined {
    if (this._userId) return this._userId;
    return this.authService.user()?.sub;
  }
  constructor(
    private authService: AuthService,
    private therapeuticPlanStore: TherapeuticPlanStore,
    private parent: TherapeuticPlanListComponent,
    private alertService: AlertService
  ) {
    super();
    this.iconClass = 'fa-solid fa-arrow-right-from-bracket';
    this.tooltip = 'Resignar como editor';
  }
  override isVisible(line: any): boolean {
    return !!line.id && !!line.currentEditorId && line.currentEditorId === this.userId;
  }
  public override click(line: any): void {
    this.parent.isLoading = true;
    this.therapeuticPlanStore
      .resignAsEditor(line.id)
      .pipe(
        finalize(() => (this.parent.isLoading = false)),
        alertApiError()
      )
      .subscribe({
        next: () => {
          this.parent.clickFilter();
          line.currentEditorId = null;
        },
      });
  }
}

class ChangeEditorCardTableActionConfig extends BaseCardTableActionConfig {
  private _userId?: string;
  private _hasPermission: boolean = false;
  constructor(
    private alertService: AlertService,
    private therapeuticPlanStore: TherapeuticPlanStore,
    private parent: TherapeuticPlanListComponent,
    private dialog: MatDialog,
    authService: AuthService
  ) {
    super();
    this.iconClass = 'fa-solid fa-retweet';
    this.tooltip = 'Trocar editor';
    this._userId = authService.getUser()?.sub;
    this._hasPermission = authService.hasPermission('atendimento.plano-terapeutico.alterar-editor');
  }
  override isVisible(line: any): boolean {
    return this._hasPermission;
  }
  public override click(line: TherapeuticPlanGrid): void {
    let dialogRef = this.dialog.open(SelectNewTherapistModalComponent, {
      width: '50mw',
      data: {
        therapeuticPlanId: line.id,
        medicalAppointmentId: line.medicalAppointmentId,
        currentEditorId: line.currentEditorId,
      },
    });
    dialogRef.afterClosed().subscribe((newUserEditorId) => {
      this.parent.clickFilter();
    });
  }
}

class EditCardTableActionConfig extends BaseCardTableActionConfig {
  private _hasPermission: boolean = false;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    authService: AuthService
  ) {
    super();
    this.iconClass = 'fa-solid fa-pencil';
    this.tooltip = 'Editar';
    this._hasPermission = authService.hasPermission('atendimento.plano-terapeutico.form');
  }
  override isVisible(line: any): boolean {
    return this._hasPermission;
  }
  public override click(line: TherapeuticPlanGrid): void {
    if (line.id) {
      this.router.navigate([line.id], {
        relativeTo: this.activatedRoute,
        queryParams: {
          editing: true,
        },
      });
    } else {
      this.router.navigate(['form'], {
        relativeTo: this.activatedRoute,
        queryParams: {
          editing: true,
          medicalAppointmentId: line.medicalAppointmentId,
        },
      });
    }
  }
}

class ViewCardTableActionConfig extends BaseCardTableActionConfig {
  private _hasPermission: boolean = false;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    authService: AuthService
  ) {
    super();
    this.iconClass = 'fa-solid fa-eye';
    this.tooltip = 'Visualizar';
    this._hasPermission = authService.hasPermission('atendimento.plano-terapeutico.view');
  }
  override isVisible(line: any): boolean {
    return this._hasPermission;
  }
  public override click(line: any): void {
    if (line.id) {
      this.router.navigate([line.id], {
        relativeTo: this.activatedRoute,
        queryParams: {
          editing: false,
        },
      });
    } else {
      this.router.navigate(['form'], {
        relativeTo: this.activatedRoute,
        queryParams: {
          editing: false,
          medicalAppointmentId: line.medicalAppointmentId,
        },
      });
    }
  }
}
