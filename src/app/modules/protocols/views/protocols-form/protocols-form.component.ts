import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EditorModule } from 'primeng/editor';
import { Location } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ProtocolStore } from '../../../../core/stores/protocol.store';
import { PrimeNGConfig } from 'primeng/api';
import { translationConfig } from '../../../../config/primeng-translation.config';
import { HasPermissionDirective } from '../../../../core/has-permission.directive';
import { AuthService } from '../../../authentication/services/auth.service';
import {
  FormOfProtocolFirstStepModel,
  ProtocolFirstStepModel,
  ProtocolFirstStepModelOfForm,
} from '../../../../models/protocol-first-step.model';
import { AlertService } from '../../../../core/services/alert.provided.service';
import { LoadingComponent } from '../../../../core/components/loading/loading.component';
import { finalize } from 'rxjs';
import { alertApiError } from '../../../../core/operators/api-alert-error.operator';

@Component({
  selector: 'app-protocols-form',
  standalone: true,
  imports: [
    CommonModule,
    EditorModule,
    ReactiveFormsModule,
    HasPermissionDirective,
    LoadingComponent,
  ],
  templateUrl: './protocols-form.component.html',
  styleUrl: './protocols-form.component.scss',
  providers: [ProtocolStore],
})
export class ProtocolsFormComponent implements OnInit {
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
    private router: Router,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private protocolStore: ProtocolStore,
    private authService: AuthService,
    private alertService: AlertService,
    primengConfig: PrimeNGConfig
  ) {
    primengConfig.setTranslation(translationConfig);
  }

  ngOnInit(): void {
    this._hasPermissionFormEdit = this.authService.hasPermission('protocolo.protocolo.form.edit');
    this.activatedRoute.queryParams.pipe(alertApiError()).subscribe({
      next: (params) => {
        this._editing = params['editing'] == undefined ? null : params['editing'] == 'true';
        if (this.editing && !this._hasPermissionFormEdit) this.location.back();
        this._loadPage();
      },
    });
  }

  canShow(item: string): boolean {
    switch (item) {
      case 'buttonCreate':
        return !this.id;
      case 'buttonSave':
      case 'buttonQuestions':
        return !!this.id;
    }
    return false;
  }

  clickCreate(): void {
    this.isLoading = true;
    this.protocolStore
      .insert(ProtocolFirstStepModelOfForm(this.form))
      .pipe(
        finalize(() => (this.isLoading = false)),
        alertApiError()
      )
      .subscribe({
        next: (protocol) =>
          this.router.navigate([protocol.id], {
            relativeTo: this.activatedRoute,
            queryParams: { editing: true },
          }),
      });
  }

  clickSave(): void {
    if (this.id) {
      this.isLoading = true;
      this.protocolStore
        .update(this.id!, ProtocolFirstStepModelOfForm(this.form))
        .pipe(
          finalize(() => (this.isLoading = false)),
          alertApiError()
        )
        .subscribe({
          next: () => {
            this.router.navigate([], {
              relativeTo: this.activatedRoute,
              queryParams: { editing: true },
            });
          },
        });
    } else {
      this.clickCreate();
    }
  }
  clickEnableEdit(): void {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { editing: true },
    });
  }
  clickBack(): void {
    this.router.navigate(['protocolos']);
  }
  clickQuestions(): void {
    this.router.navigate(['tipos-respostas'], {
      relativeTo: this.activatedRoute,
      queryParams: { editing: this.editing },
    });
  }
  private _loadPage(): void {
    this._getProtocol();
  }
  private _getProtocol(): void {
    if (this.id) {
      this.isLoading = true;
      this.protocolStore
        .get(this.id)
        .pipe(
          finalize(() => (this.isLoading = false)),
          alertApiError()
        )
        .subscribe({
          next: (data) => {
            this.form = FormOfProtocolFirstStepModel(<ProtocolFirstStepModel>data);
            this._changeFormControlStatus(this.form, !!this.editing);
          },
        });
    } else {
      this.form = FormOfProtocolFirstStepModel();
      this._changeFormControlStatus(this.form, true);
    }
  }

  private _changeFormControlStatus(f: FormGroup, enable: boolean = false): void {
    enable ? f.enable() : f.disable();
    Object.keys(f.controls).forEach((controlKey) => {
      if (f.get(controlKey) instanceof FormGroup) {
        this._changeFormControlStatus(<FormGroup>f.get(controlKey), enable);
      } else {
        if (enable) {
          f.get(controlKey)?.enable();
        } else {
          f.get(controlKey)?.disable();
        }
      }
    });
  }
}

interface MovingParam {
  editing: boolean;
}

interface FormValues {
  name: string | null;
  abbreviation: string | null;
  initialValidity: Date | null;
  finalValidity: Date | null;
  description: string | null;
}
