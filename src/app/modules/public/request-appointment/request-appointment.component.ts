import { PublicHomeStore } from './../../../core/stores/public-home.store';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { EditorModule } from 'primeng/editor';
import {
  FormOfRequestAppointmentModel,
  RequestAppointmentModelOfForm,
} from '../../../models/request-appointment.model';
import { AlertService } from '../../../core/services/alert.provided.service';
import { ConvertUtils } from '../../shared/utils/convert.utils';
import { alertApiError } from '../../../core/operators/api-alert-error.operator';

@Component({
  selector: 'app-request-appointment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, EditorModule, NgxMaskDirective],
  templateUrl: './request-appointment.component.html',
  styleUrl: './request-appointment.component.scss',
  providers: [provideNgxMask()],
})
export class RequestAppointmentComponent implements OnInit {
  form!: FormGroup;
  constructor(
    private router: Router,
    private alertService: AlertService,
    private publicHomeStore: PublicHomeStore
  ) {}
  ngOnInit(): void {
    this._initForm();
  }
  clickRequest(): void {
    this.publicHomeStore
      .requestAppointment(RequestAppointmentModelOfForm(this.form))
      .pipe(alertApiError())
      .subscribe({
        next: (data) => {
          this.alertService.showSuccess({
            title: `${ConvertUtils.generateGreetings(data.name)}`,
            message:
              'Sua consulta foi solicitada com sucesso, em breve a equipe LaDVox entrará em contato para os novos passos',
            callbackFn: () => {
              this.router.navigate(['']);
            },
          });
        },
      });
  }
  private _initForm(): void {
    this.form = FormOfRequestAppointmentModel();
  }
}
