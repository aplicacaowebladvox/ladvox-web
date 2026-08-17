export class WeekdayEnum {
  static SUNDAY = new WeekdayEnum('SUNDAY', 'Domingo');
  static MONDAY = new WeekdayEnum('MONDAY', 'Segunda-feira');
  static TUESDAY = new WeekdayEnum('TUESDAY', 'Terça-feira');
  static WEDNESDAY = new WeekdayEnum('WEDNESDAY', 'Quarta-feira');
  static THURSDAY = new WeekdayEnum('THURSDAY', 'Quinta-feira');
  static FRIDAY = new WeekdayEnum('FRIDAY', 'Sexta-feira');
  static SATURDAY = new WeekdayEnum('SATURDAY', 'Sábado');

  private _name: string;
  private _displayName: string;
  constructor(__name: string, __displayName: string) {
    this._name = __name;
    this._displayName = __displayName;
  }

  get name(): string {
    return this._name;
  }

  get displayName(): string {
    return this._displayName;
  }

  static getAll(): Array<WeekdayEnum> {
    return [
      this.SUNDAY,
      this.MONDAY,
      this.TUESDAY,
      this.WEDNESDAY,
      this.THURSDAY,
      this.FRIDAY,
      this.SATURDAY,
    ];
  }

  static parse(_someInput: string | number | undefined | null): WeekdayEnum | undefined {
    if (!_someInput) return undefined;
    return WeekdayEnum.getAll().find(
      (enumValue, i) =>
        enumValue.name.toLowerCase() == _someInput.toString().toLowerCase() ||
        enumValue.displayName.toLowerCase() == _someInput.toString().toLowerCase() ||
        (typeof _someInput == 'number' && i == Number.parseInt(_someInput.toString()))
    );
  }

  static getDisplayName(weekdayModel: string | WeekdayEnum | undefined): string {
    let weekdayEnum =
      typeof weekdayModel == 'string' ? WeekdayEnum.parse(weekdayModel.toString()) : weekdayModel;
    if (!weekdayEnum) return 'Não definido';
    return weekdayEnum.displayName;
  }
}
