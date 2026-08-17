import { AuthService } from './../../../authentication/services/auth.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SystemSocialMediaStore } from '../../../../core/stores/system-social-media.store';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchReturn } from '../../../../core/models/search-return.model';
import { BaseCardTableActionConfig } from '../../../shared/components/card-table/config/base-card-table-action.config';
import { BaseCardTableConfig } from '../../../shared/components/card-table/config/base-card-table.config';
import { ColumnCardTableConfig } from '../../../shared/components/card-table/config/column-card-table.config';
import {
  FormOfSystemSocialMediaOptions,
  SystemSocialMediaOptions,
  SystemSocialMediaOptionsOfForm,
} from '../../../../models/options/system-social-media.options';
import { DropdownModule } from 'primeng/dropdown';
import { ActionCardTableComponent } from '../../../shared/components/card-table/action-card-table.component';
import { CardTableComponent } from '../../../shared/components/card-table/card-table.component';
import { SystemSocialMediaModel } from '../../../../models/system-landing-page-social-media.model';
import { HasPermissionDirective } from '../../../../core/has-permission.directive';
import { AlertService } from '../../../../core/services/alert.provided.service';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { finalize } from 'rxjs';
import { alertApiError } from '../../../../core/operators/api-alert-error.operator';

@Component({
  selector: 'app-social-media-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DropdownModule,
    ActionCardTableComponent,
    CardTableComponent,
    HasPermissionDirective,
    NgxSkeletonLoaderModule,
  ],
  templateUrl: './social-media-list.component.html',
  styleUrl: './social-media-list.component.scss',
  providers: [SystemSocialMediaStore],
})
export class SocialMediaListComponent implements OnInit {
  form!: FormGroup;
  isLoading: boolean = false;

  iconClassAvailableSelectOptions!: any[];

  systemSocialMediaBaseCardTableConfig!: SystemSocialMediaBaseCardTableConfig;
  viewCardTableActionConfig!: ViewCardTableActionConfig;
  editCardTableActionConfig!: EditCardTableActionConfig;
  removeCardTableActionConfig!: RemoveCardTableActionConfig;
  constructor(
    private systemSocialMediaStore: SystemSocialMediaStore,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private alertService: AlertService
  ) {}
  ngOnInit(): void {
    this._initForm();
    this._initSelectOptions();
    this._initTable();
  }
  clickClean(): void {
    this._initForm();
    this.systemSocialMediaBaseCardTableConfig.clear();
  }
  clickFilter(): void {
    this.systemSocialMediaBaseCardTableConfig.actualOptions = SystemSocialMediaOptionsOfForm(
      this.form
    );
    this.systemSocialMediaBaseCardTableConfig.refreshRegisters();
  }
  clickAddNew(): void {
    this.router.navigate(['form'], { relativeTo: this.activatedRoute });
  }
  private _initForm(): void {
    this.form = FormOfSystemSocialMediaOptions();
  }
  private _initSelectOptions(): void {
    this.systemSocialMediaStore
      .getIconClassAvailableForSelectOptions()
      .pipe(alertApiError())
      .subscribe({
        next: (icons) => (this.iconClassAvailableSelectOptions = icons),
      });
  }
  private _initTable(): void {
    this.systemSocialMediaBaseCardTableConfig = new SystemSocialMediaBaseCardTableConfig(
      this.systemSocialMediaStore,
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
      this.systemSocialMediaBaseCardTableConfig,
      this.systemSocialMediaStore,
      this.authService,
      this.alertService,
      this
    );
  }
}

class SystemSocialMediaBaseCardTableConfig extends BaseCardTableConfig {
  set actualOptions(op: SystemSocialMediaOptions) {
    (<SystemSocialMediaOptions>this.options).page = 1;
    (<SystemSocialMediaOptions>this.options).id = op.id;
    (<SystemSocialMediaOptions>this.options).iconClass = op.iconClass;
    (<SystemSocialMediaOptions>this.options).title = op.title;
  }
  get actualOptions(): SystemSocialMediaOptions {
    return <SystemSocialMediaOptions>this.options;
  }
  constructor(
    private systemSocialMediaStore: SystemSocialMediaStore,
    private alertService: AlertService
  ) {
    super();
    this.columns = this._mountColumns();
  }
  public override refreshRegisters(): void {
    this.isLoading = true;
    this.systemSocialMediaStore
      .search(<SystemSocialMediaOptions>this.options)
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
        title: 'Ícone',
        field: 'iconClass',
        convertStyleByLine: (socialMedia: SystemSocialMediaModel) =>
          `font-size:24px;${socialMedia.iconColor ? 'color:' + socialMedia.iconColor + ';' : ''}`,
        convert: (iconClass: string) => {
          return `<i class="${iconClass}"></i>`;
        },
        width: 20,
      },
      {
        title: 'URL',
        field: 'url',
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
      'configuracao-sistema.redes-sociais.form.edit'
    );
  }
  private _hasPermission: boolean = false;
  override isVisible(line: SystemSocialMediaModel): boolean {
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
    private systemSocialMediaBaseCardTableConfig: SystemSocialMediaBaseCardTableConfig,
    private systemSocialMediaStore: SystemSocialMediaStore,
    private authService: AuthService,
    private alertService: AlertService,
    private parent: SocialMediaListComponent
  ) {
    super();
    this.iconClass = 'fa-solid fa-trash-can';
    this.tooltip = 'Remover';
    this._hasPermission = this.authService.hasPermission(
      'configuracao-sistema.redes-sociais.delete'
    );
  }
  private _hasPermission: boolean = false;
  override isVisible(line: SystemSocialMediaModel): boolean {
    return this._hasPermission;
  }
  public override click(line: any): void {
    this.parent.isLoading = true;
    this.systemSocialMediaStore
      .delete(line.id)
      .pipe(
        finalize(() => (this.parent.isLoading = false)),
        alertApiError()
      )
      .subscribe({
        next: () => this.systemSocialMediaBaseCardTableConfig.refreshRegisters(),
      });
  }
}
