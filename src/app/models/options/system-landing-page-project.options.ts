import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseGridOptions } from '../../modules/shared/components/card-table/models/base-grid-options.model';

export interface SystemLandingPageProjectOptions extends BaseGridOptions {
  id: number;
  term: string;
}

export function FormOfSystemLandingPageProjectOptions(
  model?: SystemLandingPageProjectOptions
): FormGroup {
  model = model || ({} as SystemLandingPageProjectOptions);

  return new FormBuilder().group({
    id: [model.id],
    term: [model.term],
  });
}

export function SystemLandingPageProjectOptionsOfForm(
  form: FormGroup
): SystemLandingPageProjectOptions {
  let model = {} as SystemLandingPageProjectOptions;

  model.id = form.getRawValue().id;
  model.term = form.getRawValue().term;

  return model;
}
