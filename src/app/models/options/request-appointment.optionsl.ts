import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseGridOptions } from '../../modules/shared/components/card-table/models/base-grid-options.model';

export interface RequestAppointmentOptions extends BaseGridOptions {
  id: number;
  name: string;
  status: string;
}

export function FormOfRequestAppointmentOptions(model?: RequestAppointmentOptions): FormGroup {
  model = model || ({} as RequestAppointmentOptions);

  return new FormBuilder().group({
    id: [model.id],
    name: [model.name],
    status: [model.status],
  });
}

export function RequestAppointmentOptionsOfForm(form: FormGroup): RequestAppointmentOptions {
  let model = {} as RequestAppointmentOptions;

  model.id = form.getRawValue().id;
  model.name = form.getRawValue().name;
  model.status = form.getRawValue().status;

  return model;
}
