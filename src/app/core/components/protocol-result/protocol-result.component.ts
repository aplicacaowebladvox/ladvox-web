import { BaseResultQuestionGroupProtocolModel } from './../../../models/base-result-question-group-protocol.model';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ProtocolTherapeuticPlanStore } from '../../stores/protocol-therapeutic-plan.store';
import {
  ProtocolCalculatedGroupFunctionModel,
  ProtocolCalculatedModel,
} from '../../../models/protocol-calculated.model';
import { AnswerTypeProtocolModel } from '../../../models/answer-type-protocol.model';
import { alertApiError } from '../../operators/api-alert-error.operator';
import { AnswerQuestionProtocolModel } from '../../../models/answer-question-protocol.model';
import { ProtocolStore } from '../../stores/protocol.store';

@Component({
  selector: 'app-protocol-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './protocol-result.component.html',
  styleUrl: './protocol-result.component.scss',
  providers: [ProtocolTherapeuticPlanStore, ProtocolStore],
})
export class ProtocolResultComponent implements OnInit {
  @Input()
  protocolTherapeuticPlanId?: number;

  @Input()
  protocolId?: number;
  @Input()
  answers?: AnswerQuestionProtocolModel[];

  protocolCalculated!: ProtocolCalculatedModel;

  constructor(
    private protocolTherapeuticPlanStore: ProtocolTherapeuticPlanStore,
    private protocolStore: ProtocolStore
  ) {
    console.log('ProtocolResultComponent.constructor');
  }

  ngOnInit(): void {
    console.log('ProtocolResultComponent.ngOnInit');
    if (!!this.protocolTherapeuticPlanId) {
      this.protocolTherapeuticPlanStore
        .findResult(this.protocolTherapeuticPlanId)
        .pipe(alertApiError())
        .subscribe({
          next: (model) => {
            this.protocolCalculated = model;
          },
        });
    } else if (!!this.protocolId && !!this.answers && this.answers.length > 0) {
      this.protocolStore
        .calculate(this.protocolId, this.answers)
        .pipe(alertApiError())
        .subscribe({
          next: (model) => {
            this.protocolCalculated = model;
          },
        });
    }
  }
  getValuePresentation(
    groupFunctions: ProtocolCalculatedGroupFunctionModel[],
    answerType?: AnswerTypeProtocolModel
  ): string {
    for (let groupFunction of groupFunctions) {
      if (!answerType) return groupFunction.values[0].value + '';
      let index = groupFunction.values.findIndex((value) => value.answersTypeId == answerType.id);
      if (index >= 0) return groupFunction.values[index].value + '';
    }
    return '';
  }
}
