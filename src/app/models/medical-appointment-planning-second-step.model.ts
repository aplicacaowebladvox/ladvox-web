import { FormBuilder, FormGroup } from '@angular/forms';
import {
  FormOfMedicalAppointmentModel,
  MedicalAppointmentModel,
  MedicalAppointmentModelOfForm,
} from './medical-appointment.model';
import {
  FormOfTeamMedicalAppointmentPlanningModel,
  TeamMedicalAppointmentPlanningModel,
  TeamMedicalAppointmentPlanningModelOfForm,
} from './team-medical-appointment-planning.model';

export interface MedicalAppointmentPlanningSecondStepModel {
  id: number;
  name: string;
  teams: Array<TeamMedicalAppointmentPlanningModel>;
  nextStepIsEnable: boolean;
}

export function FormOfMedicalAppointmentPlanningSecondStepModel(
  model?: MedicalAppointmentPlanningSecondStepModel
): FormGroup {
  model = model || ({} as MedicalAppointmentPlanningSecondStepModel);
  return new FormBuilder().group({
    id: [model.id],
    name: [model.name],
    teamsForms: [(model.teams || []).map((t) => FormOfTeamMedicalAppointmentPlanningModel(t))],
    teams: [model.teams],
    nextStepIsEnable: [model.nextStepIsEnable],
  });
}

export function MedicalAppointmentPlanningSecondStepModelOfForm(
  form: FormGroup
): MedicalAppointmentPlanningSecondStepModel {
  let model = {} as MedicalAppointmentPlanningSecondStepModel;

  model.id = form.getRawValue().id;
  model.name = form.getRawValue().name;
  model.teams = (<FormGroup[]>form.getRawValue().teamsForms).map((fg) =>
    TeamMedicalAppointmentPlanningModelOfForm(fg)
  );
  model.nextStepIsEnable = form.getRawValue().nextStepIsEnable;

  return model;
}
