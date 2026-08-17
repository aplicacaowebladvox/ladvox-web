import moment from 'moment';
import { ConvertUtils } from './convert.utils';

export function stringToDate(value: string | null, dateTime: boolean = false): Date | null {
  if (!value) return null;
  value = value.replace(/[^\d]+/g, '');
  let year = value.substring(0, 4);
  let month = value.substring(4, 6);
  let day = value.substring(6, 8);
  if (dateTime) {
    let hours = value.substring(8, 10);
    let minutes = value.substring(10, 12);
    let seconds = value.substring(12, 14);
    let ms = value.substring(14);
    return new Date(
      Number.parseInt(year),
      Number.parseInt(month) - 1,
      Number.parseInt(day),
      Number.parseInt(hours),
      Number.parseInt(minutes),
      Number.parseInt(seconds),
      Number.parseInt(ms)
    );
  }
  return new Date(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day));
}

export function dateToString(
  value: Date | null | undefined,
  dateTime: boolean = true,
  locale: string = 'pt-BR',
  options?: any
): string | null {
  if (value == null || value == undefined) return null;
  value = new Date(value);
  if (dateTime)
    return (
      value.toLocaleDateString(locale, options) + ' ' + value.toLocaleTimeString(locale, options)
    );
  return value.toLocaleDateString(locale, options);
}

export function dateToFormatedString(value: Date | null | undefined): string | null {
  if (!value || value == null || value == undefined) return null;
  const valueHour = ConvertUtils.dateToString(value, true)?.substring(11);
  const ONE_DAY = 86400000;
  const TODAY = ConvertUtils.dateTimeToDate(new Date())!.getTime();
  const YESTARDAY = TODAY - ONE_DAY;
  const BEFORE_YESTARDAY = YESTARDAY - ONE_DAY;

  let onlyDate = ConvertUtils.dateTimeToDate(value);
  if (!onlyDate) return '';
  const REQUEST_DATE = onlyDate.getTime();
  if (REQUEST_DATE == TODAY) return `Hoje às ${valueHour}`;
  else if (REQUEST_DATE == YESTARDAY) return `Ontem às ${valueHour}`;
  else if (REQUEST_DATE == BEFORE_YESTARDAY) return `Anteontem às ${valueHour}`;
  else if (REQUEST_DATE >= TODAY - 7 * ONE_DAY) {
    let weekday = value.toDateString().substring(0, 3);
    switch (weekday) {
      case 'Sun':
        weekday = 'Domingo';
        break;
      case 'Mon':
        weekday = 'Segunda-feira';
        break;
      case 'Tue':
        weekday = 'Terça-feira';
        break;
      case 'Wed':
        weekday = 'Quarta-feira';
        break;
      case 'Thu':
        weekday = 'Quinta-feira';
        break;
      case 'Fri':
        weekday = 'Sexta-feira';
        break;
      case 'Sat':
        weekday = 'Sábado';
        break;
      default:
        weekday = ConvertUtils.dateToString(value, false)!;
    }
    return `${weekday} às ${valueHour}`;
  }
  return ConvertUtils.dateToString(value);
}

export function dateToDate(value: Date | null | undefined): Date | null {
  if (value == null || value == undefined) return null;
  return new Date(value);
}

export function dateParserSend(key: any, value: any) {
  if (typeof value === 'string') {
    let a =
      /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|([\+|-])([\d|:]*))?$/.exec(
        value
      );
    if (a) {
      return moment(value).format('YYYY-MM-DDTHH:mm:ss');
    }
  }
  return value;
}
export function dateParser(key: any, value: any) {
  if (typeof value === 'string') {
    let a =
      /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|([\+|-])([\d|:]*))?$/.exec(
        value
      );
    if (a) {
      return new Date(value);
    }
    a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})?$/.exec(value);
    if (a) {
      return new Date(value);
    }
    a = /^\/Date\((d|-|.*)\)[\/|\\]$/.exec(value);
    if (a) {
      let b = a[1].split(/[-+,.]/);
      return new Date(b[0] ? +b[0] : 0 - +b[1]);
    }
    a = /^(\d{1,4})-(\d{1,2})-(\d{1,2})$/.exec(value);
    if (a) {
      const sa = value.split('-');
      return new Date(parseInt(sa[0], 10), parseInt(sa[1], 10) - 1, parseInt(sa[2], 10));
    }
  }
  return value;
}
