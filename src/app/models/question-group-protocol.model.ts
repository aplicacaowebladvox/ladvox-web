import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  BaseResultQuestionGroupProtocolModel,
  BaseResultQuestionGroupProtocolModelOfForm,
  FormOfBaseResultQuestionGroupProtocolModel,
} from './base-result-question-group-protocol.model';
import { QuestionProtocolModel } from './question-protocol.model';
import {
  FormOfFunctionCalculatorModel,
  FunctionCalculatorModel,
  FunctionCalculatorModelOfForm,
} from './function-calculator.model';
import * as uuid from 'uuid';
import { QuestionGroupProtocolFixedParamsEnum } from './enum/question-group-protocol-fixed-params.enum';

export interface QuestionGroupProtocolModel {
  key?: string;
  id?: number;
  name: string;
  orderView: number;
  calculateBasedOn: 'QUESTIONS' | 'GROUPS'
  questionsIds: Array<number>;
  questions: Array<QuestionProtocolModel>;
  baseResults: Array<BaseResultQuestionGroupProtocolModel>;
  functions: Array<string> | Array<FunctionCalculatorModel>;
}

export function FormOfQuestionGroupProtocolModel(model?: QuestionGroupProtocolModel): FormGroup {
  model = model || ({} as QuestionGroupProtocolModel);

  let questionsForm: any[] = (model.questions || []).map((question) => {
    return {
      questionModel: question,
      checked: new FormControl((model.questionsIds || []).includes(question.id)),
    };
  });

  let group = new FormBuilder().group({
    key: [model.key || uuid.v7()],
    id: [model.id],
    name: [model.name, Validators.compose([Validators.required, Validators.maxLength(120)])],
    orderView: [model.orderView || 0],
    questionsIds: [model.questionsIds || [], Validators.compose([Validators.required])],
    questionsForm: [questionsForm],
    calculateBasedOn: ['QUESTIONS', Validators.required],
    baseResultsForm: [
      (model.baseResults || []).map((baseResult) =>
        FormOfBaseResultQuestionGroupProtocolModel(baseResult)
      ),
    ],
    functionsForm: [
      (model.functions || []).map((functionT: any) =>
        FormOfFunctionCalculatorModel(<FunctionCalculatorModel>functionT)
      ),
    ],
    fixedFunctionSuggestions: [
      QuestionGroupProtocolFixedParamsEnum.mountQuestionGroupProtocolFixedParamsOption(model),
    ],
    functionSuggestions: [
      QuestionGroupProtocolFixedParamsEnum.mountQuestionGroupProtocolFixedParamsOption(model),
    ],
  });
  group.controls['name'].valueChanges.subscribe((v) => {
    let newValue = QuestionGroupProtocolFixedParamsEnum.mountQuestionGroupProtocolFixedParamsOption(
      {
        key: group.getRawValue().key,
        name: v,
      } as QuestionGroupProtocolModel
    );
    group.controls['fixedFunctionSuggestions'].setValue(newValue);
    group.controls['functionSuggestions'].setValue(newValue);
  });
  return group;
}

export function QuestionGroupProtocolModelOfForm(form: FormGroup): QuestionGroupProtocolModel {
  let model = {} as QuestionGroupProtocolModel;

  model.id = form.getRawValue().id;
  model.key = form.getRawValue().key;
  model.name = form.getRawValue().name;
  model.orderView = form.getRawValue().orderView;
  model.calculateBasedOn = form.getRawValue().calculateBasedOn;
  model.questionsIds = form
    .getRawValue()
    .questionsForm.filter((item: any) => item.checked.value)
    .map((item: any) => <number>item.questionModel.id);
  // model.questionsIds = form.getRawValue().questionsIds;
  model.baseResults = (form.getRawValue().baseResultsForm || []).map((baseResultForm: FormGroup) =>
    BaseResultQuestionGroupProtocolModelOfForm(baseResultForm)
  );
  model.functions = (form.getRawValue().functionsForm || []).map((functionForm: FormGroup) =>
    FunctionCalculatorModelOfForm(functionForm)
  );
  return model;
}
