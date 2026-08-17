import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseGridOptions } from '../../modules/shared/components/card-table/models/base-grid-options.model';
import { ConvertUtils } from '../../modules/shared/utils/convert.utils';

export interface MedicalAppointmentPlanningOptions extends BaseGridOptions {
  id: number;
  name: string;
  initialValidityStarts: Date | null;
  initialValidityEnds: Date | null;
  finalValidityStarts: Date | null;
  finalValidityEnds: Date | null;
  teamName: string;
  patientId: number;
  room: string;
}

export function FormOfMedicalAppointmentPlanningOptions(
  model?: MedicalAppointmentPlanningOptions
): FormGroup {
  model = model || ({} as MedicalAppointmentPlanningOptions);

  return new FormBuilder().group({
    id: [model.id],
    name: [model.name],
    initialValidityStarts: [ConvertUtils.dateToFormControl(model.initialValidityStarts)],
    initialValidityEnds: [ConvertUtils.dateToFormControl(model.initialValidityEnds)],
    finalValidityStarts: [ConvertUtils.dateToFormControl(model.finalValidityStarts)],
    finalValidityEnds: [ConvertUtils.dateToFormControl(model.finalValidityEnds)],
    teamName: [model.teamName],
    patientId: [model.patientId],
    room: [model.room],
  });
}

export function MedicalAppointmentPlanningOptionsOfForm(
  form: FormGroup
): MedicalAppointmentPlanningOptions {
  let model = {} as MedicalAppointmentPlanningOptions;

  model.id = form.getRawValue().id;
  model.name = form.getRawValue().name;
  model.initialValidityStarts = ConvertUtils.stringToDate(form.getRawValue().initialValidityStarts);
  model.initialValidityEnds = ConvertUtils.stringToDate(form.getRawValue().initialValidityEnds);
  model.finalValidityStarts = ConvertUtils.stringToDate(form.getRawValue().finalValidityStarts);
  model.finalValidityEnds = ConvertUtils.stringToDate(form.getRawValue().finalValidityEnds);
  model.teamName = form.getRawValue().teamName;
  model.patientId = form.getRawValue().patientId;
  model.room = form.getRawValue().room;
  return model;
}
