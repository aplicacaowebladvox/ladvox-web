import { AuthService } from './../../../authentication/services/auth.service';
import { Component, Input, OnInit } from '@angular/core';
import { SystemSocialMediaStore } from '../../../../core/stores/system-social-media.store';
import { CommonModule, Location } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { DropdownModule } from 'primeng/dropdown';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormOfSystemSocialMediaModel,
  SystemSocialMediaModelOfForm,
} from '../../../../models/system-landing-page-social-media.model';
import { HasPermissionDirective } from '../../../../core/has-permission.directive';
import { AlertService } from '../../../../core/services/alert.provided.service';
import { LoadingComponent } from '../../../../core/components/loading/loading.component';
import { finalize } from 'rxjs';
import { alertApiError } from '../../../../core/operators/api-alert-error.operator';

@Component({
  selector: 'app-social-media-form',
  standalone: true,
  imports: [
    CommonModule,
    DropdownModule,
    ReactiveFormsModule,
    HasPermissionDirective,
    LoadingComponent,
  ],
  templateUrl: './social-media-form.component.html',
  styleUrl: './social-media-form.component.scss',
  providers: [SystemSocialMediaStore],
})
export class SocialMediaFormComponent implements OnInit {
  @Input()
  id?: number;
  form!: FormGroup;
  isLoading: boolean = false;

  iconClassAvailableSelectOptions!: any[];

  private _editing: boolean | null = false;
  private _hasPermissionFormEdit: boolean = false;
  get editing(): boolean | null {
    return this._editing;
  }
  constructor(
    private systemSocialMediaStore: SystemSocialMediaStore,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private authService: AuthService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this._hasPermissionFormEdit = this.authService.hasPermission(
      'configuracao-sistema.redes-sociais.form.edit'
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
  canShow(item: string): boolean {
    switch (item) {
      case 'buttonCreate':
        return !this.id;
      case 'buttonRemove':
      case 'buttonSave':
        return this.editing == true;
    }
    return false;
  }

  clickCreate(): void {
    this.systemSocialMediaStore
      .insert(SystemSocialMediaModelOfForm(this.form))
      .pipe(alertApiError())
      .subscribe({
        next: (model) => {
          this.router.navigate(['configuracoes', 'redes-sociais', model.id], {
            queryParams: { editing: false },
          });
        },
      });
  }
  clickRemove(): void {
    this.systemSocialMediaStore
      .delete(this.id)
      .pipe(alertApiError())
      .subscribe({
        next: () => this.clickBack(),
      });
  }
  clickSave(): void {
    this.isLoading = true;
    this.systemSocialMediaStore
      .update(this.id!, SystemSocialMediaModelOfForm(this.form))
      .pipe(
        finalize(() => (this.isLoading = false)),
        alertApiError()
      )
      .subscribe({
        next: () => {
          this.router.navigate(['configuracoes', 'redes-sociais']);
        },
      });
  }

  clickBack(): void {
    this.router.navigate(['configuracoes', 'redes-sociais']);
  }
  private _initForm(): void {
    if (this.id) {
      this.isLoading = true;
      this.systemSocialMediaStore
        .getById(this.id)
        .pipe(
          finalize(() => (this.isLoading = false)),
          alertApiError()
        )
        .subscribe({
          next: (model) => {
            this.form = FormOfSystemSocialMediaModel(model);
            this._changeFormControlStatus(this.form, !!this.editing);
          },
        });
    } else {
      this.form = FormOfSystemSocialMediaModel();
      this._changeFormControlStatus(this.form, true);
    }
  }
  private _initSelectOptions(): void {
    this.systemSocialMediaStore
      .getIconClassAvailableForSelectOptions()
      .pipe(alertApiError())
      .subscribe({
        next: (icons) => (this.iconClassAvailableSelectOptions = icons),
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
