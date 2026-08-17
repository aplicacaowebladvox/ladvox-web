import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PermissionModel } from './permission.model';

export interface RoleModel {
  id: string;
  name: string;
  showOnLandingPage: boolean;
  permissionsIds: Array<string>;
  permissions: Array<PermissionModel>;
}

export function FormOfRoleModel(model?: RoleModel): FormGroup {
  model = model || ({} as RoleModel);

  return new FormBuilder().group({
    id: [model.id],
    name: [model.name, Validators.compose([Validators.required, Validators.maxLength(120)])],
    showOnLandingPage: [model.showOnLandingPage],
    permissionsIds: [
      model.permissionsIds || (model.permissions || []).map((fppu) => fppu.id),
      Validators.compose([Validators.required]),
    ],
    permissions: [model.permissions || []],
  });
}

export function RoleModelOfForm(form: FormGroup): RoleModel {
  let model = {} as RoleModel;

  model.id = form.getRawValue().id;
  model.name = form.getRawValue().name;
  model.showOnLandingPage = form.getRawValue().showOnLandingPage;
  let permissionsIds = <string[]>form.getRawValue().permissionsIds;
  model.permissionsIds = permissionsIds;
  model.permissions = permissionsIds.map((fpi) => ({ id: fpi }) as PermissionModel);

  return model;
}
