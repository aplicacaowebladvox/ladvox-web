import { FormBuilder, FormGroup } from '@angular/forms';
import {
  AnswerTypeProtocolModel,
  AnswerTypeProtocolModelOfForm,
  FormOfAnswerTypeProtocolModel,
} from './answer-type-protocol.model';

export interface ProtocolSecondStepModel {
  key: string;
  id?: number;
  answersType: Array<AnswerTypeProtocolModel>;
  nextStepIsEnable: boolean;
}

export function FormOfProtocolSecondStepModel(model?: ProtocolSecondStepModel): FormGroup {
  model = model || ({} as ProtocolSecondStepModel);

  return new FormBuilder().group({
    key: [model.key],
    id: [model.id],
    answersTypeForm: [
      (model.answersType || [{}]).map((answerType) => FormOfAnswerTypeProtocolModel(answerType)),
    ],
    nextStepIsEnable: [model.nextStepIsEnable || false],
  });
}

export function ProtocolSecondStepModelOfForm(form: FormGroup): ProtocolSecondStepModel {
  let model = {} as ProtocolSecondStepModel;

  model.id = form.getRawValue().id;
  model.key = form.getRawValue().key;
  model.answersType = (form.getRawValue().answersTypeForm || []).map((answerTypeForm: FormGroup) =>
    AnswerTypeProtocolModelOfForm(answerTypeForm)
  );
  model.nextStepIsEnable = form.getRawValue().nextStepIsEnable;
  return model;
}
