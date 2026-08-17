import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AnswerValueTypeEnum } from './enum/answer-value-type.enum';
import * as uuid from 'uuid';

export interface BaseResultQuestionGroupProtocolModel {
  key?: string;
  id: number;
  name: string;
  isRange: boolean;
  initialValue: string | number;
  finalValue: string | number;
  answerType: AnswerValueTypeEnum | string;
  answerValueType: string;
}

export function FormOfBaseResultQuestionGroupProtocolModel(
  model?: BaseResultQuestionGroupProtocolModel
): FormGroup {
  model = model || ({} as BaseResultQuestionGroupProtocolModel);

  return new FormBuilder().group({
    key: [model.key || uuid.v7()],
    id: [model.id],
    name: [model.name, Validators.compose([Validators.required, Validators.maxLength(120)])],
    isRange: [model.isRange],
    initialValue: [
      model.initialValue,
      Validators.compose([Validators.required, Validators.maxLength(120)]),
    ],
    finalValue: [
      model.finalValue,
      Validators.compose([Validators.required, Validators.maxLength(120)]),
    ],
    answerValueType: [model.answerValueType || AnswerValueTypeEnum.NUMERIC.id],
  });
}

export function BaseResultQuestionGroupProtocolModelOfForm(
  form: FormGroup
): BaseResultQuestionGroupProtocolModel {
  let model = {} as BaseResultQuestionGroupProtocolModel;

  model.id = form.getRawValue().id;
  model.key = form.getRawValue().key;
  model.name = form.getRawValue().name;
  model.isRange = form.getRawValue().isRange;
  model.initialValue = form.getRawValue().initialValue;
  model.finalValue = form.getRawValue().finalValue;
  model.answerValueType = form.getRawValue().answerValueType;
  return model;
}
