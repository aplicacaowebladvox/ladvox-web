import { Component, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConvertUtils } from '../../../shared/utils/convert.utils';
import { AddressModelOfForm } from '../../../../models/address.model';
import {
  FormOfSystemContactModel,
  SystemContactModelOfForm,
} from '../../../../models/system-contact.model';
import { Router } from '@angular/router';
import { SystemContactStore } from '../../../../core/stores/system-contact.store';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { HasPermissionDirective } from '../../../../core/has-permission.directive';
import { AlertService } from '../../../../core/services/alert.provided.service';
import { ngxLoadingAnimationTypes, NgxLoadingModule } from 'ngx-loading';
import { finalize } from 'rxjs';
import { LoadingComponent } from '../../../../core/components/loading/loading.component';
import { alertApiError } from '../../../../core/operators/api-alert-error.operator';

@Component({
  selector: 'app-contacts-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    NgxMaskDirective,
    HasPermissionDirective,
    LoadingComponent,
  ],
  templateUrl: './contacts-list.component.html',
  styleUrl: './contacts-list.component.scss',
  providers: [SystemContactStore, provideNgxMask()],
})
export class ContactsListComponent implements OnInit {
  form!: FormGroup;
  isLoading: boolean = false;
  ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  constructor(
    private router: Router,
    private systemContactStore: SystemContactStore,
    private alertService: AlertService
  ) {}
  ngOnInit(): void {
    this._initForm();
  }
  getAddressAsString(addressForm: FormGroup): string {
    return ConvertUtils.addressToString(AddressModelOfForm(addressForm));
  }
  canShow(item: string): boolean {
    switch (item) {
      case 'buttonEdit':
        return this.form.disabled;
      case 'buttonSave':
        return this.form.enabled;
    }
    return false;
  }

  clickEdit(): void {
    this._changeFormStatus(true);
  }
  clickSave(): void {
    this.systemContactStore
      .save(SystemContactModelOfForm(this.form))
      .pipe(alertApiError())
      .subscribe({
        next: (activeOne) => {
          this.form = FormOfSystemContactModel(activeOne);
          this._changeFormStatus(false);
        },
      });
  }
  clickBack(): void {
    this.router.navigate(['home']);
  }
  private _initForm(): void {
    this.isLoading = true;
    this.systemContactStore
      .getActive()
      .pipe(
        finalize(() => (this.isLoading = false)),
        alertApiError()
      )
      .subscribe({
        next: (activeOne) => {
          this.form = FormOfSystemContactModel(activeOne);
          this._changeFormStatus(false);
        },
      });
  }
  private _changeFormStatus(enable: boolean = false): void {
    if (enable) this.form.enable();
    else this.form.disable();
    (<FormGroup[]>this.form.getRawValue().addressesForms).forEach((f) =>
      this._changeFormControlStatus(f, enable)
    );
    (<FormGroup[]>this.form.getRawValue().phonesForms).forEach((f) =>
      this._changeFormControlStatus(f, enable)
    );
    (<FormGroup[]>this.form.getRawValue().emailsForms).forEach((f) =>
      this._changeFormControlStatus(f, enable)
    );
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
