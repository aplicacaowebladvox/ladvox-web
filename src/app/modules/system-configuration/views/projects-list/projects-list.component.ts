import { Component, OnInit } from '@angular/core';
import { SystemProjectStore } from '../../../../core/stores/system-project.store';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { ActionCardTableComponent } from '../../../shared/components/card-table/action-card-table.component';
import { CardTableComponent } from '../../../shared/components/card-table/card-table.component';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormOfSystemLandingPageProjectOptions,
  SystemLandingPageProjectOptions,
  SystemLandingPageProjectOptionsOfForm,
} from '../../../../models/options/system-landing-page-project.options';
import { BaseCardTableConfig } from '../../../shared/components/card-table/config/base-card-table.config';
import { SearchReturn } from '../../../../core/models/search-return.model';
import { ColumnCardTableConfig } from '../../../shared/components/card-table/config/column-card-table.config';
import { BaseCardTableActionConfig } from '../../../shared/components/card-table/config/base-card-table-action.config';
import { BaseGridOptions } from '../../../shared/components/card-table/models/base-grid-options.model';
import { AuthService } from '../../../authentication/services/auth.service';
import { HasPermissionDirective } from '../../../../core/has-permission.directive';
import { AlertService } from '../../../../core/services/alert.provided.service';
import { finalize } from 'rxjs';
import { LoadingComponent } from '../../../../core/components/loading/loading.component';
import { alertApiError } from '../../../../core/operators/api-alert-error.operator';

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DropdownModule,
    ActionCardTableComponent,
    CardTableComponent,
    HasPermissionDirective,
    LoadingComponent,
  ],
  templateUrl: './projects-list.component.html',
  styleUrl: './projects-list.component.scss',
  providers: [SystemProjectStore],
})
export class ProjectsListComponent implements OnInit {
  form!: FormGroup;
  isLoading: boolean = false;

  table!: SystemProjectBaseCardTableConfig;
  viewCardTableActionConfig!: ViewCardTableActionConfig;
  editCardTableActionConfig!: EditCardTableActionConfig;
  removeCardTableActionConfig!: RemoveCardTableActionConfig;
  constructor(
    private systemProjectStore: SystemProjectStore,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private alertService: AlertService
  ) {}
  ngOnInit(): void {
    this._initForm();
    this._initTable();
  }
  clickClean(): void {
    this._initForm();
  }
  clickFilter(): void {
    this.table.actualOptions = SystemLandingPageProjectOptionsOfForm(this.form);
    this.table.refreshRegisters();
  }
  clickAddNew(): void {
    this.router.navigate(['form'], { relativeTo: this.activatedRoute });
  }
  private _initForm(): void {
    this.form = FormOfSystemLandingPageProjectOptions();
  }
  private _initTable(): void {
    this.table = new SystemProjectBaseCardTableConfig(this.systemProjectStore, this.alertService);
    this.viewCardTableActionConfig = new ViewCardTableActionConfig(
      this.router,
      this.activatedRoute
    );
    this.editCardTableActionConfig = new EditCardTableActionConfig(
      this.router,
      this.activatedRoute,
      this.authService
    );
    this.removeCardTableActionConfig = new RemoveCardTableActionConfig(
      this.table,
      this.systemProjectStore,
      this.authService,
      this.alertService,
      this
    );
  }
}

class SystemProjectBaseCardTableConfig extends BaseCardTableConfig {
  get actualOptions(): SystemLandingPageProjectOptions {
    return <SystemLandingPageProjectOptions>this.options;
  }
  set actualOptions(op: SystemLandingPageProjectOptions) {
    (<SystemLandingPageProjectOptions>this.options).page = 1;
    (<SystemLandingPageProjectOptions>this.options).id = op.id;
    (<SystemLandingPageProjectOptions>this.options).term = op.term;
  }
  constructor(
    private systemProjectStore: SystemProjectStore,
    private alertService: AlertService
  ) {
    super();
    this.columns = this._mountColumns();
  }
  public override refreshRegisters(): void {
    this.isLoading = true;
    this.systemProjectStore
      .search(<SystemLandingPageProjectOptions>this.options)
      .pipe(
        finalize(() => (this.isLoading = false)),
        alertApiError()
      )
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
        title: 'Título',
        field: 'title',
        width: 80,
      },
      {
        title: 'Situação',
        field: 'status',
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
    this._hasPermission = this.authService.hasPermission('configuracao-sistema.projetos.form.edit');
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
    private store: SystemProjectStore,
    private authService: AuthService,
    private alertService: AlertService,
    private parent: ProjectsListComponent
  ) {
    super();
    this.iconClass = 'fa-solid fa-trash-can';
    this.tooltip = 'Remover';
    this._hasPermission = this.authService.hasPermission('configuracao-sistema.projetos.delete');
  }
  private _hasPermission: boolean = false;
  override isVisible(line: any): boolean {
    return this._hasPermission;
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
