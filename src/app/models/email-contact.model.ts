import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '../modules/shared/validators/custom.validator';

export interface EmailContactModel {
  id?: number;
  emailAddress: string;
}

export function FormOfEmailContactModel(model?: EmailContactModel): FormGroup {
  model = model || ({} as EmailContactModel);
  return new FormBuilder().group({
    id: [model.id],
    emailAddress: [
      model.emailAddress,
      Validators.compose([Validators.required, CustomValidators.mail]),
    ],
  });
}

export function EmailContactModelOfForm(form: FormGroup): EmailContactModel {
  var model = {} as EmailContactModel;
  model.id = form.getRawValue().id;
  model.emailAddress = form.getRawValue().emailAddress;
  return model;
}
