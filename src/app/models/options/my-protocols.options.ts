import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseGridOptions } from '../../modules/shared/components/card-table/models/base-grid-options.model';

export interface MyProtocolsOptions extends BaseGridOptions {
  notAnswered?: boolean;
  answered?: boolean;
  orderBy?: 'requestDate_asc' | 'requestDate_desc';
}

export function FormOfMyProtocolsOptions(model?: MyProtocolsOptions): FormGroup {
  model = model || ({} as MyProtocolsOptions);

  return new FormBuilder().group({
    notAnswered: [model.notAnswered || true],
    answered: [model.answered || false],
    orderBy: [model.orderBy || 'requestDate_asc'],
  });
}

export function MyProtocolsOptionsOfForm(form: FormGroup): MyProtocolsOptions {
  let model = {} as MyProtocolsOptions;

  model.notAnswered = form.getRawValue().notAnswered;
  model.answered = form.getRawValue().answered;
  model.orderBy = form.getRawValue().orderBy;

  return model;
}
