import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as uuid from 'uuid';
import { ConvertUtils } from '../modules/shared/utils/convert.utils';

export interface ProtocolFirstStepModel {
  key: string;
  id?: number;
  name: string;
  abbreviation: string;
  description: string;
  initialValidity: Date | null;
  finalValidity: Date | null;
}

export function FormOfProtocolFirstStepModel(model?: ProtocolFirstStepModel): FormGroup {
  model = model || ({} as ProtocolFirstStepModel);

  return new FormBuilder().group({
    key: [model.key || uuid.v7()],
    id: [model.id],
    name: [model.name, Validators.compose([Validators.required, Validators.maxLength(120)])],
    abbreviation: [
      model.abbreviation,
      Validators.compose([Validators.required, Validators.maxLength(10)]),
    ],
    description: [model.description],
    initialValidity: [
      ConvertUtils.dateToFormControl(model.initialValidity),
      Validators.compose([Validators.required]),
    ],
    finalValidity: [ConvertUtils.dateToFormControl(model.finalValidity)],
  });
}

export function ProtocolFirstStepModelOfForm(form: FormGroup): ProtocolFirstStepModel {
  let model = {} as ProtocolFirstStepModel;

  model.id = form.getRawValue().id;
  model.key = form.getRawValue().key;
  model.name = form.getRawValue().name;
  model.abbreviation = form.getRawValue().abbreviation;
  model.description = form.getRawValue().description;
  model.initialValidity = ConvertUtils.stringToDate(form.getRawValue().initialValidity);
  model.finalValidity = ConvertUtils.stringToDate(form.getRawValue().finalValidity);
  return model;
}
