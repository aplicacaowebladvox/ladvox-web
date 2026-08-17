import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as uuid from 'uuid';

export interface QuestionProtocolModel {
  key?: string;
  id: number;
  sequence: number;
  question: string;
  abbreviation: string;
}

export function FormOfQuestionProtocolModel(model?: QuestionProtocolModel): FormGroup {
  model = model || ({} as QuestionProtocolModel);

  return new FormBuilder().group({
    key: [model.key || uuid.v7()],
    id: [model.id],
    sequence: [model.sequence],
    question: [
      model.question,
      Validators.compose([Validators.required, Validators.maxLength(255)]),
    ],
    abbreviation: [model.abbreviation, Validators.compose([Validators.maxLength(5)])],
  });
}

export function QuestionProtocolModelOfForm(form: FormGroup): QuestionProtocolModel {
  let model = {} as QuestionProtocolModel;

  model.id = form.getRawValue().id;
  model.key = form.getRawValue().key;
  model.sequence = form.getRawValue().sequence;
  model.question = form.getRawValue().question;
  model.abbreviation = form.getRawValue().abbreviation;
  return model;
}
