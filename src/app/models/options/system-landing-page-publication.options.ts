import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseGridOptions } from '../../modules/shared/components/card-table/models/base-grid-options.model';

export interface SystemLandingPagePublicationOptions extends BaseGridOptions {
  id: number;
  term: string;
}

export function FormOfSystemLandingPagePublicationOptions(
  model?: SystemLandingPagePublicationOptions
): FormGroup {
  model = model || ({} as SystemLandingPagePublicationOptions);

  return new FormBuilder().group({
    id: [model.id],
    term: [model.term],
  });
}

export function SystemLandingPagePublicationOptionsOfForm(
  form: FormGroup
): SystemLandingPagePublicationOptions {
  let model = {} as SystemLandingPagePublicationOptions;

  model.id = form.getRawValue().id;
  model.term = form.getRawValue().term;

  return model;
}
