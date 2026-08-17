import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '../../shared/validators/custom.validator';

export interface ChangePasswordModel {
  login: string;
  birthDate: Date;
  password: string;
}

export function FormOfChangePasswordModel(model?: ChangePasswordModel): FormGroup {
  model = model || ({} as ChangePasswordModel);
  let form = new FormBuilder().group(
    {
      login: [model.login, CustomValidators.cpf],
      birthDate: [model.birthDate, Validators.required],
      newPassword: [null, Validators.compose([Validators.required, CustomValidators.password])],
      newPasswordConfirmation: [
        null,
        Validators.compose([Validators.required, CustomValidators.password]),
      ],
    }
  );
  return form;
}

export function ChangePasswordModelOfForm(form: FormGroup): ChangePasswordModel {
  var model = {} as ChangePasswordModel;

  model.login = form.getRawValue().login;
  model.birthDate = form.getRawValue().birthDate;
  model.password = form.getRawValue().newPassword;

  return model;
}
