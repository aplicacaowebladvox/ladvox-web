import { AbstractControl } from '@angular/forms';
import cpfValidator from './cpf.validator';
import passwordValidator from './password.validator';

export abstract class CustomValidators {
  static cpf = cpfValidator;
  static password = passwordValidator;
  static phone = (control: AbstractControl) => {
    const regex = /^(\(?\d{2}\)?\s?)?\d{4,5}-?\d{4}$/;
    const value = control.value;
    if (value && value !== '') {
      return regex.test(value) ? null : { phone: true };
    }
    return null;
  };
  static mail = function (control: AbstractControl) {
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}/;
    const value = control.value;
    if (value && value !== '') {
      return regex.test(value) ? null : { mail: true };
    }
    return null;
  };
  static colorHex = (control: AbstractControl) => {
    const regex = /^#([a-fA-F0-9]{3}|[a-fA-F0-9]{6})$/;
    const value = control.value;
    if (value && value !== '') {
      return regex.test(value) ? null : { colorHex: true };
    }
    return null;
  };
}
