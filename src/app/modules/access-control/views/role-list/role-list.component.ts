import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BaseCardTableConfig } from '../../../shared/components/card-table/config/base-card-table.config';
import { SearchReturn } from '../../../../core/models/search-return.model';
import { ColumnCardTableConfig } from '../../../shared/components/card-table/config/column-card-table.config';
import { BaseCardTableActionConfig } from '../../../shared/components/card-table/config/base-card-table-action.config';
import { CommonModule } from '@angular/common';
import { ActionCardTableComponent } from '../../../shared/components/card-table/action-card-table.component';
import { CardTableComponent } from '../../../shared/components/card-table/card-table.component';
import { RoleStore } from '../../../../core/stores/role.store';
import { HasPermissionDirective } from '../../../../core/has-permission.directive';
import { AuthService } from '../../../authentication/services/auth.service';
import {
  FormOfRoleOptionsModel,
  RoleOptionsModel,
  RoleOptionsModelOfForm,
} from '../../../../models/options/role.options';
import { RoleGrid } from '../../../../models/grid/role.grid';
import { AlertService } from '../../../../core/services/alert.provided.service';
import { finalize } from 'rxjs';
import { LoadingComponent } from '../../../../core/components/loading/loading.component';
import { alertApiError } from '../../../../core/operators/api-alert-error.operator';

@Component({
  selector: 'app-role-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ActionCardTableComponent,
    CardTableComponent,
    HasPermissionDirective,
    LoadingComponent,
  ],
  templateUrl: './role-list.component.html',
  styleUrl: './role-list.component.scss',
  providers: [RoleStore],
})
export class PaperUserListComponent implements OnInit {
  form!: FormGroup;
  isLoading: boolean = false;

  cardTableModel!: PaperUserBaseCardTableConfig;
  editCardTableActionConfig!: EditCardTableActionConfig;
  viewCardTableActionConfig!: ViewCardTableActionConfig;
  removeCardTableActionConfig!: RemoveCardTableActionConfig;
  constructor(
    private store: RoleStore,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private alertService: AlertService
  ) {}
  ngOnInit(): void {
    this._initTable();
    this._initForm();
  }
  clickClean(): void {
    this._initForm();
  }
  clickFilter(): void {
    this.cardTableModel.actualOptions = RoleOptionsModelOfForm(this.form);
    this.cardTableModel.refreshRegisters();
  }
  clickAddNew(): void {
    this.router.navigate(['form'], { relativeTo: this.activatedRoute });
  }
  private _initForm(): void {
    this.form = FormOfRoleOptionsModel();
  }
  private _initTable(): void {
    this.cardTableModel = new PaperUserBaseCardTableConfig(this.store, this.alertService);
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
      this.alertService,
      this
    );
  }
}

class PaperUserBaseCardTableConfig extends BaseCardTableConfig {
  get actualOptions(): RoleOptionsModel {
    return <RoleOptionsModel>this.options;
  }
  set actualOptions(op: RoleOptionsModel) {
    (<RoleOptionsModel>this.options).page = 1;
    (<RoleOptionsModel>this.options).id = op.id;
    (<RoleOptionsModel>this.options).name = op.name;
  }
  constructor(
    private store: RoleStore,
    private alertService: AlertService
  ) {
    super();
    this.columns = this._mountColumns();
  }
  public override refreshRegisters(): void {
    this.store
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
        width: 80,
      },
      {
        title: 'Funções performadas',
        field: 'permissionsSize',
        width: 20,
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
    this._hasPermission = this.authService.hasPermission('controle-acesso.papeis.form.edit');
  }
  private _hasPermission: boolean = false;
  override isVisible(line: any): boolean {
    return this._hasPermission;
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
    private store: RoleStore,
    private authService: AuthService,
    private alertService: AlertService,
    private parent: PaperUserListComponent
  ) {
    super();
    this.iconClass = 'fa-solid fa-trash-can';
    this.tooltip = 'Remover';
    this._hasPermission = this.authService.hasPermission('controle-acesso.papeis.form.delete');
  }
  private _hasPermission: boolean = false;
  override isVisible(line: RoleGrid): boolean {
    return this._hasPermission && line.canRemove;
  }
  public override click(line: any): void {
    this.parent.isLoading = true;
    this.store
      .delete(line.id)
      .pipe(
        finalize(() => (this.parent.isLoading = false)),
        alertApiError()
      )
      .subscribe({
        next: () => this.table.refreshRegisters(),
      });
  }
}
