import { AnswerTypeProtocolModel } from './answer-type-protocol.model';
import { AnswerValueTypeEnum } from './enum/answer-value-type.enum';
import { QuestionProtocolModel } from './question-protocol.model';

export interface AnswerQuestionProtocolModel {
  id: number;
  key?: string;
  answerTypeId: number;
  // answerType: AnswerTypeProtocolModel;
  answer: string | number;
  answerValueType: AnswerValueTypeEnum | string;
  questionId: number;
  // question: QuestionProtocolModel;
}
