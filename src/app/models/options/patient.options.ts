import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseGridOptions } from '../../modules/shared/components/card-table/models/base-grid-options.model';

export class PatientOptionsModel extends BaseGridOptions {
  id?: number;
  name?: string;
  document?: string;
  ageStarts?: number;
  ageEnds?: number;
}

export function FormOfPatientOptionsModel(model?: PatientOptionsModel): FormGroup {
  model = model || ({} as PatientOptionsModel);

  return new FormBuilder().group({
    id: [model.id],
    name: [model.name],
    document: [model.document],
    ageStarts: [model.ageStarts],
    ageEnds: [model.ageEnds],
  });
}

export function PatientOptionsModelOfForm(form: FormGroup): PatientOptionsModel {
  let model = {} as PatientOptionsModel;

  model.id = form.getRawValue().id;
  model.name = form.getRawValue().name;
  model.document = form.getRawValue().document;
  model.ageStarts = form.getRawValue().ageStarts;
  model.ageEnds = form.getRawValue().ageEnds;

  return model;
}
