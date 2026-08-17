import { AddressModel } from '../models/address.model';
import { SystemContactModel } from './../models/system-contact.model';

export class SystemContactMock {
  static contact = {
    id: 1,
    addresses: [
      {
        country: 'Brasil',
        state: 'ES',
        city: 'Vitória',
        neighborhood: 'Goiabeiras',
        street: 'Av. Fernando Ferrari',
        number: '514',
        zipCode: '29075-910',
      },
    ] as AddressModel[],
    emails: [{ emailAddress: 'ladvox.ufes2@gmail.com' }],
    phones: [{ phoneNumber: '02740092222' }],
  } as SystemContactModel;
}
