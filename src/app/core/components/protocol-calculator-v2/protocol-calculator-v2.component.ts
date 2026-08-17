import { Component, Input } from '@angular/core';
import { AnswerTypeProtocolModel } from '../../../models/answer-type-protocol.model';
import { QuestionProtocolModel } from '../../../models/question-protocol.model';
import { QuestionGroupProtocolModel } from '../../../models/question-group-protocol.model';

@Component({
  selector: 'app-protocol-calculator-v2',
  standalone: true,
  imports: [],
  templateUrl: './protocol-calculator-v2.component.html',
  styleUrl: './protocol-calculator-v2.component.scss',
})
export class ProtocolCalculatorV2Component {
  @Input()
  answersType!: Array<AnswerTypeProtocolModel>;
  @Input()
  questions!: Array<QuestionProtocolModel>;
  @Input()
  group?: QuestionGroupProtocolModel;
  @Input()
  groups?: Array<QuestionGroupProtocolModel>;



  resultFunction!: string;


}
