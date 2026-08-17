import { Component, Input } from '@angular/core';
import { ProtocolModel } from '../../../models/protocol.model';
import { AnswerQuestionProtocolModel } from '../../../models/answer-question-protocol.model';
import { AnswerTypeProtocolModel } from '../../../models/answer-type-protocol.model';
import { BasicCalculator } from './calc/basic-calculator.class';
import { AcceptedValueAnswerTypeProtocolModel } from '../../../models/accepted-value-answer-type-protocol.model';
import { QuestionProtocolModel } from '../../../models/question-protocol.model';
import { QuestionGroupProtocolModel } from '../../../models/question-group-protocol.model';
import * as uuid from 'uuid';
import { KnobModule } from 'primeng/knob';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { reduceString } from '../../../modules/shared/utils/string.util';
import { AnswerValueTypeEnum } from '../../../models/enum/answer-value-type.enum';
import { ConvertUtils } from '../../../modules/shared/utils/convert.utils';
import { BaseResultQuestionGroupProtocolModel } from '../../../models/base-result-question-group-protocol.model';
import { FunctionCalculatorModel } from '../../../models/function-calculator.model';

@Component({
  selector: 'app-protocol-calculator',
  standalone: true,
  imports: [CommonModule, KnobModule, FormsModule],
  templateUrl: './protocol-calculator.component.html',
  styleUrl: './protocol-calculator.component.scss',
})
export class ProtocolCalculatorComponent {
  @Input('protocol')
  protocol?: ProtocolModel;

  @Input('answers')
  _answers?: Array<AnswerQuestionProtocolModel>;
  @Input('randomAnswersIfNull')
  randomAnswersIfNull: boolean = false;

  get answers(): Array<AnswerQuestionProtocolModel> | undefined {
    return this._answers;
  }

  set answers(__answers: Array<AnswerQuestionProtocolModel>) {
    this._answers = __answers;
  }

  private _result: CalculatorProtocolModel | null = null;
  get result(): CalculatorProtocolModel | null {
    return !!this._result ? this._result : this.calculate();
  }

  private mapQuestionAnswers: Map<string, string[]> = new Map<string, string[]>();

  private _fillMapQuestionAnswers(): void {
    (this.answers || []).forEach((answer) => {
      if (!answer.questionId) return;
      if (!this.mapQuestionAnswers.has(answer.questionId.toString())) {
        this.mapQuestionAnswers.set(answer.questionId.toString(), []);
      }
      let list = this.mapQuestionAnswers.get(answer.questionId.toString()) || [];
      if (answer.key && !list.includes(answer.key)) list.push(answer.key);
      this.mapQuestionAnswers.set(answer.questionId.toString(), list);
    });
  }

  static build(
    answersTypeProtocolModel: Array<AnswerTypeProtocolModel>,
    questionsProtocolModel: QuestionProtocolModel[],
    questionGroupProtocolModel: QuestionGroupProtocolModel,
    randomAnswersIfNull: boolean
  ): ProtocolCalculatorComponent {
    const protocolCalculatorComponent = new ProtocolCalculatorComponent();
    protocolCalculatorComponent.protocol = {} as ProtocolModel;
    protocolCalculatorComponent.protocol.key = uuid.v7();
    protocolCalculatorComponent.protocol.initialValidity =
      protocolCalculatorComponent.protocol.finalValidity = new Date();
    protocolCalculatorComponent.protocol.answersType = answersTypeProtocolModel;
    protocolCalculatorComponent.protocol.questions = questionsProtocolModel;
    protocolCalculatorComponent.protocol.groups = [questionGroupProtocolModel];
    protocolCalculatorComponent.randomAnswersIfNull = randomAnswersIfNull;
    return protocolCalculatorComponent;
  }

  reduceString = reduceString;
  hasBaseResults(group: CalculatorQuestionGroupProtocolModel): boolean {
    return !this.protocol
      ? false
      : !!(this.protocol.groups || []).find((g) => g.key == group.key)?.baseResults;
  }
  baseResults(group: CalculatorQuestionGroupProtocolModel): BaseResultQuestionGroupProtocolModel[] {
    if (!this.protocol) return [];
    let index = (this.protocol.groups || []).findIndex((g) => (g.key = group.key));
    if (index < 0) return [];
    return this.protocol.groups[index].baseResults || [];
  }
  getAnswersOfQuestionKey(questionKey: string): AnswerQuestionProtocolModel[] {
    let ret = (this.answers || []).filter(
      (answer) =>
        answer.key && (this.mapQuestionAnswers.get(questionKey) || []).includes(answer.key)
    );
    console.log(ret);
    return ret;
  }
  calculate(
    randomAnswersIfNull: boolean = this.randomAnswersIfNull
  ): CalculatorProtocolModel | null {
    if (randomAnswersIfNull && (!this.answers || (this.answers || []).length == 0)) {
      this._generateRandomAnswers();
    }
    if (this.validate() != 100) {
      return null;
    }
    if (!this.answers || this.answers.length == 0) {
      return null;
    }
    this._fillMapQuestionAnswers();
    let calculatorModel = this._genareteCalculatorsModels();
    if (!calculatorModel) {
      this._result = null;
      return this._result;
    }
    this._result = this._calculate(calculatorModel);
    return this._result;
  }

  validate(): number {
    let protocolProgress = this._validateProtocolModel(this.protocol);

    let answersProgress = 0;
    if (!this.answers || this.answers.length <= 0) {
      answersProgress = 1;
    } else {
      answersProgress =
        this.answers
          .map((answerQuestionProtocolModel) =>
            this._validateAnswerQuestionProtocolModel(answerQuestionProtocolModel)
          )
          .reduce((accumulator, currentValue) => accumulator + currentValue, 0) /
        this.answers.length;
    }
    let geralProgress = (protocolProgress + answersProgress) / 2;
    return (1 - geralProgress) * 100;
  }
  getValuePresentation(finalValue: string | number | null): string {
    if (finalValue == null) return '';
    if (typeof finalValue == 'number') {
      finalValue = <number>finalValue;
      return finalValue.toFixed(2);
    } else {
      return <string>finalValue;
    }
  }
  private _validateAnswerQuestionProtocolModel(
    answerQuestionProtocolModel: AnswerQuestionProtocolModel
  ): number {
    if (!answerQuestionProtocolModel) return 1;
    const notFilled: string[] = [];
    let answerTypeProtocolAvarage = 0;
    let questionProtocolAvarage = 0;

    if (!answerQuestionProtocolModel.key) {
      notFilled.push('key');
    }
    if (!answerQuestionProtocolModel.answerTypeId) {
      notFilled.push('answerType');
    } else {
      answerTypeProtocolAvarage = this._validateAnswerTypeProtocolModel(
        answerQuestionProtocolModel.answerTypeId
      );
    }
    if (
      answerQuestionProtocolModel.answer == undefined ||
      answerQuestionProtocolModel.answer == null
    ) {
      notFilled.push('answer');
    }
    if (!answerQuestionProtocolModel.answerValueType) {
      notFilled.push('answerValueType');
    }
    if (!answerQuestionProtocolModel.questionId) {
      notFilled.push('question');
    } else {
      questionProtocolAvarage = this._validateQuestionProtocolModel(
        answerQuestionProtocolModel.questionId
      );
    }

    return (notFilled.length + answerTypeProtocolAvarage + questionProtocolAvarage) / 5;
  }

  private _validateProtocolModel(protocolModel?: ProtocolModel): number {
    if (!protocolModel) return 1;
    const notFilled: string[] = [];
    let answersTypeAvarage = 0;
    let questionsAvarage = 0;
    let groupsAvarage = 0;

    if (!protocolModel.key) {
      notFilled.push('key');
    }
    if (!protocolModel.answersType || protocolModel.answersType.length <= 0) {
      notFilled.push('answersType');
    } else {
      let answersTypeNotFilled = protocolModel.answersType.map((answerTypeProtocolModel) =>
        this._validateAnswerTypeProtocolModel(answerTypeProtocolModel)
      );
      answersTypeAvarage =
        answersTypeNotFilled.reduce((accumulator, currentValue) => accumulator + currentValue, 0) /
        protocolModel.answersType.length;
    }
    if (!protocolModel.questions || protocolModel.questions.length <= 0) {
      notFilled.push('questions');
    } else {
      let questionsNotFilled = protocolModel.questions.map((questionProtocolModel) =>
        this._validateQuestionProtocolModel(questionProtocolModel)
      );
      questionsAvarage =
        questionsNotFilled.reduce((accumulator, currentValue) => accumulator + currentValue, 0) /
        protocolModel.questions.length;
    }
    if (!protocolModel.groups || protocolModel.groups.length <= 0) {
      notFilled.push('groups');
    } else {
      let groupsNotFilled = protocolModel.groups.map((questionGroupProtocolModel) =>
        this._validateQuestionGroupProtocolModel(questionGroupProtocolModel)
      );
      groupsAvarage =
        groupsNotFilled.reduce((accumulator, currentValue) => accumulator + currentValue, 0) /
        protocolModel.groups.length;
    }

    return (notFilled.length + answersTypeAvarage + questionsAvarage + groupsAvarage) / 4;
  }

  private _validateAnswerTypeProtocolModel(answersType: AnswerTypeProtocolModel | number): number {
    if (!answersType) return 1;
    if (typeof answersType == 'number') return 1;
    const notFilled: string[] = [];
    let acceptableValuesAvarage = 0;
    if (!answersType.key) {
      notFilled.push('key');
    }
    if (answersType.sequence == undefined || answersType.sequence == null) {
      notFilled.push('sequence');
    }
    if (!answersType.acceptableValues || answersType.acceptableValues.length <= 0) {
      notFilled.push('acceptableValues');
    } else {
      let acceptableValuesNotFilled = answersType.acceptableValues.map((acceptableValue) =>
        this._validateAcceptedValueAnswerTypeProtocolModel(acceptableValue)
      );
      acceptableValuesAvarage =
        acceptableValuesNotFilled.reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          0
        ) / answersType.acceptableValues.length;
    }
    if (answersType.useRangeAnswer == undefined || answersType.useRangeAnswer == null) {
      notFilled.push('useRangeAnswer');
    }
    if (!answersType.answerValueType) {
      notFilled.push('answerValueType');
    }
    return (notFilled.length + acceptableValuesAvarage) / 5;
  }

  private _validateAcceptedValueAnswerTypeProtocolModel(
    acceptedValueAnswerTypeProtocolModel: AcceptedValueAnswerTypeProtocolModel
  ): number {
    const notFilled: string[] = [];
    if (!acceptedValueAnswerTypeProtocolModel.key) {
      notFilled.push('key');
    }
    if (
      acceptedValueAnswerTypeProtocolModel.value == undefined ||
      acceptedValueAnswerTypeProtocolModel.value == null
    ) {
      notFilled.push('value');
    }
    return notFilled.length / 2;
  }

  private _validateQuestionProtocolModel(
    questionProtocolModel: QuestionProtocolModel | number
  ): number {
    if (!questionProtocolModel) return 1;
    if (typeof questionProtocolModel == 'number') return 0;
    const notFilled: string[] = [];
    if (!questionProtocolModel.key) {
      notFilled.push('key');
    }
    if (!questionProtocolModel.sequence) {
      notFilled.push('sequence');
    }
    return notFilled.length / 2;
  }
  private _validateQuestionGroupProtocolModel(
    questionGroupProtocolModel: QuestionGroupProtocolModel
  ): number {
    if (!questionGroupProtocolModel) return 1;
    const notFilled: string[] = [];
    let questionsAvarage = 0;
    if (!questionGroupProtocolModel.key) {
      notFilled.push('key');
    }
    if (!questionGroupProtocolModel.questions || questionGroupProtocolModel.questions.length <= 0) {
      notFilled.push('questions');
    } else {
      let questionsNotFilled = questionGroupProtocolModel.questions.map((questionProtocolModel) =>
        this._validateQuestionProtocolModel(questionProtocolModel)
      );
      questionsAvarage =
        questionsNotFilled.reduce((accumulator, currentValue) => accumulator + currentValue, 0) /
        questionGroupProtocolModel.questions.length;
    }
    return (notFilled.length + questionsAvarage) / 2;
  }
  private _generateRandomAnswers(): void {
    this.answers = [];
    this.protocol?.answersType.forEach((answerType) => {
      this.protocol?.questions.forEach((question) => {
        let answer: AnswerQuestionProtocolModel = {} as AnswerQuestionProtocolModel;
        answer.key = uuid.v7();
        answer.questionId = question.id;
        answer.answerTypeId = answerType.id;
        answer.answerValueType =
          typeof answerType.answerValueType == 'object'
            ? <AnswerValueTypeEnum>answerType.answerValueType
            : AnswerValueTypeEnum.parse(<string>answerType.answerValueType) ||
              AnswerValueTypeEnum.NUMERIC;
        answer.answer = this._randomAnswerValue(answerType);
        this.answers!.push(answer);
      });
    });
  }

  private _randomAnswerValue(answerType: AnswerTypeProtocolModel): string | number {
    if (answerType.useRangeAnswer) {
      let min = Number.MAX_VALUE;
      let max = Number.MIN_VALUE;
      answerType.acceptableValues.forEach((acceptableValue) => {
        max = <number>acceptableValue.value > max ? <number>acceptableValue.value : max;
        min = <number>acceptableValue.value < min ? <number>acceptableValue.value : min;
      });
      return Number.parseFloat((Math.random() * (max - min) + min).toFixed(2));
    }
    let index = Number.parseInt((Math.random() * answerType.acceptableValues.length).toFixed(0));
    return (
      answerType.acceptableValues.at(index)?.value ||
      (answerType.answerValueType == AnswerValueTypeEnum.TEXT ? '' : 0)
    );
  }

  private _genareteCalculatorsModels(): CalculatorProtocolModel | null {
    if (!this.protocol) return null;
    const calculatorProtocolModel = {} as CalculatorProtocolModel;

    calculatorProtocolModel.key = this.protocol.key;
    calculatorProtocolModel.name = this.protocol.name;
    calculatorProtocolModel.abbreviation = this.protocol.abbreviation;
    calculatorProtocolModel.groups = this.protocol.groups.map((questionGroupProtocolModel) => {
      const calculatorQuestionGroupProtocolModel = {} as CalculatorQuestionGroupProtocolModel;

      questionGroupProtocolModel.key = questionGroupProtocolModel.key || uuid.v7();
      calculatorQuestionGroupProtocolModel.key = questionGroupProtocolModel.key;
      calculatorQuestionGroupProtocolModel.name = questionGroupProtocolModel.name;
      calculatorQuestionGroupProtocolModel.questions = questionGroupProtocolModel.questions.map(
        (questionProtocolModel) => {
          const calculatorQuestionProtocolModel = {} as CalculatorQuestionProtocolModel;

          questionProtocolModel.key = questionProtocolModel.key || uuid.v7();
          calculatorQuestionProtocolModel.key = questionProtocolModel.key;
          calculatorQuestionProtocolModel.sequence = questionProtocolModel.sequence;
          calculatorQuestionProtocolModel.question = questionProtocolModel.question;
          calculatorQuestionProtocolModel.abbreviation = questionProtocolModel.abbreviation;
          calculatorQuestionProtocolModel.answers = (this.answers || [])
            .filter(
              (answerQuestionProtocolModel) =>
                answerQuestionProtocolModel.questionId == questionProtocolModel.id
            )
            .map((answerQuestionProtocolModel) => {
              const calculatorAnserQuestionProtocolModel =
                {} as CalculatorAnserQuestionProtocolModel;

              answerQuestionProtocolModel.key = answerQuestionProtocolModel.key || uuid.v7();
              calculatorAnserQuestionProtocolModel.key = answerQuestionProtocolModel.key;
              calculatorAnserQuestionProtocolModel.answerType = {
                id: answerQuestionProtocolModel.answerTypeId,
              } as AnswerTypeProtocolModel;
              calculatorAnserQuestionProtocolModel.answerValueType = AnswerValueTypeEnum.parse(
                answerQuestionProtocolModel.answerValueType
              )!;
              calculatorAnserQuestionProtocolModel.answer = answerQuestionProtocolModel.answer;

              return calculatorAnserQuestionProtocolModel;
            });

          return calculatorQuestionProtocolModel;
        }
      );
      calculatorQuestionGroupProtocolModel.sum = [];
      calculatorQuestionGroupProtocolModel.concats = [];
      if (!!questionGroupProtocolModel.functions) {
        let ft = questionGroupProtocolModel.functions.map((i) => {
          if (typeof i == 'object') {
            return (<FunctionCalculatorModel>i).functionText;
          }
          return <string>i;
        });
        calculatorQuestionGroupProtocolModel.functions = ft || [];
      }
      calculatorQuestionGroupProtocolModel.finalValues = [];

      return calculatorQuestionGroupProtocolModel;
    });
    calculatorProtocolModel.functions = this.protocol.functions || [];
    calculatorProtocolModel.finalValues = [];

    return calculatorProtocolModel;
  }

  private _calculate(protocol: CalculatorProtocolModel): CalculatorProtocolModel {
    for (let group of protocol.groups) {
      const answerTypes = group.questions[0].answers
        .map((a) => a.answerType)
        .filter((v, i, a) => a.indexOf(v) === i);

      answerTypes.forEach((answerType, answerTypeIndex) => {
        for (let question of group.questions) {
          question.answers.forEach((answer) => {
            if (answerType.key == answer.answerType.key) {
              if (answer.answerValueType == AnswerValueTypeEnum.TEXT) {
                group.concats[answerTypeIndex] = [
                  ...(group.concats.at(answerTypeIndex) || []),
                  '(' + question.sequence + ')' + question.abbreviation + '#' + answer.answer,
                ];
              } else if (answer.answerValueType == AnswerValueTypeEnum.NUMERIC) {
                group.sum[answerTypeIndex] =
                  (group.sum[answerTypeIndex] || 0) +
                  (ConvertUtils.stringToNumber(<string>answer.answer) || 0);
              }
            }
          });
          if (question.answers.length > answerTypes.length) {
            question.answers = question.answers.slice(0, answerTypes.length);
          }
        }
      });

      answerTypes.forEach((answerType, i) => {
        if (answerType.answerValueType == AnswerValueTypeEnum.NUMERIC) {
          let max = Number.MIN_VALUE;
          answerType.acceptableValues.forEach((acc) => (max = Math.max(max, <number>acc.value)));

          group.functions.forEach((f) => {
            let funcionReplaced = '';
            funcionReplaced = f.replaceAll(
              '@' + ConvertUtils.uuidV7WithoutOpperators(group.key) + '#groupSum',
              (<number>group.sum[i] || 0) + ''
            );
            funcionReplaced = funcionReplaced.replaceAll(
              '@' + ConvertUtils.uuidV7WithoutOpperators(group.key) + '#groupQuestionsLength',
              (<number>group.questions.length || 0) + ''
            );
            funcionReplaced = funcionReplaced.replaceAll(
              '@' + ConvertUtils.uuidV7WithoutOpperators(group.key) + '#groupMaxSum',
              (<number>group.questions.length || 0) * max + ''
            );
            group.finalValues[i] = Number.parseFloat(BasicCalculator.solve(funcionReplaced));
          });
        } else if (answerType.answerValueType == AnswerValueTypeEnum.TEXT) {
          group.finalValues[i] = group.concats[i].join(';');
        }
      });
    }
    protocol.functions.forEach((f, j) => {
      let funcionReplaced = f;
      protocol.groups.forEach((group) => {
        const answerTypes = group.questions[0].answers.map((a) => a.answerType);
        answerTypes.forEach((answerType, i) => {
          if (answerType.answerValueType == AnswerValueTypeEnum.NUMERIC) {
            let max = Number.MIN_VALUE;
            answerType.acceptableValues.forEach((acc) => (max = Math.max(max, <number>acc.value)));
            funcionReplaced = funcionReplaced.replaceAll(
              '@' + ConvertUtils.uuidV7WithoutOpperators(group.key) + '#groupSum',
              (<number>group.sum[i] || 0) + ''
            );
            funcionReplaced = funcionReplaced.replaceAll(
              '@' + ConvertUtils.uuidV7WithoutOpperators(group.key) + '#groupQuestionsLength',
              (<number>group.questions.length || 0) + ''
            );
            funcionReplaced = funcionReplaced.replaceAll(
              '@' + ConvertUtils.uuidV7WithoutOpperators(group.key) + '#groupMaxSum',
              (<number>group.questions.length || 0) * max + ''
            );
          }
        });
      });
      protocol.finalValues[j] = Number.parseFloat(BasicCalculator.solve(funcionReplaced));
    });
    if (protocol.finalValues.length > protocol.functions.length)
      protocol.finalValues = protocol.finalValues.slice(0, protocol.functions.length);
    return protocol;
  }
}

export class CalculatorProtocolModel {
  key!: string;
  name!: string;
  abbreviation!: string;
  groups!: CalculatorQuestionGroupProtocolModel[];
  functions!: Array<string>;
  finalValues: Array<string | number> = [];
}

export class CalculatorQuestionGroupProtocolModel {
  key!: string;

  name!: string;
  questions!: CalculatorQuestionProtocolModel[];
  sum: number[] = [];
  concats: Array<string[]> = [];
  functions: Array<string> = [];
  finalValues: (string | number)[] = [];
}

export class CalculatorQuestionProtocolModel {
  key!: string;
  sequence!: number;
  question!: string;
  abbreviation?: string;
  answers!: CalculatorAnserQuestionProtocolModel[];
}

export class CalculatorAnserQuestionProtocolModel {
  key!: string;
  answerType!: AnswerTypeProtocolModel;
  answerValueType!: AnswerValueTypeEnum;
  answer!: string | number;
}
