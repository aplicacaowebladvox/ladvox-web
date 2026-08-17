export class PresentationAnswerTypeProtocolEnum {
  private _id: number | string;
  private _name: string;
  private _displayName: string;

  static PERCENTAGE = new PresentationAnswerTypeProtocolEnum(
    'PERCENTAGE',
    'PERCENTAGE',
    'Porcentagem'
  );
  static ABSOLUTE_VALUE = new PresentationAnswerTypeProtocolEnum(
    'ABSOLUTE_VALUE',
    'ABSOLUTE_VALUE',
    'Valor absoluto'
  );
  static CONCATENATION = new PresentationAnswerTypeProtocolEnum(
    'CONCATENATION',
    'CONCATENATION',
    'Concatenação'
  );
  static AVERAGE_PERCENTAGE = new PresentationAnswerTypeProtocolEnum(
    'AVERAGE_PERCENTAGE',
    'AVERAGE_PERCENTAGE',
    'Média (Porcentagem)'
  );
  static AVARAGE_ABSOLUTE_VALUE = new PresentationAnswerTypeProtocolEnum(
    'AVARAGE_ABSOLUTE_VALUE',
    'AVARAGE_ABSOLUTE_VALUE',
    'Média (Valor absoluto)'
  );

  private constructor(__id: number | string, __name: string, __displayName: string) {
    this._id = __id;
    this._name = __name;
    this._displayName = __displayName;
  }

  get id(): number | string {
    return this._id;
  }

  get name(): number | string {
    return this._name;
  }

  get displayName(): string {
    return this._displayName;
  }

  static getAll(): Array<PresentationAnswerTypeProtocolEnum> {
    return [
      PresentationAnswerTypeProtocolEnum.PERCENTAGE,
      PresentationAnswerTypeProtocolEnum.ABSOLUTE_VALUE,
      PresentationAnswerTypeProtocolEnum.CONCATENATION,
      PresentationAnswerTypeProtocolEnum.AVERAGE_PERCENTAGE,
      PresentationAnswerTypeProtocolEnum.AVARAGE_ABSOLUTE_VALUE,
    ];
  }

  static parse(
    _someInput: string | number | undefined | null
  ): PresentationAnswerTypeProtocolEnum | undefined {
    if (!_someInput) return undefined;
    return PresentationAnswerTypeProtocolEnum.getAll().find(
      (enumValue) =>
        enumValue.id.toString() == _someInput.toString() ||
        enumValue.name == _someInput.toString() ||
        enumValue.displayName == _someInput.toString()
    );
  }
}
