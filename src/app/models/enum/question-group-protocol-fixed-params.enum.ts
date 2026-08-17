import { ConvertUtils } from '../../modules/shared/utils/convert.utils';
import { QuestionGroupProtocolModel } from '../question-group-protocol.model';

export class QuestionGroupProtocolFixedParamsEnum {
  private _id!: string | number;
  private _name!: string;

  get id(): number | string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  constructor(__id: string | number, __name: string) {
    this._id = __id;
    this._name = __name;
  }

  static GROUP_SUM = new QuestionGroupProtocolFixedParamsEnum('#groupSum', '#Soma das respostas');
  static GROUP_QUESTIONS_LENGTH = new QuestionGroupProtocolFixedParamsEnum(
    '#groupQuestionsLength',
    '#Quantidade de perguntas no grupo'
  );
  static GROUP_MAX_SUM = new QuestionGroupProtocolFixedParamsEnum(
    '#groupMaxSum',
    '#Maior soma das respostas'
  );

  static GROUP_RESULT = new QuestionGroupProtocolFixedParamsEnum(
    '#groupResult',
    '#Resultado do grupo'
  );

  static getAll(): Array<QuestionGroupProtocolFixedParamsEnum> {
    return [
      QuestionGroupProtocolFixedParamsEnum.GROUP_SUM,
      QuestionGroupProtocolFixedParamsEnum.GROUP_QUESTIONS_LENGTH,
      QuestionGroupProtocolFixedParamsEnum.GROUP_MAX_SUM,
    ];
  }

  static mountQuestionGroupProtocolFixedParamsOption(
    questionGroupProtocolModel: QuestionGroupProtocolModel
  ): QuestionGroupProtocolFixedParamsOption[] {
    return QuestionGroupProtocolFixedParamsEnum.getAll().map(
      (questionGroupProtocolFixedParamsEnum) => {
        let questionGroupProtocolFixedParamsOption = {} as QuestionGroupProtocolFixedParamsOption;
        questionGroupProtocolFixedParamsOption.questionGroupProtocolFixedParamsEnum =
          questionGroupProtocolFixedParamsEnum;
        questionGroupProtocolFixedParamsOption.questionGroupProtocolModel =
          questionGroupProtocolModel;
        questionGroupProtocolFixedParamsOption.key = `@${ConvertUtils.uuidV7WithoutOpperators(questionGroupProtocolModel.key!)}${questionGroupProtocolFixedParamsEnum.id}`;
        questionGroupProtocolFixedParamsOption.presentation = `@${ConvertUtils.uuidV7WithoutOpperators(questionGroupProtocolModel.name || questionGroupProtocolModel.key!)}${questionGroupProtocolFixedParamsEnum.name}`;
        return questionGroupProtocolFixedParamsOption;
      }
    );
  }
  static mountGroupResultOption(
    questionGroupProtocolModel: QuestionGroupProtocolModel
  ): QuestionGroupProtocolFixedParamsOption {
    return {
      questionGroupProtocolFixedParamsEnum: QuestionGroupProtocolFixedParamsEnum.GROUP_RESULT,
      questionGroupProtocolModel: questionGroupProtocolModel,
      key: `@${ConvertUtils.uuidV7WithoutOpperators(questionGroupProtocolModel.key!)}${QuestionGroupProtocolFixedParamsEnum.GROUP_RESULT.id}`,
      presentation: `@${ConvertUtils.uuidV7WithoutOpperators(questionGroupProtocolModel.name || questionGroupProtocolModel.key!)}${QuestionGroupProtocolFixedParamsEnum.GROUP_RESULT.name}`,
    };
  }
  static getPresentation(element: string, groupKeyToName: any): string {
    if (element.startsWith('@')) {
      let ret =
        QuestionGroupProtocolFixedParamsEnum.getAll().find((a) =>
          (<string>a._id).endsWith(element.split('#')[1])
        )?.name || element.split('#')[1];
      return (groupKeyToName[element.split('#')[0]] || '') + ret;
    }
    return element;
  }
}

export interface QuestionGroupProtocolFixedParamsOption {
  questionGroupProtocolFixedParamsEnum: QuestionGroupProtocolFixedParamsEnum;
  questionGroupProtocolModel: QuestionGroupProtocolModel;
  key: string;
  presentation: string;
}
