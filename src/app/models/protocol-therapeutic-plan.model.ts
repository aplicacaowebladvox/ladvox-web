import { FormBuilder, FormGroup } from '@angular/forms';
import { AnswerQuestionProtocolModel } from './answer-question-protocol.model';
import { ProtocolModel } from './protocol.model';
import { ConvertUtils } from '../modules/shared/utils/convert.utils';

export interface ProtocolTherapeuticPlanModel {
  id: number;
  protocolId: number;
  requestDate: Date | null;
  answeredDate: Date;
  therapeuticPlanId: number;
  answers: AnswerQuestionProtocolModel[];
}

export function FormOfProtocolTherapeuticPlanModel(
  model?: ProtocolTherapeuticPlanModel
): FormGroup {
  model = model || ({} as ProtocolTherapeuticPlanModel);
  let requestDateS = ConvertUtils.dateToFormControl(model.requestDate, true);
  return new FormBuilder().group({
    id: [model.id],
    protocolId: [model.protocolId],
    requestDate: [requestDateS],
    therapeuticPlanId: [model.therapeuticPlanId],
  });
}

export function ProtocolTherapeuticPlanModelOfForm(form: FormGroup): ProtocolTherapeuticPlanModel {
  let model = {} as ProtocolTherapeuticPlanModel;

  model.id = form.getRawValue().id;
  model.protocolId = form.getRawValue().protocolId;
  model.requestDate = ConvertUtils.stringToDate(form.getRawValue().requestDate, true);
  model.therapeuticPlanId = form.getRawValue().therapeuticPlanId;

  return model;
}

export function ProtocolTherapeuticPlanModelFromJson(
  json: string | null
): ProtocolTherapeuticPlanModel {
  return !!json ? JSON.parse(json) : null;
}

export function ProtocolTherapeuticPlanModelToJson(object: ProtocolTherapeuticPlanModel): string {
  return JSON.stringify(object);
}
