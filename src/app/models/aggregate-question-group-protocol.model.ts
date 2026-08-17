import { OperationAggregateProtocolEnum } from "./enum/operation-aggregate-protocol.enum";
import { PositionOperationAggregateProtocolEnum } from "./enum/position-operation-aggregate-protocol.enum";
import { QuestionGroupProtocolModel } from "./question-group-protocol.model";

export interface AggregateQuestionGroupProtocolModel {
  key?: string;
  group: QuestionGroupProtocolModel;
  burden: number;
  operation: OperationAggregateProtocolEnum;
  operationPosition: PositionOperationAggregateProtocolEnum;
}
