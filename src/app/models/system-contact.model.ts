import { FormBuilder, FormGroup } from '@angular/forms';
import { AddressModel, AddressModelOfForm, FormOfAddressModel } from './address.model';
import {
  EmailContactModel,
  EmailContactModelOfForm,
  FormOfEmailContactModel,
} from './email-contact.model';
import {
  FormOfPhoneContactModel,
  PhoneContactModel,
  PhoneContactModelOfForm,
} from './phone-contact.model';

export interface SystemContactModel {
  id: number;
  addresses: AddressModel[];
  emails: EmailContactModel[];
  phones: PhoneContactModel[];
}

export function FormOfSystemContactModel(model?: SystemContactModel): FormGroup {
  model = model || ({} as SystemContactModel);
  return new FormBuilder().group({
    id: [model.id],
    addresses: [model.addresses],
    addressesForms: [(model.addresses || [{}]).map((addressModel) => FormOfAddressModel(addressModel))],
    phone: [(model.phones || [undefined])[0]],
    phonesForms: [
      (model.phones || [{}]).map((phoneContactModel) => FormOfPhoneContactModel(phoneContactModel)),
    ],
    email: [(model.emails || [undefined])[0]],
    emailsForms: [
      (model.emails || [{}]).map((emailContactModel) => FormOfEmailContactModel(emailContactModel)),
    ],
  });
}

export function SystemContactModelOfForm(form: FormGroup): SystemContactModel {
  let model = {} as SystemContactModel;

  model.id = form.getRawValue().id;
  model.addresses = (form.getRawValue().addressesForms || []).map((addressForm: FormGroup) =>
    AddressModelOfForm(addressForm)
  );
  model.phones = (form.getRawValue().phonesForms || []).map((phoneForm: FormGroup) =>
    PhoneContactModelOfForm(phoneForm)
  );
  model.emails = (form.getRawValue().emailsForms || []).map((emailForm: FormGroup) =>
    EmailContactModelOfForm(emailForm)
  );

  return model;
}
