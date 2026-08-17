import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '../../shared/validators/custom.validator';

export interface LoginUserModel {
  login: string;
  password: string;
}

export function FormOfLoginUserModel(model?: LoginUserModel): FormGroup {
  model = model || ({} as LoginUserModel);
  return new FormBuilder().group({
    login: [model.login, [CustomValidators.cpf]],
    password: [model.password, [Validators.required]],
  });
}

export function LoginUserModelOfForm(form: FormGroup): LoginUserModel {
  let model = {} as LoginUserModel;
  model.login = form.getRawValue().login;
  model.password = form.getRawValue().password;
  return model;
}
