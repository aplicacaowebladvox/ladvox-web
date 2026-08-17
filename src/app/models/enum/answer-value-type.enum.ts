export class AnswerValueTypeEnum {
  private _id: number | string;
  private _name: string;
  private _displayName: string;

  static NUMERIC = new AnswerValueTypeEnum('NUMERIC', 'NUMERIC', 'Numérico');
  static TEXT = new AnswerValueTypeEnum('TEXT', 'TEXT', 'Textual');

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

  static getAll(): Array<AnswerValueTypeEnum> {
    return [AnswerValueTypeEnum.NUMERIC, AnswerValueTypeEnum.TEXT];
  }

  static parse(
    _someInput: string | number | AnswerValueTypeEnum | undefined | null
  ): AnswerValueTypeEnum | undefined {
    if (!_someInput) return undefined;
    if (typeof _someInput == 'object') return <AnswerValueTypeEnum>_someInput;
    return AnswerValueTypeEnum.getAll().find(
      (enumValue) =>
        enumValue.id.toString() == _someInput.toString() ||
        enumValue.name == _someInput.toString() ||
        enumValue.displayName == _someInput.toString()
    );
  }
}
