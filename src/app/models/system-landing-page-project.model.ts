import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface SystemLandingPageProjectModel {
  id: number;
  title: string;
  status: string;
  type: string;
  description: string;
}

export function FormOfSystemLandingPageProjectModel(
  model?: SystemLandingPageProjectModel
): FormGroup {
  model = model || ({} as SystemLandingPageProjectModel);

  return new FormBuilder().group({
    id: [model.id],
    title: [model.title, Validators.compose([Validators.required, Validators.maxLength(255)])],
    status: [model.status, Validators.compose([Validators.required, Validators.maxLength(125)])],
    type: [model.type, Validators.compose([Validators.required, Validators.maxLength(125)])],
    description: [model.description],
  });
}

export function SystemLandingPageProjectModelOfForm(
  form: FormGroup
): SystemLandingPageProjectModel {
  let model = {} as SystemLandingPageProjectModel;

  model.id = form.getRawValue().id;
  model.title = form.getRawValue().title;
  model.status = form.getRawValue().status;
  model.type = form.getRawValue().type;
  model.description = form.getRawValue().description;

  return model;
}
