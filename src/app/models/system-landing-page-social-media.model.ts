import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '../modules/shared/validators/custom.validator';

export interface SystemSocialMediaModel {
  id: number;
  iconClass: string;
  iconColor: string;
  title: string;
  url: string;
}

export function FormOfSystemSocialMediaModel(model?: SystemSocialMediaModel): FormGroup {
  model = model || ({} as SystemSocialMediaModel);

  return new FormBuilder().group({
    id: [model.id],
    iconClass: [
      model.iconClass,
      Validators.compose([Validators.required, Validators.maxLength(125)]),
    ],
    iconColor: [
      model.iconColor,
      Validators.compose([Validators.required, CustomValidators.colorHex]),
    ],
    title: [model.title, Validators.compose([Validators.required, Validators.maxLength(125)])],
    url: [model.url, Validators.compose([Validators.required, Validators.maxLength(255)])],
  });
}

export function SystemSocialMediaModelOfForm(form: FormGroup): SystemSocialMediaModel {
  let model = {} as SystemSocialMediaModel;

  model.id = form.getRawValue().id;
  model.iconClass = form.getRawValue().iconClass;
  model.iconColor = form.getRawValue().iconColor;
  model.title = form.getRawValue().title;
  model.url = form.getRawValue().url;

  return model;
}
