import { AttachmentModel } from './attachment.model';
import { AddressModel, AddressModelOfForm, FormOfAddressModel } from './address.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConvertUtils } from '../modules/shared/utils/convert.utils';
export interface UserMyDataModel {
  id: number;
  name: string;
  document: string;

  nationalHealthCard: string;
  genderId: number;
  otherGenderDefinition: string;
  educationId: number;
  otherEducationDefinition: string;
  profession: string;
  medicalRecord: string;

  birthDate: Date | null;
  mainPhone: string;
  phoneSecundary: string;
  phoneObservation: string;
  mainMail: string;
  mailSecundary: string;
  mailObservation: string;
  address: AddressModel;
  userId: string;
  profileImage: AttachmentModel;
}

export function FormOfUserMyDataModel(model?: UserMyDataModel): FormGroup {
  model = model || ({} as UserMyDataModel);

  return new FormBuilder().group({
    id: [model.id],
    name: [model.name],
    document: [model.document],
    nationalHealthCard: [model.nationalHealthCard],
    genderSelected: [{ id: model.genderId, extraAttribute: !!model.otherGenderDefinition }],
    genderId: [model.genderId],
    otherGenderDefinition: [model.otherGenderDefinition],
    educationSelected: [
      { id: model.educationId, extraAttribute: !!model.otherEducationDefinition },
    ],
    educationId: [model.educationId],
    otherEducationDefinition: [model.otherEducationDefinition],
    profession: [model.profession],
    hasMedicalRecord: [!!model.medicalRecord],
    medicalRecord: [model.medicalRecord],
    birthDate: [ConvertUtils.dateToFormControl(model.birthDate)],
    mainPhone: [model.mainPhone],
    phoneSecundary: [model.phoneSecundary],
    phoneObservation: [model.phoneObservation],
    mainMail: [model.mainMail],
    mailSecundary: [model.mailSecundary],
    mailObservation: [model.mailObservation],
    addressForm: [FormOfAddressModel(model.address || {})],
    userId: [model.userId],
    profileImage: [model.profileImage || {}],
  });
}

export function UserMyDataModelOfForm(form: FormGroup): UserMyDataModel {
  let model = {} as UserMyDataModel;

  model.id = form.getRawValue().id;
  model.name = form.getRawValue().name;
  model.document = form.getRawValue().document;
  model.nationalHealthCard = form.getRawValue().nationalHealthCard;
  model.genderId = (form.getRawValue().genderSelected || { id: undefined }).id;
  model.otherGenderDefinition = form.getRawValue().otherGenderDefinition;
  model.educationId = (form.getRawValue().educationSelected || { id: undefined }).id;
  model.otherEducationDefinition = form.getRawValue().otherEducationDefinition;
  model.profession = form.getRawValue().profession;
  model.medicalRecord = form.getRawValue().medicalRecord;
  model.birthDate = ConvertUtils.stringToDate(form.getRawValue().birthDate);
  model.mainPhone = form.getRawValue().mainPhone;
  model.phoneSecundary = form.getRawValue().phoneSecundary;
  model.phoneObservation = form.getRawValue().phoneObservation;
  model.mainMail = form.getRawValue().mainMail;
  model.mailSecundary = form.getRawValue().mailSecundary;
  model.mailObservation = form.getRawValue().mailObservation;
  model.address = AddressModelOfForm(form.getRawValue().addressForm);
  model.profileImage = form.getRawValue().profileImage;
  return model;
}
