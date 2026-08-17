import { AnswerTypeProtocolModel } from './answer-type-protocol.model';
import { QuestionGroupProtocolModel } from './question-group-protocol.model';
import { QuestionProtocolModel } from './question-protocol.model';

export interface ProtocolModel {
  key: string;
  id?: number;
  name: string;
  abbreviation: string;
  description: string;
  initialValidity: Date;
  finalValidity: Date;
  answersType: Array<AnswerTypeProtocolModel>;
  questions: Array<QuestionProtocolModel>;
  groups: Array<QuestionGroupProtocolModel>;
  functions: Array<string>;
}
