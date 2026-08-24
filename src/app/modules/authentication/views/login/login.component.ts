import { MenuResponseModel } from './../../../../core/models/menu-response.model';
import { SystemConfigStore } from './../../../../core/stores/system-config.store';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { CustomValidators } from '../../../shared/validators/custom.validator';
import { AuthService } from '../../services/auth.service';
import { FormOfLoginUserModel, LoginUserModelOfForm } from '../../models/login-user.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SidebarObjectModel } from '../../../../core/models/sidebar-object.model';
import { AlertService } from '../../../../core/services/alert.provided.service';
import { UserStore } from '../../../../core/stores/user.store';
import { finalize } from 'rxjs';
import { alertApiError } from '../../../../core/operators/api-alert-error.operator';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  imports: [CommonModule, ReactiveFormsModule, NgxMaskDirective],
  providers: [provideNgxMask(), AuthService, SystemConfigStore, AlertService, UserStore],
})
export class LoginComponent implements OnInit {
  isLoading: boolean = false;
  form!: FormGroup;

  get isFormTouched(): Boolean {
    return this.form.touched;
  }

  get isFormValid(): Boolean {
    return this.form.valid;
  }
  constructor(
    private router: Router,
    private authService: AuthService,
    private destroyRef: DestroyRef,
    private alertService: AlertService,
    private userStore: UserStore,
    private systemConfigStore: SystemConfigStore
  ) {}
  ngOnInit(): void {
    this._initForm();
  }

  login(): void {
    if (!this.isFormValid) return;
    this.isLoading = true;
    this.authService
      .login(LoginUserModelOfForm(this.form))
      .pipe(
        finalize(() => (this.isLoading = false)),
        takeUntilDestroyed(this.destroyRef),
        alertApiError()
      )
      .subscribe({
        next: () => {
          this.userStore
            .mountChooseableRole()
            .pipe(
              finalize(() => (this.isLoading = false)),
              alertApiError()
            )
            .subscribe({
              next: (chooseablesUserRoleModel) => {
                if (chooseablesUserRoleModel.length > 1) {
                  localStorage.setItem('temp', LoginUserModelOfForm(this.form).password);
                  this.router.navigate(['auth', 'escolher-papel']);
                } else {
                  let choice = chooseablesUserRoleModel[0];
                  choice.password = LoginUserModelOfForm(this.form).password;
                  this.authService
                    .chooseViewMode(choice)
                    .pipe(
                      finalize(() => (this.isLoading = false)),
                      takeUntilDestroyed(this.destroyRef),
                      alertApiError()
                    )
                    .subscribe({
                      next: () => {
                        this.systemConfigStore
                          .getMenu(choice)
                          .pipe(alertApiError())
                          .subscribe({
                            next: (menuResponseModel) => {
                              SidebarObjectModel.setOnLocalStorage({
                                menuResponse: menuResponseModel,
                                userName: this.authService.getUser()?.name ?? 'U',
                                viewMode: choice,
                              } as SidebarObjectModel);
                              localStorage.setItem('menu', JSON.stringify(menuResponseModel));
                              this.router.navigate(['home']);
                            },
                          });
                      },
                    });
                }
              },
            });
        },
      });
  }
  forgotPassword(): void {
    this.router.navigate(['auth/alterar-senha']);
  }

  back(): void {
    this.router.navigate(['/']);
  }

  private _initForm(): void {
    this.form = FormOfLoginUserModel();
  }
}
