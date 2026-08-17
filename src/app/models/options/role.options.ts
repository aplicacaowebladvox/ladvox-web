import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseGridOptions } from '../../modules/shared/components/card-table/models/base-grid-options.model';

export interface RoleOptionsModel extends BaseGridOptions {
  id?: number;
  name?: string;
}

export function FormOfRoleOptionsModel(model?: RoleOptionsModel): FormGroup {
  model = model || ({} as RoleOptionsModel);

  return new FormBuilder().group({
    id: [model.id],
    name: [model.name],
  });
}

export function RoleOptionsModelOfForm(form: FormGroup): RoleOptionsModel {
  let model = {} as RoleOptionsModel;

  model.id = form.getRawValue().id;
  model.name = form.getRawValue().name;

  return model;
}
