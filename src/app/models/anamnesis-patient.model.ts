import { PatientModel } from './patient.model';
import { AnamnesisPatientAttachmentModel } from './anamnesis-patient-attachment.model';
import { UserModel } from './user.model';
import { FormBuilder, FormGroup } from '@angular/forms';

export interface AnamnesisPatientModel {
  id: number;
  patientId: number;
  patient: PatientModel;
  therapistId: number;
  therapist: UserModel;
  createdDate: Date;
  anamnesiText: string;
}

export function FormOfAnamnesisPatientModel(model?: AnamnesisPatientModel): FormGroup {
  model = model || ({} as AnamnesisPatientModel);
  return new FormBuilder().group({
    id: [model.id],
    patientId: [model.patientId],
    therapistId: [model.therapistId],
    createdDate: [model.createdDate],
    anamnesiText: [model.anamnesiText],
  });
}

export function AnamnesisPatientModelOfForm(form: FormGroup): AnamnesisPatientModel {
  let model = {} as AnamnesisPatientModel;

  model.id = form.getRawValue().id;
  model.patientId = form.getRawValue().patientId;
  model.therapistId = form.getRawValue().therapistId;
  model.createdDate = form.getRawValue().createdDate;
  model.anamnesiText = form.getRawValue().anamnesiText;

  return model;
}
