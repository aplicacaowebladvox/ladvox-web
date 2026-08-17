import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoleModel } from './role.model';
import { ConvertUtils } from '../modules/shared/utils/convert.utils';
import { CustomValidators } from '../modules/shared/validators/custom.validator';

export interface UserModel {
  id: number;
  name: string;
  document: string;
  birthDate: Date | null;
  inactivationDate: Date;
  inactivationUserId: string;
  showOnLandingPage: boolean;
  roleIds: string[];
  roles: Array<RoleModel>;
}

export function FormOfUserModel(model?: UserModel): FormGroup {
  model = model || ({} as UserModel);

  return new FormBuilder().group({
    id: [model.id],
    name: [model.name, Validators.compose([Validators.required, Validators.maxLength(255)])],
    document: [model.document, Validators.compose([Validators.required, CustomValidators.cpf])],
    birthDate: [
      ConvertUtils.dateToFormControl(model.birthDate),
      Validators.compose([Validators.required]),
    ],
    showOnLandingPage: [model.showOnLandingPage],
    roleIds: [
      model.roleIds || (model.roles || []).map((RoleModel) => RoleModel.id),
      Validators.compose([Validators.required]),
    ],
    roles: [model.roles || []],
  });
}

export function UserModelOfForm(form: FormGroup): UserModel {
  let model = {} as UserModel;

  model.id = form.getRawValue().id;
  model.name = form.getRawValue().name;
  model.document = form.getRawValue().document;
  model.birthDate = ConvertUtils.stringToDate(form.getRawValue().birthDate);
  model.showOnLandingPage = form.getRawValue().showOnLandingPage;
  model.roleIds = <string[]>form.getRawValue().roleIds;
  model.roles = model.roleIds.map((roleId) => ({ id: roleId }) as RoleModel);

  return model;
}
