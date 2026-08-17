import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActionCardTableComponent } from '../../shared/components/card-table/action-card-table.component';
import { CardTableComponent } from '../../shared/components/card-table/card-table.component';
import { BaseCardTableConfig } from '../../shared/components/card-table/config/base-card-table.config';
import { RequestAppointmentStore } from '../../../core/stores/request-appointment.store';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormOfRequestAppointmentOptions,
  RequestAppointmentOptions,
  RequestAppointmentOptionsOfForm,
} from '../../../models/options/request-appointment.optionsl';
import { SearchReturn } from '../../../core/models/search-return.model';
import { ColumnCardTableConfig } from '../../shared/components/card-table/config/column-card-table.config';
import { ConvertUtils } from '../../shared/utils/convert.utils';
import { RequestAppointmentGrid } from '../../../models/grid/request-appointment.grid';
import { BaseCardTableActionConfig } from '../../shared/components/card-table/config/base-card-table-action.config';
import { DropdownModule } from 'primeng/dropdown';
import { AlertService } from '../../../core/services/alert.provided.service';
import { LoadingComponent } from '../../../core/components/loading/loading.component';
import { finalize } from 'rxjs';
import { alertApiError } from '../../../core/operators/api-alert-error.operator';

@Component({
  selector: 'app-request-appointment-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ActionCardTableComponent,
    CardTableComponent,
    DropdownModule,
    LoadingComponent,
  ],
  templateUrl: './request-appointment-list.component.html',
  styleUrl: './request-appointment-list.component.scss',
  providers: [RequestAppointmentStore],
})
export class RequestAppointmentListComponent implements OnInit {
  form!: FormGroup;
  isLoading: boolean = false;
  statusAvailableSelectOptions: any[] = [
    { id: 'CONCLUDED', name: 'Concluido' },
    { id: 'OPENED', name: 'Em aberto' },
  ];

  cardTableModel!: RequestAppointmentBaseCardTableConfig;
  concludeCardTableActionConfig!: ConcludeCardTableActionConfig;
  viewCardTableActionConfig!: ViewCardTableActionConfig;
  constructor(
    private router: Router,
    private requestAppointmentStore: RequestAppointmentStore,
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService
  ) {}
  ngOnInit(): void {
    this._initTable();
    this._initForm();
  }
  clickClean(): void {
    this._initForm();
    this.cardTableModel.clear();
  }
  clickFilter(): void {
    this.cardTableModel.actualOptions = RequestAppointmentOptionsOfForm(this.form);
    this.cardTableModel.refreshRegisters();
  }
  private _initForm(): void {
    this.form = FormOfRequestAppointmentOptions();
  }
  private _initTable(): void {
    this.cardTableModel = new RequestAppointmentBaseCardTableConfig(
      this.requestAppointmentStore,
      this.alertService
    );
    this.concludeCardTableActionConfig = new ConcludeCardTableActionConfig(
      this.requestAppointmentStore,
      this.cardTableModel,
      this.alertService,
      this
    );
    this.viewCardTableActionConfig = new ViewCardTableActionConfig(
      this.router,
      this.activatedRoute
    );
  }
}

class RequestAppointmentBaseCardTableConfig extends BaseCardTableConfig {
  set actualOptions(op: RequestAppointmentOptions) {
    op.page = 1;
    op.pageSize = this.options.pageSize;
    op.orderByFilters = this.options.orderByFilters;
    this.options = <RequestAppointmentOptions>op;
  }
  get actualOptions(): RequestAppointmentOptions {
    return <RequestAppointmentOptions>this.options;
  }
  constructor(
    private requestAppointmentStore: RequestAppointmentStore,
    private alertService: AlertService
  ) {
    super();
    this.columns = this._mountColumns();
  }
  public override refreshRegisters(): void {
    this.requestAppointmentStore
      .search(<RequestAppointmentOptions>this.options)
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
        title: 'Nome',
        field: 'name',
        sortable: true,
        width: 75,
      },
      {
        title: 'Data',
        field: 'createdDate',
        convert: (createdDate: Date) => ConvertUtils.dateToFormatedString(createdDate),
        width: 25,
      },
      {
        title: 'Situação',
        field: 'conclusionDate',
        convertByLine: (ra: RequestAppointmentGrid) =>
          !!ra.conclusionDate
            ? 'Concluído ' +
              ConvertUtils.dateToFormatedString(ra.conclusionDate) +
              ' por ' +
              ra.userOfConclusionName
            : 'Em aberto',
        width: 50,
      },
      {
        title: 'E-mail',
        field: 'email',
        width: 50,
      },
      {
        title: 'Telefone 1',
        field: 'phone1',
        width: 50,
        convert: (value) => {
          return ConvertUtils.formatPhoneNumber(value);
        },
      },
      {
        title: 'Telefone 2',
        field: 'phone2',
        width: 50,
        convert: (value) => {
          return ConvertUtils.formatPhoneNumber(value);
        },
      },
    ] as ColumnCardTableConfig[];
  }
}

class ConcludeCardTableActionConfig extends BaseCardTableActionConfig {
  constructor(
    private requestAppointmentStore: RequestAppointmentStore,
    private cardTable: BaseCardTableConfig,
    private alertService: AlertService,
    private parent: RequestAppointmentListComponent
  ) {
    super();
    this.iconClass = 'fa-solid fa-check';
    this.tooltip = 'Concluir';
  }
  override isVisible(line: RequestAppointmentGrid): boolean {
    return !line.conclusionDate;
  }
  public override click(line: RequestAppointmentGrid): void {
    this.parent.isLoading = true;
    this.requestAppointmentStore
      .conclude(line.id)
      .pipe(
        finalize(() => (this.parent.isLoading = false)),
        alertApiError()
      )
      .subscribe({
        next: () => this.cardTable.refreshRegisters(),
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
    this.router.navigate([line.id], { relativeTo: this.activatedRoute });
  }
}
