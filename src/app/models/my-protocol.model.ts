import { AnswerTypeProtocolModel } from './answer-type-protocol.model';
import { QuestionProtocolModel } from './question-protocol.model';

export interface MyProtocolModel {
  id?: number;
  name: string;
  abbreviation: string;
  description: string;
  answersType: Array<AnswerTypeProtocolModel>;
  questions: Array<QuestionProtocolModel>;
}
