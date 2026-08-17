import { AddressModel, AddressModelOfForm, FormOfAddressModel } from './address.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConvertUtils } from '../modules/shared/utils/convert.utils';
import { CustomValidators } from '../modules/shared/validators/custom.validator';
export interface PatientModel {
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
}

export function FormOfPatientModel(model?: PatientModel): FormGroup {
  model = model || ({} as PatientModel);

  return new FormBuilder().group({
    id: [model.id],
    name: [model.name, Validators.compose([Validators.required, Validators.maxLength(120)])],
    document: [model.document, Validators.compose([Validators.required, CustomValidators.cpf])],
    nationalHealthCard: [
      model.nationalHealthCard,
      Validators.compose([Validators.required, Validators.maxLength(25)]),
    ],
    genderSelected: [
      { id: model.genderId, extraAttribute: !!model.otherGenderDefinition },
      Validators.compose([Validators.required]),
    ],
    genderId: [model.genderId, Validators.compose([Validators.required])],
    otherGenderDefinition: [
      model.otherGenderDefinition,
      Validators.compose([Validators.required, Validators.maxLength(50)]),
    ],
    educationSelected: [
      { id: model.educationId, extraAttribute: !!model.otherEducationDefinition },
      Validators.compose([Validators.required]),
    ],
    educationId: [model.educationId, Validators.compose([Validators.required])],
    otherEducationDefinition: [
      model.otherEducationDefinition,
      Validators.compose([Validators.required, Validators.maxLength(50)]),
    ],
    profession: [
      model.profession,
      Validators.compose([Validators.required, Validators.maxLength(150)]),
    ],
    hasMedicalRecord: [!!model.medicalRecord],
    medicalRecord: [
      model.medicalRecord,
      Validators.compose([Validators.required, Validators.maxLength(50)]),
    ],
    birthDate: [
      ConvertUtils.dateToFormControl(model.birthDate),
      Validators.compose([Validators.required]),
    ],
    mainPhone: [model.mainPhone, Validators.compose([Validators.required, CustomValidators.phone])],
    phoneSecundary: [model.phoneSecundary, Validators.compose([CustomValidators.phone])],
    phoneObservation: [model.phoneObservation, Validators.compose([Validators.maxLength(500)])],
    mainMail: [model.mainMail, Validators.compose([Validators.required, CustomValidators.mail])],
    mailSecundary: [model.mailSecundary, Validators.compose([CustomValidators.mail])],
    mailObservation: [model.mailObservation, Validators.compose([Validators.maxLength(500)])],
    addressForm: [FormOfAddressModel(model.address || {})],
  });
}

export function PatientModelOfForm(form: FormGroup): PatientModel {
  let model = {} as PatientModel;

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
  return model;
}
