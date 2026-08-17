import { FormBuilder, FormGroup } from '@angular/forms';
import {
  FormOfQuestionProtocolModel,
  QuestionProtocolModel,
  QuestionProtocolModelOfForm,
} from './question-protocol.model';

export interface ProtocolThirdStepModel {
  key: string;
  id?: number;
  questions: Array<QuestionProtocolModel>;
  nextStepIsEnable: boolean;
}

export function FormOfProtocolThirdStepModel(model?: ProtocolThirdStepModel): FormGroup {
  model = model || ({} as ProtocolThirdStepModel);

  return new FormBuilder().group({
    key: [model.key],
    id: [model.id],
    edittingQuestionProtocolForm: [FormOfQuestionProtocolModel()],
    questionsForm: [
      (model.questions || [{}]).map((question) => FormOfQuestionProtocolModel(question)),
    ],
    nextStepIsEnable: [model.nextStepIsEnable || false],
  });
}

export function ProtocolThirdStepModelOfForm(form: FormGroup): ProtocolThirdStepModel {
  let model = {} as ProtocolThirdStepModel;

  model.id = form.getRawValue().id;
  model.key = form.getRawValue().key;
  model.questions = (form.getRawValue().questionsForm || []).map((questionForm: FormGroup) =>
    QuestionProtocolModelOfForm(questionForm)
  );
  model.nextStepIsEnable = form.getRawValue().nextStepIsEnable;
  return model;
}
