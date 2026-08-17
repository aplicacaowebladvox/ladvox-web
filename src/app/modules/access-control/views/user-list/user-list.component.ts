import { Component, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  FormOfUserOptionsModel,
  UserOptionsModelOfForm,
} from '../../../../models/options/user.options';
import { CommonModule } from '@angular/common';
import { MultiSelectModule } from 'primeng/multiselect';
import { RoleStore } from '../../../../core/stores/role.store';
import { BaseCardTableConfig } from '../../../shared/components/card-table/config/base-card-table.config';
import { ColumnCardTableConfig } from '../../../shared/components/card-table/config/column-card-table.config';
import { BaseCardTableActionConfig } from '../../../shared/components/card-table/config/base-card-table-action.config';
import { ActivatedRoute, Router } from '@angular/router';
import { UserStore } from '../../../../core/stores/user.store';
import { SearchReturn } from '../../../../core/models/search-return.model';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { ActionCardTableComponent } from '../../../shared/components/card-table/action-card-table.component';
import { CardTableComponent } from '../../../shared/components/card-table/card-table.component';
import { HasPermissionDirective } from '../../../../core/has-permission.directive';
import { AuthService } from '../../../authentication/services/auth.service';
import { SelectOptionModel } from '../../../../core/models/select-option.model';
import { UserOptionsModel } from '../../../../models/options/user.options';
import { UserGrid } from '../../../../models/grid/user.grid';
import { AlertService } from '../../../../core/services/alert.provided.service';
import { alertApiError } from '../../../../core/operators/api-alert-error.operator';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MultiSelectModule,
    NgxMaskDirective,
    ActionCardTableComponent,
    CardTableComponent,
    HasPermissionDirective,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
  providers: [provideNgxMask(), RoleStore, UserStore],
})
export class UserListComponent implements OnInit {
  form!: FormGroup;
  rolesAvailablesSelectOptions!: SelectOptionModel<string, string>[];

  cardTableModel!: UserBaseCardTableConfig;
  editCardTableActionConfig!: EditCardTableActionConfig;
  viewCardTableActionConfig!: ViewCardTableActionConfig;
  removeCardTableActionConfig!: RemoveCardTableActionConfig;

  constructor(
    private roleStore: RoleStore,
    private store: UserStore,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private alertService: AlertService
  ) {}
  ngOnInit(): void {
    this._initTable();
    this._initSelectOptions();
    this._initForm();
  }
  clickClean(): void {
    this._initForm();
    this.cardTableModel.clear();
  }
  clickFilter(): void {
    this.cardTableModel.actualOptions = UserOptionsModelOfForm(this.form);
    this.cardTableModel.refreshRegisters();
  }
  clickAddNew(): void {
    this.router.navigate(['form'], { relativeTo: this.activatedRoute });
  }
  private _initSelectOptions(): void {
    this.roleStore
      .getSelectOptions()
      .pipe(alertApiError())
      .subscribe({
        next: (items) => {
          this.rolesAvailablesSelectOptions = items;
        },
      });
  }
  private _initForm(): void {
    this.form = FormOfUserOptionsModel();
  }
  private _initTable(): void {
    this.cardTableModel = new UserBaseCardTableConfig(this.store, this.alertService);
    this.editCardTableActionConfig = new EditCardTableActionConfig(
      this.router,
      this.activatedRoute,
      this.authService
    );
    this.viewCardTableActionConfig = new ViewCardTableActionConfig(
      this.router,
      this.activatedRoute
    );
    this.removeCardTableActionConfig = new RemoveCardTableActionConfig(
      this.cardTableModel,
      this.store,
      this.authService,
      this.alertService
    );
  }
}

class UserBaseCardTableConfig extends BaseCardTableConfig {
  get actualOptions(): UserOptionsModel {
    return <UserOptionsModel>this.options;
  }
  set actualOptions(op: UserOptionsModel) {
    (<UserOptionsModel>this.options).page = 1;
    (<UserOptionsModel>this.options).id = op.id;
    (<UserOptionsModel>this.options).name = op.name;
    (<UserOptionsModel>this.options).document = op.document;
    (<UserOptionsModel>this.options).roleIds = op.roleIds;
  }
  constructor(
    private userStore: UserStore,
    private alertService: AlertService
  ) {
    super();
    this.columns = this._mountColumns();
  }
  public override refreshRegisters(): void {
    this.userStore
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
        title: 'Nome',
        field: 'name',
        sortable: true,
        width: 80,
      },
      {
        title: 'Documento',
        field: 'document',
        sortable: true,
        convert: (value: string) => {
          if (!value) return '';
          if (value.length == 11)
            return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
          if (value.length == 14)
            return value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
          else return value;
        },
        width: 20,
      },
      {
        title: 'Papéis',
        field: 'roles',
        width: 100,
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
    this._hasPermission = this.authService.hasPermission('controle-acesso.usuarios.form.edit');
  }
  private _hasPermission: boolean = false;
  override isVisible(line: UserGrid): boolean {
    return this._hasPermission && !line.inactivationDate;
  }
  public override click(line: any): void {
    this.router.navigate([line.id], {
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
  public override click(line: any): void {
    this.router.navigate([line.id], {
      relativeTo: this.activatedRoute,
      queryParams: {
        editing: false,
      },
    });
  }
}

class RemoveCardTableActionConfig extends BaseCardTableActionConfig {
  constructor(
    private table: BaseCardTableConfig,
    private store: UserStore,
    private authService: AuthService,
    private alertService: AlertService
  ) {
    super();
    this.iconClass = 'fa-solid fa-trash-can';
    this.tooltip = 'Remover';
    this._hasPermission = this.authService.hasPermission('controle-acesso.usuarios.form.delete');
  }
  private _hasPermission: boolean = false;
  override isVisible(line: UserGrid): boolean {
    return this._hasPermission && !line.inactivationDate;
  }
  public override click(line: any): void {
    this.store
      .delete(line.id)
      .pipe(alertApiError())
      .subscribe({
        next: () => this.table.refreshRegisters(),
      });
  }
}
