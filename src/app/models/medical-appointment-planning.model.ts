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

export interface MedicalAppointmentPlanningModel {
  id: number;
  name: string;
  initialValidity: Date;
  finalValidity: Date;
  teams: Array<TeamMedicalAppointmentPlanningModel>;
  medicalAppointments: Array<MedicalAppointmentModel>;
}

export function FormOfMedicalAppointmentPlanningModel(
  model?: MedicalAppointmentPlanningModel
): FormGroup {
  model = model || ({} as MedicalAppointmentPlanningModel);
  return new FormBuilder().group({
    id: [model.id],
    name: [model.name],
    validityRange: [[model.initialValidity, model.finalValidity]],
    teamsForms: [(model.teams || []).map((t) => FormOfTeamMedicalAppointmentPlanningModel(t))],
    teams: [model.teams],
    medicalAppointmentForms: [
      (model.medicalAppointments || []).map((ma) => FormOfMedicalAppointmentModel(ma)),
    ],
  });
}

export function MedicalAppointmentPlanningModelOfForm(
  form: FormGroup
): MedicalAppointmentPlanningModel {
  let model = {} as MedicalAppointmentPlanningModel;

  model.id = form.getRawValue().id;
  model.name = form.getRawValue().name;
  model.initialValidity = (form.getRawValue().validityRange || [undefined, undefined])[0];
  model.finalValidity = (form.getRawValue().validityRange || [undefined, undefined])[1];
  model.teams = (<FormGroup[]>form.getRawValue().teamsForms).map((fg) =>
    TeamMedicalAppointmentPlanningModelOfForm(fg)
  );
  model.medicalAppointments = (<FormGroup[]>form.getRawValue().medicalAppointmentForms).map((fg) =>
    MedicalAppointmentModelOfForm(fg)
  );

  return model;
}
