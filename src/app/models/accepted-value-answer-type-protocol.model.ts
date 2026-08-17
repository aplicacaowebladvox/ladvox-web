import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as uuid from 'uuid';

export interface AcceptedValueAnswerTypeProtocolModel {
  key: string;
  id: number;
  value: string | number;
  presentation: string;
}

export function FormOfAcceptedValueAnswerTypeProtocolModel(
  model?: AcceptedValueAnswerTypeProtocolModel
): FormGroup {
  model = model || ({} as AcceptedValueAnswerTypeProtocolModel);

  return new FormBuilder().group({
    key: [model.key || uuid.v7()],
    id: [model.id],
    value: [model.value, Validators.compose([Validators.required])],
    presentation: [model.presentation, Validators.compose([Validators.maxLength(120)])],
  });
}

export function AcceptedValueAnswerTypeProtocolModelOfForm(
  form: FormGroup
): AcceptedValueAnswerTypeProtocolModel {
  let model = {} as AcceptedValueAnswerTypeProtocolModel;

  model.id = form.getRawValue().id;
  model.key = form.getRawValue().key;
  model.value = form.getRawValue().value;
  model.presentation = form.getRawValue().presentation;
  return model;
}
