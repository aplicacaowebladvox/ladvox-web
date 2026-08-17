import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BaseCardTableConfig } from '../../../shared/components/card-table/config/base-card-table.config';
import { ColumnCardTableConfig } from '../../../shared/components/card-table/config/column-card-table.config';
import {
  FormOfMedicalAppointmentPlanningOptions,
  MedicalAppointmentPlanningOptions,
  MedicalAppointmentPlanningOptionsOfForm,
} from '../../../../models/options/medical-appointment-planning.options';
import { ConvertUtils } from '../../../shared/utils/convert.utils';
import { SearchReturn } from '../../../../core/models/search-return.model';
import { DropdownModule } from 'primeng/dropdown';
import { CardTableComponent } from '../../../shared/components/card-table/card-table.component';
import { ActionCardTableComponent } from '../../../shared/components/card-table/action-card-table.component';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseCardTableActionConfig } from '../../../shared/components/card-table/config/base-card-table-action.config';
import { AlertService } from '../../../../core/services/alert.provided.service';
import { HasPermissionDirective } from '../../../../core/has-permission.directive';
import { SelectOptionModel } from '../../../../core/models/select-option.model';
import { PatientStore } from '../../../../core/stores/patient.store';
import { MedicalAppointmentPlanningStore } from '../../../../core/stores/medical-appointment-planning.store';
import { alertApiError } from '../../../../core/operators/api-alert-error.operator';

@Component({
  selector: 'app-medical-appointment-planning-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DropdownModule,
    CardTableComponent,
    ActionCardTableComponent,
    HasPermissionDirective,
  ],
  templateUrl: './medical-appointment-planning-list.component.html',
  styleUrl: './medical-appointment-planning-list.component.scss',
  providers: [PatientStore, MedicalAppointmentPlanningStore],
})
export class MedicalAppointmentPlanningListComponent implements OnInit {
  form!: FormGroup;
  medicalAppointmentPlanningBaseCardTableConfig!: MedicalAppointmentPlanningBaseCardTableConfig;
  editCardTableActionConfig: EditCardTableActionConfig = new EditCardTableActionConfig(
    this.router,
    this.activatedRoute
  );
  viewCardTableActionConfig: ViewCardTableActionConfig = new ViewCardTableActionConfig(
    this.router,
    this.activatedRoute
  );
  patientSelectOptions!: SelectOptionModel<number, string>[];
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService,
    private patientStore: PatientStore,
    private medicalAppointmentPlanningStore: MedicalAppointmentPlanningStore
  ) {}
  ngOnInit(): void {
    this._initForm();
    this._initGrid();
    this._initSelectOptions();
  }
  clickClean(): void {
    Object.keys(this.form.controls).forEach((key) => this.form.controls[key].setValue(null));
    this.medicalAppointmentPlanningBaseCardTableConfig.actualOptions =
      MedicalAppointmentPlanningOptionsOfForm(this.form);
    this.medicalAppointmentPlanningBaseCardTableConfig.clear();
  }
  clickFilter(): void {
    this.medicalAppointmentPlanningBaseCardTableConfig.actualOptions =
      MedicalAppointmentPlanningOptionsOfForm(this.form);
    this.medicalAppointmentPlanningBaseCardTableConfig.refreshRegisters();
  }
  clickAddNew(): void {
    this.router.navigate(['form'], {
      relativeTo: this.activatedRoute,
      queryParams: { editing: true },
    });
  }
  private _initForm(): void {
    this.form = FormOfMedicalAppointmentPlanningOptions();
  }
  private _initGrid(): void {
    this.medicalAppointmentPlanningBaseCardTableConfig =
      new MedicalAppointmentPlanningBaseCardTableConfig(
        this.medicalAppointmentPlanningStore,
        this.alertService
      );
  }
  private _initSelectOptions(): void {
    this.patientStore
      .getSelectOptions()
      .pipe(alertApiError())
      .subscribe({
        next: (options) => (this.patientSelectOptions = options),
      });
    this.form = FormOfMedicalAppointmentPlanningOptions();
  }
}

class MedicalAppointmentPlanningBaseCardTableConfig extends BaseCardTableConfig {
  get actualOptions(): MedicalAppointmentPlanningOptions {
    return <MedicalAppointmentPlanningOptions>this.options;
  }
  set actualOptions(op: MedicalAppointmentPlanningOptions) {
    op.page = this.options.page;
    op.pageSize = this.options.pageSize;
    op.orderByFilters = this.options.orderByFilters;
    this.options = <MedicalAppointmentPlanningOptions>op;
  }
  constructor(
    private store: MedicalAppointmentPlanningStore,
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
          this.totalRegisters = searchReturn.totalRegisters;
          this.registers = searchReturn.registers;
        },
      });
  }

  private _mountColumns(): ColumnCardTableConfig[] {
    return [
      {
        title: 'Nome',
        field: 'name',
        sortable: true,
        width: 80,
      },
      {
        title: 'Inicio',
        field: 'initialValidity',
        sortable: true,
        convert: (value: Date) => ConvertUtils.dateToString(value, false),
        width: 10,
      },
      {
        title: 'Fim',
        field: 'finalValidity',
        sortable: true,
        convert: (value: Date) => ConvertUtils.dateToString(value, false) || 'N/A',
        width: 10,
      },
    ] as ColumnCardTableConfig[];
  }
}

class EditCardTableActionConfig extends BaseCardTableActionConfig {
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super();
    this.iconClass = 'fa-solid fa-pencil';
    this.tooltip = 'Editar';
  }
  public override click(line: any): void {
    this.router.navigate([line.id], {
      relativeTo: this.activatedRoute,
      queryParams: { editing: true },
    });
  }
}

class ViewCardTableActionConfig extends BaseCardTableActionConfig {
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super();
    this.iconClass = 'fa-solid fa-eye';
    this.tooltip = 'Visualizar';
  }
  public override click(line: any): void {
    this.router.navigate([line.id], {
      relativeTo: this.activatedRoute,
      queryParams: { editing: false },
    });
  }
}
