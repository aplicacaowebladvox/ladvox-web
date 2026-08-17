import { FormBuilder, FormGroup } from '@angular/forms';
import { MedicalAppointmentModel } from './medical-appointment.model';
import { ProtocolTherapeuticPlanModel } from './protocol-therapeutic-plan.model';
import {
  FormOfTherapeuticPlanTextModel,
  TherapeuticPlanTextModel,
  TherapeuticPlanTextModelOfForm,
} from './therapeutic-plan-text.model';

export interface TherapeuticPlanModel {
  id: number;
  therapeuticsTextPlan: TherapeuticPlanTextModel[];
  protocols: ProtocolTherapeuticPlanModel[];
  medicalAppointment: MedicalAppointmentModel;
}

export function FormOfTherapeuticPlanModel(model?: TherapeuticPlanModel): FormGroup {
  model = model || ({} as TherapeuticPlanModel);
  return new FormBuilder().group({
    id: [model.id],
    therapeuticsTextPlanForms: [
      (model.therapeuticsTextPlan || []).map((m) => FormOfTherapeuticPlanTextModel(m)),
    ],
    protocols: [model.protocols],
    medicalAppointmentId: [(model.medicalAppointment || {}).id],
  });
}

export function TherapeuticPlanModelOfForm(form: FormGroup): TherapeuticPlanModel {
  let model = {} as TherapeuticPlanModel;

  model.id = form.getRawValue().id;
  model.therapeuticsTextPlan = (<FormGroup[]>(
    (form.getRawValue().therapeuticsTextPlanForms || [])
  )).map((fg) => TherapeuticPlanTextModelOfForm(fg));
  model.protocols = form.getRawValue().protocols;
  model.medicalAppointment = form.getRawValue().medicalAppointmentId
    ? ({ id: form.getRawValue().medicalAppointmentId } as MedicalAppointmentModel)
    : ({} as MedicalAppointmentModel);

  return model;
}
