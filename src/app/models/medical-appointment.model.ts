import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WeekdayEnum } from './enum/weekday.enum';

export interface MedicalAppointmentModel {
  id: number;
  teamId: number;
  room: string;
  patientId: number;
  therapeuticPlanId: number;
  weekDay: WeekdayEnum | string;
  hour: string;
  observation: string;
}

export function FormOfMedicalAppointmentModel(model?: MedicalAppointmentModel): FormGroup {
  model = model || ({} as MedicalAppointmentModel);
  return new FormBuilder().group({
    id: [model.id],
    team: [
      model.teamId ? { id: model.teamId } : undefined,
      Validators.compose([Validators.required]),
    ],
    room: [model.room, Validators.compose([Validators.required, Validators.maxLength(50)])],
    patientId: [model.patientId, Validators.compose([Validators.required])],
    therapeuticPlanId: [model.therapeuticPlanId],
    weekDay: [model.weekDay, Validators.compose([Validators.required])],
    hour: [model.hour, Validators.compose([Validators.required])],
    observation: [model.observation, Validators.maxLength(255)],
  });
}

export function MedicalAppointmentModelOfForm(form: FormGroup): MedicalAppointmentModel {
  let model = {} as MedicalAppointmentModel;

  model.id = form.getRawValue().id;
  model.teamId = (form.getRawValue().team || { id: undefined }).id;
  model.room = form.getRawValue().room;
  model.patientId = form.getRawValue().patientId;
  model.therapeuticPlanId = form.getRawValue().therapeuticPlanId;
  model.weekDay = form.getRawValue().weekDay;
  model.hour = form.getRawValue().hour;
  model.observation = form.getRawValue().observation;

  return model;
}
