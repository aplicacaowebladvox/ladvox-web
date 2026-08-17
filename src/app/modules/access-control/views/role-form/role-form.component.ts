import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleStore } from '../../../../core/stores/role.store';
import { PermissionStore } from '../../../../core/stores/permission.store';
import { CommonModule, Location } from '@angular/common';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormOfRoleModel, RoleModelOfForm } from '../../../../models/role.model';
import { HasPermissionDirective } from '../../../../core/has-permission.directive';
import { AuthService } from '../../../authentication/services/auth.service';
import { SelectOptionModel } from '../../../../core/models/select-option.model';
import { AlertService } from '../../../../core/services/alert.provided.service';
import { LoadingComponent } from '../../../../core/components/loading/loading.component';
import { finalize } from 'rxjs';
import { alertApiError } from '../../../../core/operators/api-alert-error.operator';

@Component({
  selector: 'app-role-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MultiSelectModule,
    HasPermissionDirective,
    LoadingComponent,
  ],
  templateUrl: './role-form.component.html',
  styleUrl: './role-form.component.scss',
  providers: [PermissionStore, RoleStore],
})
export class PaperUserFormComponent implements OnInit {
  @Input('id')
  id?: number;
  form!: FormGroup;
  isLoading: boolean = false;
  permissionsAvailablesSelectOptions!: SelectOptionModel<string, string>[];

  private _editing: boolean | null = false;
  private _hasPermissionFormEdit: boolean = false;
  get editing(): boolean | null {
    return this._editing;
  }
  constructor(
    private store: RoleStore,
    private permissionStore: PermissionStore,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private authService: AuthService,
    private alertService: AlertService
  ) {}
  canShow(item: string): boolean {
    switch (item) {
      case 'buttonCreate':
        return !this.id;
      case 'buttonEvolution':
      case 'buttonAnamnesis':
      case 'buttonSave':
      case 'buttonQuestions':
        return !!this.id;
    }
    return false;
  }
  ngOnInit(): void {
    this._hasPermissionFormEdit = this.authService.hasPermission(
      'configuracao-sistema.projetos.form.edit'
    );
    this.activatedRoute.queryParams.pipe(alertApiError()).subscribe({
      next: (params) => {
        this._editing = params['editing'] == undefined ? null : params['editing'] == 'true';
        if (this.editing && !this._hasPermissionFormEdit) this.location.back();
        this._initForm();
        this._initSelectOptions();
      },
    });
  }
  clickBack(): void {
    this.router.navigate(['controle-acesso', 'papel']);
  }
  clickCreate(): void {
    this.isLoading = true;
    this.store
      .insert(RoleModelOfForm(this.form))
      .pipe(
        finalize(() => (this.isLoading = false)),
        alertApiError()
      )
      .subscribe({
        next: (model) => {
          this.router.navigate(['controle-acesso', 'papel', model.id], {
            queryParams: { editing: false },
          });
        },
      });
  }
  clickSave(): void {
    this.isLoading = true;
    this.store
      .update(this.id!, RoleModelOfForm(this.form))
      .pipe(
        finalize(() => (this.isLoading = false)),
        alertApiError()
      )
      .subscribe({
        next: () => {
          this.clickBack();
        },
      });
  }
  private _initForm(): void {
    if (this.id) {
      this.isLoading = true;
      this.store
        .getById(this.id)
        .pipe(
          finalize(() => (this.isLoading = false)),
          alertApiError()
        )
        .subscribe({
          next: (model) => {
            this.form = FormOfRoleModel(model);
            this._changeFormControlStatus(this.form, !!this.editing);
          },
        });
    } else {
      this.form = FormOfRoleModel();
      this._changeFormControlStatus(this.form, true);
    }
  }
  private _initSelectOptions(): void {
    this.permissionStore
      .getSelectOptions()
      .pipe(alertApiError())
      .subscribe({
        next: (items) => {
          this.permissionsAvailablesSelectOptions = items;
        },
      });
  }
  private _changeFormControlStatus(f: FormGroup, enable: boolean = false): void {
    enable ? f.enable() : f.disable();
    Object.keys(f.controls).forEach((controlKey) => {
      if (enable) {
        f.get(controlKey)?.enable();
      } else {
        f.get(controlKey)?.disable();
      }
    });
  }
}
