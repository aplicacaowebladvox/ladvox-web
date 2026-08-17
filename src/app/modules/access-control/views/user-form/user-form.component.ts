import { SelectOptionModel } from './../../../../core/models/select-option.model';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormOfUserModel, UserModelOfForm } from '../../../../models/user.model';
import { CommonModule, Location } from '@angular/common';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { RoleStore } from '../../../../core/stores/role.store';
import { UserStore } from '../../../../core/stores/user.store';
import { ActivatedRoute, Router } from '@angular/router';
import { MultiSelectModule } from 'primeng/multiselect';
import { AuthService } from '../../../authentication/services/auth.service';
import { HasPermissionDirective } from '../../../../core/has-permission.directive';
import { PrimeNGConfig } from 'primeng/api';
import { translationConfig } from '../../../../config/primeng-translation.config';
import { AlertService } from '../../../../core/services/alert.provided.service';
import { finalize } from 'rxjs';
import { LoadingComponent } from '../../../../core/components/loading/loading.component';
import { alertApiError } from '../../../../core/operators/api-alert-error.operator';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    NgxMaskDirective,
    MultiSelectModule,
    HasPermissionDirective,
    LoadingComponent,
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
  providers: [provideNgxMask(), RoleStore, UserStore],
})
export class UserFormComponent implements OnInit {
  @Input('id')
  id?: number;
  form!: FormGroup;
  isLoading: boolean = false;
  rolesAvailablesSelectOptions!: SelectOptionModel<string, string>[];

  private _editing: boolean | null = false;
  private _hasPermissionFormEdit: boolean = false;
  get editing(): boolean | null {
    return this._editing;
  }
  constructor(
    private roleStore: RoleStore,
    private userStore: UserStore,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private authService: AuthService,
    private alertService: AlertService,
    primengConfig: PrimeNGConfig
  ) {
    primengConfig.setTranslation(translationConfig);
  }
  ngOnInit(): void {
    this._hasPermissionFormEdit = this.authService.hasPermission(
      'configuracao-sistema.projetos.form.edit'
    );
    this.activatedRoute.queryParams.pipe(alertApiError()).subscribe({
      next: (params) => {
        this._editing = params['editing'] == undefined ? null : params['editing'] == 'true';
        if (this.editing && !this._hasPermissionFormEdit) this.location.back();
        this._initSelectOptions();
        this._initForm();
      },
    });
  }
  clickBack(): void {
    this.router.navigate(['controle-acesso', 'usuario']);
  }
  clickCreate(): void {
    this.userStore
      .insert(UserModelOfForm(this.form))
      .pipe(alertApiError())
      .subscribe({
        next: (model) => {
          this.router.navigate(['controle-acesso', 'usuario', model.id], {
            queryParams: { editing: false },
          });
        },
      });
  }
  clickSave(): void {
    this.userStore
      .update(this.id!, UserModelOfForm(this.form))
      .pipe(alertApiError())
      .subscribe({
        next: (model) => {
          this.clickBack();
        },
      });
  }
  private _initForm(): void {
    if (this.id) {
      this.isLoading = true;
      this.userStore
        .getById(this.id)
        .pipe(
          finalize(() => (this.isLoading = false)),
          alertApiError()
        )
        .subscribe({
          next: (model) => {
            this.form = FormOfUserModel(model);
            if (!!model.inactivationDate) {
              this._editing = false;
              this._changeFormControlStatus(this.form, false);
            } else this._changeFormControlStatus(this.form, !!this.editing);
            this.form.controls['document'].disable();
          },
        });
    } else {
      this.form = FormOfUserModel();
      this._changeFormControlStatus(this.form, true);
    }
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
  private _changeFormControlStatus(f: FormGroup, enable: boolean = false): void {
    enable ? f.enable() : f.disable();
    Object.keys(f.controls).forEach((controlKey) => {
      if (enable) {
        f.get(controlKey)?.enable();
      } else {
        f.get(controlKey)?.disable();
      }
    });
    if (this.id) {
      f.get('document')?.disable();
    }
  }
}
