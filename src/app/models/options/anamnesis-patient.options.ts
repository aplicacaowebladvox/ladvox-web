import { BaseOptions } from 'vm';
import { BaseGridOptions } from '../../modules/shared/components/card-table/models/base-grid-options.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConvertUtils } from '../../modules/shared/utils/convert.utils';

export interface AnamnesisPatientOptions extends BaseGridOptions {
  id: number;
  patientId: number;
  therapistId: number;
  createdDateStarts: Date | null;
  createdDateEnds: Date | null;
}

export function FormOfAnamnesisPatientOptions(model?: AnamnesisPatientOptions): FormGroup {
  model = model || ({} as AnamnesisPatientOptions);

  return new FormBuilder().group({
    id: [model.id],
    patientId: [model.patientId],
    therapistId: [model.therapistId],
    createdDateStarts: [ConvertUtils.dateToFormControl(model.createdDateStarts)],
    createdDateEnds: [ConvertUtils.dateToFormControl(model.createdDateEnds)],
  });
}

export function AnamnesisPatientOptionsOfForm(form: FormGroup): AnamnesisPatientOptions {
  let model = {} as AnamnesisPatientOptions;

  model.id = form.getRawValue().id;
  model.patientId = form.getRawValue().patientId;
  model.therapistId = form.getRawValue().therapistId;
  model.createdDateStarts = ConvertUtils.stringToDate(form.getRawValue().createdDateStarts);
  model.createdDateEnds = ConvertUtils.stringToDate(form.getRawValue().createdDateEnds);

  return model;
}
