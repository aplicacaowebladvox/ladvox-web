import { Component, OnInit } from '@angular/core';
import { SystemPublicationStore } from '../../../../core/stores/system-publication.store';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchReturn } from '../../../../core/models/search-return.model';
import { BaseCardTableActionConfig } from '../../../shared/components/card-table/config/base-card-table-action.config';
import { BaseCardTableConfig } from '../../../shared/components/card-table/config/base-card-table.config';
import { ColumnCardTableConfig } from '../../../shared/components/card-table/config/column-card-table.config';
import {
  FormOfSystemLandingPagePublicationOptions,
  SystemLandingPagePublicationOptions,
  SystemLandingPagePublicationOptionsOfForm,
} from '../../../../models/options/system-landing-page-publication.options';
import { CardTableComponent } from '../../../shared/components/card-table/card-table.component';
import { ActionCardTableComponent } from '../../../shared/components/card-table/action-card-table.component';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../authentication/services/auth.service';
import { HasPermissionDirective } from '../../../../core/has-permission.directive';
import { AlertService } from '../../../../core/services/alert.provided.service';
import { LoadingComponent } from '../../../../core/components/loading/loading.component';
import { finalize } from 'rxjs';
import { alertApiError } from '../../../../core/operators/api-alert-error.operator';

@Component({
  selector: 'app-publications-list',
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
  templateUrl: './publications-list.component.html',
  styleUrl: './publications-list.component.scss',
  providers: [SystemPublicationStore],
})
export class PublicationsListComponent implements OnInit {
  form!: FormGroup;
  isLoading: boolean = false;

  table!: SystemPublicationBaseCardTableConfig;
  viewCardTableActionConfig!: ViewCardTableActionConfig;
  editCardTableActionConfig!: EditCardTableActionConfig;
  removeCardTableActionConfig!: RemoveCardTableActionConfig;
  constructor(
    private systemPublicationStore: SystemPublicationStore,
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
    this.table.clear();
  }
  clickFilter(): void {
    this.table.actualOptions = SystemLandingPagePublicationOptionsOfForm(this.form);
    this.table.refreshRegisters();
  }
  clickAddNew(): void {
    this.router.navigate(['form'], { relativeTo: this.activatedRoute });
  }
  private _initForm(): void {
    this.form = FormOfSystemLandingPagePublicationOptions();
  }
  private _initTable(): void {
    this.table = new SystemPublicationBaseCardTableConfig(
      this.systemPublicationStore,
      this.alertService
    );
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
      this.systemPublicationStore,
      this.authService,
      this
    );
  }
}

class SystemPublicationBaseCardTableConfig extends BaseCardTableConfig {
  set actualOptions(op: SystemLandingPagePublicationOptions) {
    (<SystemLandingPagePublicationOptions>this.options).page = 1;
    (<SystemLandingPagePublicationOptions>this.options).id = op.id;
    (<SystemLandingPagePublicationOptions>this.options).term = op.term;
  }
  get actualOptions(): SystemLandingPagePublicationOptions {
    return <SystemLandingPagePublicationOptions>this.options;
  }
  constructor(
    private store: SystemPublicationStore,
    private alertService: AlertService
  ) {
    super();
    this.columns = this._mountColumns();
  }
  public override refreshRegisters(): void {
    this.isLoading = true;
    this.store
      .search(this.actualOptions)
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
        width: 100,
      },
      {
        title: 'Referência bibliografica',
        field: 'bibliographicReference',
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
    this._hasPermission = this.authService.hasPermission(
      'configuracao-sistema.publicacoes.form.edit'
    );
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
    private store: SystemPublicationStore,
    private authService: AuthService,
    private parent: PublicationsListComponent
  ) {
    super();
    this.iconClass = 'fa-solid fa-trash-can';
    this.tooltip = 'Remover';
    this._hasPermission = this.authService.hasPermission('configuracao-sistema.publicacoes.delete');
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
