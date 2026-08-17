import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseGridOptions } from '../../modules/shared/components/card-table/models/base-grid-options.model';

export interface UserOptionsModel extends BaseGridOptions {
  id?: number;
  name?: string;
  document?: string;
  roleIds: string[];
  papers?: number[];
}

export function FormOfUserOptionsModel(model?: UserOptionsModel): FormGroup {
  model = model || ({} as UserOptionsModel);
  return new FormBuilder().group({
    id: [model.id],
    name: [model.name],
    document: [model.document],
    roleIds: [model.roleIds || []],
  });
}

export function UserOptionsModelOfForm(form: FormGroup): UserOptionsModel {
  let model = {} as UserOptionsModel;

  model.id = form.getRawValue().id;
  model.name = form.getRawValue().name;
  model.document = form.getRawValue().document;
  model.roleIds = form.getRawValue().roleIds;

  return model;
}
