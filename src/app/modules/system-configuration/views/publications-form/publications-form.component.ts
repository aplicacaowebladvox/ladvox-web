import { AlertService } from './../../../../core/services/alert.provided.service';
import { CommonModule, Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EditorModule } from 'primeng/editor';
import { SystemPublicationStore } from '../../../../core/stores/system-publication.store';
import {
  FormOfSystemLandingPagePublicationModel,
  SystemLandingPagePublicationModelOfForm,
} from '../../../../models/system-landing-page-publication.model';
import { ActionCardTableComponent } from '../../../shared/components/card-table/action-card-table.component';
import { CardTableComponent } from '../../../shared/components/card-table/card-table.component';
import { isLink } from '../../../shared/utils/string.util';
import { AuthService } from '../../../authentication/services/auth.service';
import { HasPermissionDirective } from '../../../../core/has-permission.directive';
import { LoadingComponent } from '../../../../core/components/loading/loading.component';
import { finalize } from 'rxjs';
import { alertApiError } from '../../../../core/operators/api-alert-error.operator';

@Component({
  selector: 'app-publications-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EditorModule,
    HasPermissionDirective,
    LoadingComponent,
  ],
  templateUrl: './publications-form.component.html',
  styleUrl: './publications-form.component.scss',
  providers: [SystemPublicationStore],
})
export class PublicationsFormComponent implements OnInit {
  @Input()
  id?: number;
  form!: FormGroup;
  isLoading: boolean = false;
  isLink = isLink;

  private _editing: boolean | null = false;
  private _hasPermissionFormEdit: boolean = false;
  get editing(): boolean | null {
    return this._editing;
  }
  constructor(
    private systemPublicationStore: SystemPublicationStore,
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
      },
    });
  }
  canShow(item: string): boolean {
    switch (item) {
      case 'buttonCreate':
        return !this.id;
      case 'buttonRemove':
      case 'buttonSave':
        return !!this.id;
    }
    return false;
  }

  clickCreate(): void {
    this.systemPublicationStore
      .insert(SystemLandingPagePublicationModelOfForm(this.form))
      .pipe(alertApiError())
      .subscribe({
        next: (model) => {
          this.router.navigate(['configuracoes', 'publicacoes', model.id], {
            queryParams: { editing: false },
          });
        },
      });
  }
  clickRemove(): void {
    this.isLoading = true;
    this.systemPublicationStore
      .delete(this.id!)
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
    this.systemPublicationStore
      .update(this.id!, SystemLandingPagePublicationModelOfForm(this.form))
      .pipe(
        finalize(() => (this.isLoading = false)),
        alertApiError()
      )
      .subscribe({
        next: () => {
          this.router.navigate(['configuracoes', 'publicacoes']);
        },
      });
  }

  clickBack(): void {
    this.router.navigate(['configuracoes', 'publicacoes']);
  }
  private _initForm(): void {
    if (this.id) {
      this.isLoading = true;
      this.systemPublicationStore
        .getById(this.id)
        .pipe(
          finalize(() => (this.isLoading = false)),
          alertApiError()
        )
        .subscribe({
          next: (model) => {
            this.form = FormOfSystemLandingPagePublicationModel(model);
            this._changeFormControlStatus(this.form, !!this.editing);
          },
        });
    } else {
      this.form = FormOfSystemLandingPagePublicationModel();
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
