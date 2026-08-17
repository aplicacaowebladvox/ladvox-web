import { FormBuilder, FormGroup } from '@angular/forms';
import {
  FormOfQuestionProtocolModel,
  QuestionProtocolModel,
  QuestionProtocolModelOfForm,
} from './question-protocol.model';
import { AnswerTypeProtocolModel } from './answer-type-protocol.model';
import {
  FormOfQuestionGroupProtocolModel,
  QuestionGroupProtocolModel,
  QuestionGroupProtocolModelOfForm,
} from './question-group-protocol.model';

export interface ProtocolFourthStepModel {
  key: string;
  id?: number;
  answersType: Array<AnswerTypeProtocolModel>;
  questions: Array<QuestionProtocolModel>;
  groups: Array<QuestionGroupProtocolModel>;
  nextStepIsEnable: boolean;
}

export function FormOfProtocolFourthStepModel(model?: ProtocolFourthStepModel): FormGroup {
  model = model || ({} as ProtocolFourthStepModel);

  return new FormBuilder().group({
    key: [model.key],
    id: [model.id],
    answersType: [model.answersType || []],
    questions: [model.questions || []],
    groupsForm: [
      (model.groups || [{}]).map((group) => {
        group.questions = model.questions;
        return FormOfQuestionGroupProtocolModel(group);
      }),
    ],
    nextStepIsEnable: [model.nextStepIsEnable || false],
  });
}

export function ProtocolFourthStepModelOfForm(form: FormGroup): ProtocolFourthStepModel {
  let model = {} as ProtocolFourthStepModel;

  model.id = form.getRawValue().id;
  model.key = form.getRawValue().key;
  model.groups = (form.getRawValue().groupsForm || []).map((groupForm: FormGroup) =>
    QuestionGroupProtocolModelOfForm(groupForm)
  );
  model.nextStepIsEnable = form.getRawValue().nextStepIsEnable;
  return model;
}
