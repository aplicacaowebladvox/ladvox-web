import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConvertUtils } from '../modules/shared/utils/convert.utils';

export interface FunctionCalculatorModel {
  id: number;
  name: string;
  type: 'EQUATION' | 'RIGHT_AND_WRONG';
  functionText: string;
}

export function FormOfFunctionCalculatorModel(model?: FunctionCalculatorModel): FormGroup {
  model = model || ({} as FunctionCalculatorModel);

  return new FormBuilder().group({
    id: [model.id],
    name: [model.name, Validators.compose([Validators.required, Validators.maxLength(120)])],
    type: [model.type, Validators.compose([Validators.required])],
    functionText: [model.functionText],
    functionAddingField: [undefined],
    functionArray: [ConvertUtils.generateArrayFunction(model.functionText)],
  });
}

export function FunctionCalculatorModelOfForm(form: FormGroup): FunctionCalculatorModel {
  let model = {} as FunctionCalculatorModel;

  model.id = form.getRawValue().id;
  model.name = form.getRawValue().name;
  model.type = form.getRawValue().type;
  model.functionText = form.getRawValue().functionArray.join('');

  return model;
}
