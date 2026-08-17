import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserModel } from './user.model';
import { CustomValidators } from '../modules/shared/validators/custom.validator';

export interface TeamMedicalAppointmentPlanningModel {
  id: number;
  name: string;
  color: string;
  therapistsIds: string[];
}

export function FormOfTeamMedicalAppointmentPlanningModel(
  model?: TeamMedicalAppointmentPlanningModel
): FormGroup {
  model = model || ({} as TeamMedicalAppointmentPlanningModel);
  return new FormBuilder().group({
    id: [model.id],
    name: [model.name, Validators.compose([Validators.required, Validators.maxLength(120)])],
    color: [
      model.color || '#000000',
      Validators.compose([Validators.required, CustomValidators.colorHex]),
    ],
    therapistsIds: [model.therapistsIds || [], Validators.compose([Validators.required])],
  });
}

export function TeamMedicalAppointmentPlanningModelOfForm(
  form: FormGroup
): TeamMedicalAppointmentPlanningModel {
  let model = {} as TeamMedicalAppointmentPlanningModel;

  model.id = form.getRawValue().id;
  model.name = form.getRawValue().name;
  model.color = form.getRawValue().color;
  model.therapistsIds = form.getRawValue().therapistsIds;

  return model;
}
