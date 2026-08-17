import { FormBuilder, FormGroup } from '@angular/forms';
import {
  FormOfMedicalAppointmentModel,
  MedicalAppointmentModel,
  MedicalAppointmentModelOfForm,
} from './medical-appointment.model';

export interface MedicalAppointmentPlanningThirdStepModel {
  id: number;
  name: string;
  medicalAppointments: Array<MedicalAppointmentModel>;
  nextStepIsEnable: boolean;
}

export function FormOfMedicalAppointmentPlanningThirdStepModel(
  model?: MedicalAppointmentPlanningThirdStepModel
): FormGroup {
  model = model || ({} as MedicalAppointmentPlanningThirdStepModel);
  return new FormBuilder().group({
    id: [model.id],
    name: [model.name],
    medicalAppointmentForms: [
      (model.medicalAppointments || []).map((ma) => FormOfMedicalAppointmentModel(ma)),
    ],
    nextStepIsEnable: [model.nextStepIsEnable],
  });
}

export function MedicalAppointmentPlanningThirdStepModelOfForm(
  form: FormGroup
): MedicalAppointmentPlanningThirdStepModel {
  let model = {} as MedicalAppointmentPlanningThirdStepModel;

  model.id = form.getRawValue().id;
  model.name = form.getRawValue().name;
  model.medicalAppointments = (<FormGroup[]>form.getRawValue().medicalAppointmentForms).map((fg) =>
    MedicalAppointmentModelOfForm(fg)
  );
  model.nextStepIsEnable = form.getRawValue().nextStepIsEnable;

  return model;
}
