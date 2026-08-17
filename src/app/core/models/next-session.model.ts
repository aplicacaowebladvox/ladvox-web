import { WeekdayEnum } from '../../models/enum/weekday.enum';

export class NextSessionModel {
  daysSessions!: DaySessionModel[];
}

export class DaySessionModel {
  weekday!: string;
  sessions!: SessionModel[];

  get weekdayEnum(): WeekdayEnum | undefined {
    return WeekdayEnum.parse(<string>this.weekday);
  }
}

export class SessionModel {
  patientName!: string;
  sessionHour!: string;
  sessionRoom!: string;
  therapistsTeamDescription!: string;
}
