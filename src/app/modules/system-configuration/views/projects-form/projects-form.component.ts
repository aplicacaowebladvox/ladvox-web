import { CommonModule, Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SystemProjectStore } from '../../../../core/stores/system-project.store';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormOfSystemLandingPageProjectModel,
  SystemLandingPageProjectModelOfForm,
} from '../../../../models/system-landing-page-project.model';
import { EditorModule } from 'primeng/editor';
import { AuthService } from '../../../authentication/services/auth.service';
import { HasPermissionDirective } from '../../../../core/has-permission.directive';
import { AlertService } from '../../../../core/services/alert.provided.service';
import { LoadingComponent } from '../../../../core/components/loading/loading.component';
import { finalize } from 'rxjs';
import { alertApiError } from '../../../../core/operators/api-alert-error.operator';

@Component({
  selector: 'app-projects-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EditorModule,
    HasPermissionDirective,
    LoadingComponent,
  ],
  templateUrl: './projects-form.component.html',
  styleUrl: './projects-form.component.scss',
  providers: [SystemProjectStore],
})
export class ProjectsFormComponent implements OnInit {
  @Input()
  id?: number;
  form!: FormGroup;
  isLoading: boolean = false;

  private _editing: boolean | null = false;
  private _hasPermissionFormEdit: boolean = false;
  get editing(): boolean | null {
    return this._editing;
  }
  constructor(
    private systemProjectStore: SystemProjectStore,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private authService: AuthService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this._hasPermissionFormEdit = this.authService.hasPermission(
      'configuracao-sistema.projetos.form.edit'
    );
    this.activatedRoute.queryParams.pipe(alertApiError()).subscribe({
      next: (params) => {
        this._editing = params['editing'] == undefined ? null : params['editing'] == 'true';
        if (this.editing && !this._hasPermissionFormEdit) this.location.back();
        this._initForm();
      },
    });
  }
  clickCreate(): void {
    this.systemProjectStore
      .insert(SystemLandingPageProjectModelOfForm(this.form))
      .pipe(alertApiError())
      .subscribe({
        next: (model) => {
          this.router.navigate(['configuracoes', 'projetos', model.id], {
            queryParams: { editing: false },
          });
        },
      });
  }
  clickRemove(): void {
    this.isLoading = true;
    this.systemProjectStore
      .delete(this.id)
      .pipe(
        finalize(() => (this.isLoading = false)),
        alertApiError()
      )
      .subscribe({
        next: () => this.clickBack(),
      });
  }
  clickSave(): void {
    this.isLoading = true;
    this.systemProjectStore
      .update(this.id!, SystemLandingPageProjectModelOfForm(this.form))
      .pipe(
        finalize(() => (this.isLoading = false)),
        alertApiError()
      )
      .subscribe({
        next: (model) => {
          this.clickBack();
        },
      });
  }
  clickBack(): void {
    this.router.navigate(['configuracoes', 'projetos']);
  }
  private _initForm(): void {
    if (this.id) {
      this.isLoading = true;
      this.systemProjectStore
        .getById(this.id)
        .pipe(
          finalize(() => (this.isLoading = false)),
          alertApiError()
        )
        .subscribe({
          next: (model) => {
            this.form = FormOfSystemLandingPageProjectModel(model);
            this._changeFormControlStatus(this.form, !!this.editing);
          },
        });
    } else {
      this.form = FormOfSystemLandingPageProjectModel();
      this._changeFormControlStatus(this.form, true);
    }
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
