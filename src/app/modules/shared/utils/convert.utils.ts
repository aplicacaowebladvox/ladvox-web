import { dateToFormatedString, dateToString, stringToDate } from './date.util';
import { onlyNumbers, trim } from './string.util';
import { AddressModel } from '../../../models/address.model';
import { Observable } from 'rxjs';

export abstract class ConvertUtils {
  static onlyNumbers = onlyNumbers;
  static dateToFormControl(
    value: Date | undefined | null,
    dateTime: boolean = false
  ): string | null {
    if (value === null || value === undefined) return null;
    let dateISOString = this.dateToDate(value)!.toISOString();
    if (dateTime) {
      return dateISOString.replace('T', ' ').replace('Z', '');
    }
    return dateISOString.slice(0, 10);
  }
  static stringToDate = stringToDate;
  static dateToString = dateToString;
  static dateToFormatedString = dateToFormatedString;
  static dateToDate(value: Date): Date | null {
    if (!value) return null;
    return new Date(value.getTime());
  }
  static dateTimeToDate(value: Date): Date | null {
    if (!value) return null;
    let _value = new Date(value.getTime());
    _value.setHours(0);
    _value.setMinutes(0);
    _value.setSeconds(0);
    _value.setMilliseconds(0);
    return _value;
  }
  static stringToNumber = (value: string | null | number): number | null => {
    if (!value || value == null) return null;
    if (typeof value == 'number') return <number>value;
    value = trim(value);

    value = onlyNumbers(value.replace(/[^\d]+/g, ''));
    return Number.parseInt(value);
  };

  static uuidV7WithoutOpperators = (value: string): string => {
    let onlyString = value || '';
    const opperators = ['+', '-', '*', '/', '%', '^', '(', '{', '[', ')', '}', ']'];
    opperators.forEach((opperator) => {
      onlyString = onlyString.replaceAll(opperator, '');
    });
    return onlyString;
  };

  static getAsString(value: any): string {
    if (value == null || value == undefined) return '';
    if (typeof value == 'string') return value;
    if (typeof value == 'number') return (<number>value).toString();
    if (typeof value == 'boolean') return <boolean>value ? '1' : '0';
    return JSON.stringify(value);
  }

  static age(startDate: Date, endDate: Date = new Date()): string {
    if (!startDate) return '0';
    const MIL_TO_YEA = 31540000000;
    const MIL_TO_DAY = 86400000;
    const MIL_TO_MON = 2592000000;
    let milissecondsBetween: number = endDate.getTime() - startDate.getTime();

    let years = Number.parseInt((milissecondsBetween / MIL_TO_YEA).toString());
    let months = Number.parseInt(
      ((milissecondsBetween - years * MIL_TO_YEA) / MIL_TO_MON).toString()
    );
    let days = Number.parseInt(
      ((milissecondsBetween - years * MIL_TO_YEA - months * MIL_TO_MON) / MIL_TO_DAY).toString()
    );

    return (
      (years > 0 ? years + 'a' : '') +
      ' ' +
      (months > 0 ? months + 'm' : '') +
      ' ' +
      (days > 0 ? days + 'd' : '')
    ).replace('  ', ' ');
  }

  static addressToString(address: AddressModel): string {
    if (!address) return '';

    return `${address.street || 'Rua NA'}, ${!address.number ? 'SN' : address.number} - ${address.neighborhood || 'Bairro NA'}, ${address.city || 'Cidade NA'} - ${address.state || 'Estado NA'}/${address.country || 'País NA'}, ${(address.zipCode ? this.formatZipCode(address.zipCode) : undefined) || 'CEP NA'}`;
  }

  static rangeDatesForForm(starts?: Date, ends?: Date): Date[] {
    let rangeArray: Date[] = [];
    if (!!starts && !!ends) {
      rangeArray.push(starts, ends);
    } else if (!!starts && !ends) {
      rangeArray.push(starts);
    } else if (!starts && !!ends) {
      rangeArray.push(ends, ends);
    }

    return rangeArray;
  }
  static formatZipCode(zipCode: string): string {
    if (zipCode.length == 8) {
      return zipCode.replace(/(\d{2})(\d{3})(\d{3})/, '$1.$2-$3');
    } else {
      return zipCode;
    }
  }
  static formatPhoneNumber(phone: string): string {
    if (phone.length == 8) {
      return phone.replace(/(\d{4})(\d{4})/, '$1-$2');
    } else if (phone.length == 9) {
      return phone.replace(/(\d{5})(\d{4})/, '$1-$2');
    } else if (phone.length == 10) {
      return phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else if (phone.length == 11) {
      return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (phone.length == 12) {
      return phone.replace(new RegExp('(d{2})(d{2})(d{4})(d{4})'), '+$1 ($2) $3-$4');
    } else if (phone.length > 12) {
      return phone.replace(
        new RegExp('(d{' + (phone.length - 11) + '})(d{2})(d{5})(d{4})'),
        '+$1 ($2) $3-$4'
      );
    } else {
      return phone;
    }
  }
  static generateArrayFunction(rFunciuon?: string): string[] {
    if (rFunciuon == undefined || rFunciuon == null) return [];
    const resultArray = [];
    const opp = ['+', '-', '*', '/', '%', '^', '(', '{', '[', ')', '}', ']'];
    let el = '';
    for (let v of rFunciuon.trim().split('')) {
      if (opp.includes(v)) {
        if (el.length > 0) {
          resultArray.push(el);
        }
        resultArray.push(v);
        el = '';
      } else {
        el += v;
      }
    }
    if (el.length > 0) resultArray.push(el);
    return resultArray;
  }
  static toBase64(file: File): Observable<string> {
    if (!!file && file instanceof Blob) {
      return new Observable<string>((o) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
          o.next(<string>reader.result);
          o.complete();
        };
      });
    } else {
      return new Observable<any>((o) => {
        o.error(`Arquivo inválido: "${file}"`);
        o.complete();
      });
    }
  }
  static generateGreetings(userName?: string, date: Date = new Date()): string {
    let _greetings = 'Bom dia';
    if (date.getHours() >= 18) {
      _greetings = `Boa noite`;
    } else if (date.getHours() >= 12) {
      _greetings = `Boa tarde`;
    } else if (date.getHours() >= 6) {
      _greetings = `Bom dia`;
    }
    return `${_greetings}${userName ? ', ' + userName : ''}!`;
  }
  static generateInitials(name?: string): string {
    if (!name) return 'U';
    let initials = name
      .split(' ')
      .map((p) => (!!p && p.length > 0 ? p[0] : undefined))
      .filter((p) => p != undefined);
    return initials.length > 1
      ? (initials[0] || '') + (initials[initials.length - 1] || '')
      : initials[0] || '';
  }
}
