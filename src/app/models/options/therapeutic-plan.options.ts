import { PatientModel } from './../patient.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseGridOptions } from '../../modules/shared/components/card-table/models/base-grid-options.model';

export interface TherapeuticPlanOptions extends BaseGridOptions {
  id: number;
  patientId: number;
}

export function FormOfTherapeuticPlanOptions(model?: TherapeuticPlanOptions): FormGroup {
  model = model || ({} as TherapeuticPlanOptions);
  return new FormBuilder().group({
    id: [model.id],
    patientId: [model.patientId],
  });
}

export function TherapeuticPlanOptionsOfForm(form: FormGroup): TherapeuticPlanOptions {
  let model = {} as TherapeuticPlanOptions;

  model.id = form.getRawValue().id;
  model.patientId = form.getRawValue().patientId;

  return model;
}
