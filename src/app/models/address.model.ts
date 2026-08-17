import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface AddressModel {
  id: number;
  country?: string;
  state?: string;
  city?: string;
  neighborhood?: string;
  street?: string;
  number?: string;
  zipCode?: string;
  complement?: string;
}
export function FormOfAddressModel(model?: AddressModel): FormGroup {
  model = model || ({} as AddressModel);
  return new FormBuilder().group({
    id: [model.id],
    country: [model.country, Validators.compose([Validators.required, Validators.maxLength(50)])],
    state: [model.state, Validators.compose([Validators.required, Validators.maxLength(50)])],
    city: [model.city, Validators.compose([Validators.required, Validators.maxLength(50)])],
    neighborhood: [
      model.neighborhood,
      Validators.compose([Validators.required, Validators.maxLength(50)]),
    ],
    street: [model.street, Validators.compose([Validators.required, Validators.maxLength(255)])],
    number: [model.number, Validators.compose([Validators.maxLength(10)])],
    zipCode: [model.zipCode, Validators.compose([Validators.maxLength(50)])],
    complement: [model.complement, Validators.compose([Validators.maxLength(50)])],
  });
}

export function AddressModelOfForm(form: FormGroup): AddressModel {
  let model = {} as AddressModel;

  model.id = form.getRawValue().id;
  model.country = form.getRawValue().country;
  model.state = form.getRawValue().state;
  model.city = form.getRawValue().city;
  model.neighborhood = form.getRawValue().neighborhood;
  model.street = form.getRawValue().street;
  model.number = form.getRawValue().number;
  model.zipCode = form.getRawValue().zipCode;
  model.complement = form.getRawValue().complement;

  return model;
}
