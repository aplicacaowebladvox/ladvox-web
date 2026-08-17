import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '../modules/shared/validators/custom.validator';

export interface PhoneContactModel {
  id?: number;
  phoneNumber: string;
}

export function FormOfPhoneContactModel(model?: PhoneContactModel): FormGroup {
  model = model || ({} as PhoneContactModel);
  return new FormBuilder().group({
    id: [model.id],
    phoneNumber: [
      model.phoneNumber,
      Validators.compose([Validators.required, CustomValidators.phone]),
    ],
  });
}

export function PhoneContactModelOfForm(form: FormGroup): PhoneContactModel {
  var model = {} as PhoneContactModel;
  model.id = form.getRawValue().id;
  model.phoneNumber = form.getRawValue().phoneNumber;
  return model;
}
