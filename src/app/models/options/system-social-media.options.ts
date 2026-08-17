import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseGridOptions } from '../../modules/shared/components/card-table/models/base-grid-options.model';

export interface SystemSocialMediaOptions extends BaseGridOptions {
  id: number;
  iconClass: string;
  title: string;
}

export function FormOfSystemSocialMediaOptions(model?: SystemSocialMediaOptions): FormGroup {
  model = model || ({} as SystemSocialMediaOptions);

  return new FormBuilder().group({
    id: [model.id],
    iconClass: [model.iconClass],
    title: [model.title],
  });
}

export function SystemSocialMediaOptionsOfForm(form: FormGroup): SystemSocialMediaOptions {
  let model = {} as SystemSocialMediaOptions;

  model.id = form.getRawValue().id;
  model.iconClass = form.getRawValue().iconClass;
  model.title = form.getRawValue().title;

  return model;
}
