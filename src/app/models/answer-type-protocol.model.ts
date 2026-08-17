import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  AcceptedValueAnswerTypeProtocolModel,
  AcceptedValueAnswerTypeProtocolModelOfForm,
  FormOfAcceptedValueAnswerTypeProtocolModel,
} from './accepted-value-answer-type-protocol.model';
import { AnswerValueTypeEnum } from './enum/answer-value-type.enum';
import * as uuid from 'uuid';

export interface AnswerTypeProtocolModel {
  key: string;
  id: number;
  sequence: number;
  name: string;
  acceptableValues: Array<AcceptedValueAnswerTypeProtocolModel>;
  useRangeAnswer: boolean;
  answerValueType: AnswerValueTypeEnum | string;
}

export function FormOfAnswerTypeProtocolModel(model?: AnswerTypeProtocolModel): FormGroup {
  model = model || ({} as AnswerTypeProtocolModel);

  return new FormBuilder().group({
    key: [model.key || uuid.v7()],
    id: [model.id],
    sequence: [model.sequence],
    name: [model.name, Validators.compose([Validators.maxLength(120)])],
    edittingAcceptableValueForm: [FormOfAcceptedValueAnswerTypeProtocolModel()],
    acceptableValuesForm: [
      (model.acceptableValues || []).map((acceptableValue) =>
        FormOfAcceptedValueAnswerTypeProtocolModel(acceptableValue)
      ),
      Validators.compose([Validators.required]),
    ],
    useRangeAnswer: [model.useRangeAnswer],
    answerValueType: [model.answerValueType || 'NUMERIC'],
  });
}

export function AnswerTypeProtocolModelOfForm(form: FormGroup): AnswerTypeProtocolModel {
  let model = {} as AnswerTypeProtocolModel;

  model.id = form.getRawValue().id;
  model.key = form.getRawValue().key;
  model.sequence = form.getRawValue().sequence;
  model.name = form.getRawValue().name;
  model.acceptableValues = (form.getRawValue().acceptableValuesForm || []).map(
    (acceptableValueForm: FormGroup) =>
      AcceptedValueAnswerTypeProtocolModelOfForm(acceptableValueForm)
  );
  model.useRangeAnswer = form.getRawValue().useRangeAnswer;
  model.answerValueType = form.getRawValue().answerValueType;
  return model;
}
