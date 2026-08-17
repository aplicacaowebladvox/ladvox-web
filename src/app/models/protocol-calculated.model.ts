import { AnswerTypeProtocolModel } from './answer-type-protocol.model';
import { BaseResultQuestionGroupProtocolModel } from './base-result-question-group-protocol.model';

export interface ProtocolCalculatedModel {
  id: number;
  abbreviation: string;
  name: string;
  protocolTherapeuticPlanId: number;
  answersType: AnswerTypeProtocolModel[];
  groups: ProtocolCalculatedGroupModel[];
  functions: ProtocolCalculatedGroupFunctionModel[];
}
export interface ProtocolCalculatedGroupModel {
  groupId: number;
  groupName: string;
  groupBaseResults: BaseResultQuestionGroupProtocolModel[];
  groupFunctions: ProtocolCalculatedGroupFunctionModel[];
}
export interface ProtocolCalculatedGroupFunctionModel {
  id: number;
  functionText: string;
  name: string;
  values: ProtocolCalculatedGroupFunctionEvaluatedModel[];
}

export interface ProtocolCalculatedGroupFunctionEvaluatedModel {
  functionTextEvaluated: string;
  answersTypeId: number;
  value: number;
}
