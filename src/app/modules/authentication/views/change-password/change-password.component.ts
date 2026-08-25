import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidators } from '../../../shared/validators/custom.validator';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { stringToDate } from '../../../shared/utils/date.util';
import {
  ChangePasswordModelOfForm,
  FormOfChangePasswordModel,
} from '../../models/change-password.model';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../../../core/services/alert.provided.service';
import { TooltipModule } from 'primeng/tooltip';
import { finalize } from 'rxjs';
import { alertApiError } from '../../../../core/operators/api-alert-error.operator';

@Component({
  selector: 'app-change-password',
  standalone: true,
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule, NgxMaskDirective, TooltipModule],
  providers: [provideNgxMask()],
})
export class ChangePasswordComponent implements OnInit {
  isLoading: boolean = false;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  form!: FormGroup;

  showNewPassword: boolean = true;
  showNewPasswordConfirmation: boolean = false;

  get isFormTouched(): Boolean {
    return this.form.touched;
  }

  get isFormValid(): Boolean {
    return (
      this.form.valid &&
      this.form.getRawValue().newPassword == this.form.getRawValue().newPasswordConfirmation
    );
  }

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService
  ) {}
  ngOnInit(): void {
    this._initForm();
  }

  changePassword(): void {
    if (!this.isFormValid) {
      return;
    }
    this.isLoading = true;
    this.authService
      .changePassword(ChangePasswordModelOfForm(this.form))
      .pipe(
        finalize(() => (this.isLoading = false)),
        alertApiError()
      )
      .subscribe({
        next: () => {
          this.back();
        },
      });
  }

  back(): void {
    this.router.navigate(['auth/']);
  }
  passwordPollices(): string {
    return `<ul>
  <li>Não pode conter três caracteres consecutivos iguais.</li>
  <li>Deve ter entre 6 e 15 caracteres.</li>
  <li>Deve conter pelo menos uma letra minúscula.</li>
  <li>Deve conter pelo menos uma letra maiúscula.</li>
  <li>Deve conter pelo menos um dígito numérico.</li>
  <li>Deve conter pelo menos um caractere especial (como ~!@#$%^&*).</li>
</ul>`;
  }
  private _initForm(): void {
    this.form = FormOfChangePasswordModel();
  }
}

interface FormValues {
  username: string | null;
  dateOfBirth: Date | null;
  newPassword: string | null;
  newPasswordConfirmation: string | null;
}
