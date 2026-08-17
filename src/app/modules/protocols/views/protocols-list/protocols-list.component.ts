import { AlertService } from './../../../../core/services/alert.provided.service';
import { Component } from '@angular/core';
import { BaseCardTableConfig } from '../../../shared/components/card-table/config/base-card-table.config';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ColumnCardTableConfig } from '../../../shared/components/card-table/config/column-card-table.config';
import { dateToString } from '../../../shared/utils/date.util';
import { CardTableComponent } from '../../../shared/components/card-table/card-table.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ProtocolStore } from '../../../../core/stores/protocol.store';
import { BaseCardTableActionConfig } from '../../../shared/components/card-table/config/base-card-table-action.config';
import { ActionCardTableComponent } from '../../../shared/components/card-table/action-card-table.component';
import { HasPermissionDirective } from '../../../../core/has-permission.directive';
import { AuthService } from '../../../authentication/services/auth.service';
import {
  FormOfProtocolOptionsModel,
  ProtocolOptionsModel,
  ProtocolOptionsModelOfForm,
} from '../../../../models/options/protocol.options';
import { SearchReturn } from '../../../../core/models/search-return.model';
import { ProtocolGrid } from '../../../../models/grid/protocol.grid';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../../../core/components/loading/loading.component';
import { alertApiError } from '../../../../core/operators/api-alert-error.operator';

@Component({
  selector: 'app-protocols-list',
  standalone: true,
  imports: [
    CardTableComponent,
    CommonModule,
    ActionCardTableComponent,
    ReactiveFormsModule,
    HasPermissionDirective,
  ],
  templateUrl: './protocols-list.component.html',
  styleUrl: './protocols-list.component.scss',
  providers: [ProtocolStore],
})
export class ProtocolsListComponent {
  form!: FormGroup;
  cardTableModel!: ProtocolBaseCardTableConfig;
  editCardTableActionConfig: EditCardTableActionConfig = new EditCardTableActionConfig(
    this.router,
    this.activatedRoute,
    this.authService
  );
  viewCardTableActionConfig: ViewCardTableActionConfig = new ViewCardTableActionConfig(
    this.router,
    this.activatedRoute
  );

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private protocolStore: ProtocolStore,
    private authService: AuthService,
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
    this.cardTableModel.actualOptions = ProtocolOptionsModelOfForm(this.form);
    this.cardTableModel.refreshRegisters();
  }

  clickAddNew(): void {
    this.router.navigate(['form'], { relativeTo: this.activatedRoute });
  }

  private _initTable(): void {
    this.cardTableModel = new ProtocolBaseCardTableConfig(this.protocolStore, this.alertService);
  }

  private _initForm(): void {
    this.form = FormOfProtocolOptionsModel();
  }
}

class ProtocolBaseCardTableConfig extends BaseCardTableConfig {
  get actualOptions(): ProtocolOptionsModel {
    return <ProtocolOptionsModel>this.options;
  }
  set actualOptions(op: ProtocolOptionsModel) {
    (<ProtocolOptionsModel>this.options).page = 1;
    (<ProtocolOptionsModel>this.options).id = op.id;
    (<ProtocolOptionsModel>this.options).term = op.term;
  }
  constructor(
    private protocolStore: ProtocolStore,
    private alertService: AlertService
  ) {
    super();
    this.columns = this._mountColumns();
  }
  public override refreshRegisters(): void {
    this.protocolStore
      .search(this.options)
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
        width: 70,
      },
      {
        title: 'Abreviação',
        field: 'abbreviation',
        sortable: true,
        width: 10,
      },
      {
        title: 'Vigência inicial',
        field: 'initialValidity',
        sortable: true,
        width: 10,
        convert: (value: Date) => dateToString(value, false),
      },
      {
        title: 'Vigência final',
        field: 'finalValidity',
        sortable: true,
        convert: (value: Date) => (!value ? 'indefinida' : dateToString(value, false)),
        width: 10,
      },
    ] as ColumnCardTableConfig[];
  }
}

class EditCardTableActionConfig extends BaseCardTableActionConfig {
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) {
    super();
    this.iconClass = 'fa-solid fa-pencil';
    this.tooltip = 'Editar';
    this._hasPermission = this.authService.hasPermission('configuracao-sistema.projetos.form.edit');
  }
  private _hasPermission: boolean = false;
  override isVisible(line: ProtocolGrid): boolean {
    return this._hasPermission;
  }
  public override click(line: ProtocolGrid): void {
    this.router.navigate(['form', line.id], {
      relativeTo: this.activatedRoute,
      queryParams: {
        editing: true,
      },
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
  public override click(line: ProtocolGrid): void {
    this.router.navigate(['form', line.id], {
      relativeTo: this.activatedRoute,
      queryParams: {
        editing: false,
      },
    });
  }
}
