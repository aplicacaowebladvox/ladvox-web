import {
  ProtocolTherapeuticPlanModel,
  ProtocolTherapeuticPlanModelFromJson,
  ProtocolTherapeuticPlanModelToJson,
} from '../../../../models/protocol-therapeutic-plan.model';
import { PatientModel } from '../../../../models/patient.model';
import { CommonModule, Location } from '@angular/common';
import { Component, Input, OnInit, ViewChild, viewChild } from '@angular/core';
import { ProtocolModel } from '../../../../models/protocol.model';
import { PatientStore } from '../../../../core/stores/patient.store';
import { ProtocolTherapeuticPlanStore } from '../../../../core/stores/protocol-therapeutic-plan.store';
import { ProtocolStore } from '../../../../core/stores/protocol.store';
import { ConvertUtils } from '../../../shared/utils/convert.utils';
import { AnswerQuestionProtocolModel } from '../../../../models/answer-question-protocol.model';
import { QuestionProtocolModel } from '../../../../models/question-protocol.model';
import { AnswerTypeProtocolModel } from '../../../../models/answer-type-protocol.model';
import * as uuid from 'uuid';
import {
  CalculatorProtocolModel,
  ProtocolCalculatorComponent,
} from '../../../../core/components/protocol-calculator/protocol-calculator.component';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../../core/services/alert.provided.service';
import { alertApiError } from '../../../../core/operators/api-alert-error.operator';

@Component({
  selector: 'app-answer-protocol',
  standalone: true,
  imports: [CommonModule, ProtocolCalculatorComponent, FormsModule],
  templateUrl: './answer-protocol.component.html',
  styleUrl: './answer-protocol.component.scss',
  providers: [PatientStore, ProtocolTherapeuticPlanStore, ProtocolStore],
})
export class AnswerProtocolComponent implements OnInit {
  private vid!: string;
  @Input()
  patientId!: number;
  @Input()
  protocolTherapeuticPlanId!: number;

  patient!: PatientModel;
  protocolTherapeuticPlan!: ProtocolTherapeuticPlanModel;
  protocol!: ProtocolModel;

  @ViewChild('calculator')
  calculator?: ProtocolCalculatorComponent;

  public ConvertUtils = ConvertUtils;

  get isReady(): boolean {
    return !!this.protocol && !!this.patient && !!this.protocolTherapeuticPlan;
  }
  constructor(
    private patientStore: PatientStore,
    private protocolTherapeuticPlanStore: ProtocolTherapeuticPlanStore,
    private protocolStore: ProtocolStore,
    private router: Router,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService
  ) {
    this.vid = uuid.v7();
  }
  ngOnInit(): void {
    this.patientStore
      .getById(this.patientId)
      .pipe(alertApiError())
      .subscribe({
        next: (model) => {
          this.patient = model;
        },
      });
    if (this._restore()) return;
    this.protocolTherapeuticPlanStore
      .getById(this.protocolTherapeuticPlanId)
      .pipe(alertApiError())
      .subscribe({
        next: (model) => {
          this.protocolTherapeuticPlan = model;
          this.protocolTherapeuticPlan.answers = this.protocolTherapeuticPlan.answers || [];
          this._getProtocol();
        },
      });
  }
  someAnswerTypeHasName(protocol: ProtocolModel): boolean {
    return protocol.answersType.some((at) => at.name && at.name.length > 0);
  }
  clickSelect(
    question: QuestionProtocolModel,
    answerType: AnswerTypeProtocolModel,
    value: string | number
  ): void {
    let index = this.protocolTherapeuticPlan.answers.findIndex(
      (answer) => answer.answerTypeId == answerType.id && answer.questionId == question.id
    );
    if (index < 0) {
      this.protocolTherapeuticPlan.answers.push({
        key: uuid.v7(),
        answerTypeId: answerType.id,
        answer: value,
        answerValueType: answerType.answerValueType,
        questionId: question.id,
      } as AnswerQuestionProtocolModel);
    } else {
      this.protocolTherapeuticPlan.answers[index].answer = value;
    }
    this._save();
    this._calculateResult();
  }
  isSelected(
    question: QuestionProtocolModel,
    answerType: AnswerTypeProtocolModel,
    value: string | number
  ): boolean {
    return (
      this.protocolTherapeuticPlan.answers.findIndex(
        (answer) =>
          answer.answerTypeId == answerType.id &&
          answer.questionId == question.id &&
          answer.answer == value
      ) >= 0
    );
  }
  value(question: QuestionProtocolModel, answerType: AnswerTypeProtocolModel): number | null {
    let index = this.protocolTherapeuticPlan.answers.findIndex(
      (a) => a.questionId == question.id && a.answerTypeId == answerType.id
    );
    if (index < 0) {
      this.protocolTherapeuticPlan.answers.push({
        key: uuid.v7(),
        answerTypeId: answerType.id,
        answer: 0,
        answerValueType: answerType.answerValueType,
        questionId: question.id,
      } as AnswerQuestionProtocolModel);
      return 0;
    }
    return <number>this.protocolTherapeuticPlan.answers[index].answer;
  }
  changeValue(
    question: QuestionProtocolModel,
    answerType: AnswerTypeProtocolModel,
    value: number
  ): void {
    let index = this.protocolTherapeuticPlan.answers.findIndex(
      (a) => a.questionId == question.id && a.answerTypeId == answerType.id
    );
    if (index < 0) {
      this.protocolTherapeuticPlan.answers.push({
        key: uuid.v7(),
        answerTypeId: answerType.id,
        answer: value,
        answerValueType: answerType.answerValueType,
        questionId: question.id,
      } as AnswerQuestionProtocolModel);
    } else {
      this.protocolTherapeuticPlan.answers[index].answer = value;
    }
    this._save();
    this._calculateResult();
  }
  clickBack(): void {
    this.location.back();
  }
  clickSave(): void {
    this.location.back();
  }
  private _calculateResult(): void {
    if (!this.calculator) return;
    this.calculator!.answers = this.protocolTherapeuticPlan.answers;
    this.calculator!.calculate();
  }

  private _getProtocol(): void {
    this.protocolStore
      .get(this.protocolTherapeuticPlan.protocolId!)
      .pipe(alertApiError())
      .subscribe({
        next: () => {
          this.protocol = {} as ProtocolModel;
        },
      });
  }

  private _save(): void {
    localStorage.setItem(
      `AnswerProtocolComponent#${this.patientId}#${this.protocolTherapeuticPlanId}#protocolTherapeuticPlan`,
      ProtocolTherapeuticPlanModelToJson(this.protocolTherapeuticPlan)
    );
  }
  private _restore(): boolean {
    this.protocolTherapeuticPlan = ProtocolTherapeuticPlanModelFromJson(
      localStorage.getItem(
        `AnswerProtocolComponent#${this.patientId}#${this.protocolTherapeuticPlanId}#protocolTherapeuticPlan`
      )
    );
    if (!!this.protocolTherapeuticPlan) {
      this._getProtocol();
    }
    console.log(this.protocolTherapeuticPlan);
    return !!this.protocolTherapeuticPlan;
  }
}
