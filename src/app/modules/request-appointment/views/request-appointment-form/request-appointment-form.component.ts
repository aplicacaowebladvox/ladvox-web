import { RequestAppointmentStore } from './../../../../core/stores/request-appointment.store';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EditorModule } from 'primeng/editor';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import {
  FormOfRequestAppointmentModel,
  RequestAppointmentModel,
} from '../../../../models/request-appointment.model';
import { AlertService } from '../../../../core/services/alert.provided.service';
import { HasPermissionDirective } from '../../../../core/has-permission.directive';
import { finalize } from 'rxjs';
import { LoadingComponent } from '../../../../core/components/loading/loading.component';
import { alertApiError } from '../../../../core/operators/api-alert-error.operator';

@Component({
  selector: 'app-request-appointment-form',
  standalone: true,
  imports: [
    CommonModule,
    EditorModule,
    NgxMaskDirective,
    ReactiveFormsModule,
    HasPermissionDirective,
    LoadingComponent,
  ],
  templateUrl: './request-appointment-form.component.html',
  styleUrl: './request-appointment-form.component.scss',
  providers: [RequestAppointmentStore, provideNgxMask()],
})
export class RequestAppointmentFormComponent implements OnInit {
  @Input('id')
  id!: number;
  form!: FormGroup;
  isLoading: boolean = false;

  constructor(
    private requestAppointmentStore: RequestAppointmentStore,
    private router: Router,
    private alertService: AlertService
  ) {}
  ngOnInit(): void {
    this._initForm();
  }
  clickBack(): void {
    this.router.navigate(['solicitacoes-atendimento']);
  }
  clickConclude(): void {
    this.isLoading = true;
    this.requestAppointmentStore
      .conclude(this.id!)
      .pipe(
        finalize(() => (this.isLoading = false)),
        alertApiError()
      )
      .subscribe({
        next: () => {
          this.requestAppointmentStore
            .conclude(this.id)
            .pipe(alertApiError())
            .subscribe({
              next: () => {
                this.clickBack();
              },
            });
        },
      });
  }
  clickReOpen(): void {}

  private _initForm(): void {
    this.isLoading = true;
    this.requestAppointmentStore
      .getById(this.id!)
      .pipe(
        finalize(() => (this.isLoading = false)),
        alertApiError()
      )
      .subscribe({
        next: (model: RequestAppointmentModel) => {
          this.form = FormOfRequestAppointmentModel(model);
          this.form.controls['problemDescription'].disable();
          this.form.disable();
        },
      });
  }
}
