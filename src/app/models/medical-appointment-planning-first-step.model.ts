import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConvertUtils } from '../modules/shared/utils/convert.utils';

export interface MedicalAppointmentPlanningFirstStepModel {
  id: number;
  name: string;
  initialValidity: Date | null;
  finalValidity: Date | null;
  nextStepIsEnable: boolean;
}

export function FormOfMedicalAppointmentPlanningFirstStepModel(
  model?: MedicalAppointmentPlanningFirstStepModel
): FormGroup {
  model = model || ({} as MedicalAppointmentPlanningFirstStepModel);
  return new FormBuilder().group({
    id: [model.id],
    name: [model.name, Validators.compose([Validators.required, Validators.maxLength(120)])],
    initialValidity: [
      ConvertUtils.dateToFormControl(model.initialValidity),
      Validators.compose([Validators.required]),
    ],
    finalValidity: [ConvertUtils.dateToFormControl(model.finalValidity)],
    nextStepIsEnable: [model.nextStepIsEnable],
  });
}

export function MedicalAppointmentPlanningFirstStepModelOfForm(
  form: FormGroup
): MedicalAppointmentPlanningFirstStepModel {
  let model = {} as MedicalAppointmentPlanningFirstStepModel;

  model.id = form.getRawValue().id;
  model.name = form.getRawValue().name;
  model.initialValidity = ConvertUtils.stringToDate(form.getRawValue().initialValidity);
  model.finalValidity = ConvertUtils.stringToDate(form.getRawValue().finalValidity);
  model.nextStepIsEnable = form.getRawValue().nextStepIsEnable;

  return model;
}
