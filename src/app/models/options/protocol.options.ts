import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseGridOptions } from '../../modules/shared/components/card-table/models/base-grid-options.model';

export interface ProtocolOptionsModel extends BaseGridOptions {
  id?: number;
  term?: string;
}

export function FormOfProtocolOptionsModel(model?: ProtocolOptionsModel): FormGroup {
  model = model || ({} as ProtocolOptionsModel);

  return new FormBuilder().group({
    id: [model.id],
    term: [model.term],
  });
}

export function ProtocolOptionsModelOfForm(form: FormGroup): ProtocolOptionsModel {
  let model = {} as ProtocolOptionsModel;

  model.id = form.getRawValue().id;
  model.term = form.getRawValue().term;

  return model;
}
