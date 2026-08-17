import { Injectable } from '@angular/core';
import Swal, { SweetAlertCustomClass, SweetAlertOptions } from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  defaultOptions: SweetAlertOptions = {
    confirmButtonText: 'Close',
    confirmButtonColor: '#00875C',
  };
  defaultClasses: SweetAlertCustomClass = {
    htmlContainer: 'swal2-html-container--custom',
    confirmButton: 'swal2-confirm-button--custom',
  };
  showWarning({
    message,
    title,
    html,
    emptyTitle = false,
    timer,
    callbackFn,
  }: AlertServiceOptions) {
    let opt: SweetAlertOptions = {
      ...this.defaultOptions,
      customClass: {
        ...this.defaultClasses,
        title: 'swal2-title--warning',
        icon: 'swal2-icon',
      },
    };

    opt.width = 500;
    opt.iconHtml = '<img src="assets/icons/warning.svg" /> ';
    opt.timer = timer;
    opt.html = html;
    opt.timerProgressBar = !!timer;
    opt.text = message;
    opt.title = title || (emptyTitle ? '' : 'Alert');

    this.fireAlert(opt, { confirm: callbackFn, denied: callbackFn, dismissed: callbackFn });
  }
  showInfo({ message, title, emptyTitle = false, timer, callbackFn }: AlertServiceOptions): void {
    let opt: SweetAlertOptions = {
      ...this.defaultOptions,
      customClass: {
        ...this.defaultClasses,
        title: 'swal2-title--info',
        icon: 'swal2-icon',
      },
    };

    opt.width = 500;
    opt.iconHtml = '<img src="assets/icons/info.svg" /> ';
    opt.timer = timer;
    opt.timerProgressBar = !!timer;
    opt.text = message;
    opt.title = title || (emptyTitle ? '' : 'Informação');

    this.fireAlert(opt, { confirm: callbackFn, denied: callbackFn, dismissed: callbackFn });
  }
  showError({
    message,
    title,
    isHtml = false,
    emptyTitle = false,
    timer,
    html,
    callbackFn,
  }: AlertServiceOptions): void {
    let opt: SweetAlertOptions = {
      ...this.defaultOptions,
      customClass: {
        ...this.defaultClasses,
        title: 'swal2-title--error',
        icon: 'swal2-icon',
        htmlContainer: isHtml ? 'swal2-html-container--custom' : '',
      },
    };

    opt.width = 500;
    opt.iconHtml = '<img src="assets/icons/error.svg"/>';
    opt.timer = timer;
    opt.timerProgressBar = !!timer;
    opt.text = message;
    opt.html = html;
    opt.title = title || (emptyTitle ? '' : 'Erro');
    opt.confirmButtonText = 'Voltar';

    this.fireAlert(opt, { confirm: callbackFn, denied: callbackFn, dismissed: callbackFn });
  }
  showSuccess({
    message,
    isHtml = false,
    title,
    emptyTitle = false,
    timer,
    html,
    callbackFn,
  }: AlertServiceOptions): void {
    let opt: SweetAlertOptions = {
      ...this.defaultOptions,
      customClass: {
        ...this.defaultClasses,
        title: 'swal2-title--success',
        icon: 'swal2-icon',
        htmlContainer: isHtml ? 'swal2-html-container--custom' : '',
      },
    };

    opt.width = 500;
    opt.iconHtml = '<img src="assets/icons/success.svg"/>';
    opt.timer = timer;
    opt.timerProgressBar = !!timer;
    opt.text = message;
    opt.html = html;
    opt.title = title || (emptyTitle ? '' : 'Sucesso');
    opt.confirmButtonText = 'Confirmar';

    this.fireAlert(opt, { confirm: callbackFn, denied: callbackFn, dismissed: callbackFn });
  }
  showConfirm({
    message,
    title,
    emptyTitle = false,
    timer,
    isHtml = false,
    callbackConfirmFn,
    callbackCancelFn,
  }: AlertServiceOptions): void {
    let opt: SweetAlertOptions = {
      ...this.defaultOptions,

      customClass: {
        ...this.defaultClasses,
        title: 'swal2-title--confirm',
        icon: 'swal2-icon',
        htmlContainer: isHtml ? 'swal2-html-container--custom' : '',
      },
    };

    opt.width = 500;
    opt.iconHtml = '<img src="assets/icons/confirm.svg" /> ';
    opt.iconColor = '#00875c';
    opt.timer = timer;
    opt.timerProgressBar = !!timer;
    opt.text = message;
    opt.title = title || (emptyTitle ? '' : 'Confirmar');
    opt.showCancelButton = true;
    opt.cancelButtonText = 'Cancelar';
    opt.confirmButtonText = 'Confirmar';
    opt.reverseButtons = true;

    this.fireAlert(opt, {
      confirm: callbackConfirmFn,
      denied: callbackCancelFn,
      dismissed: callbackCancelFn,
    });
  }

  fireAlert(opt: SweetAlertOptions, callbackFunction?: CallbackFunctionsModel) {
    Swal.fire(opt).then((result) => {
      if (!callbackFunction) return;

      if (result.isConfirmed) {
        if (!!callbackFunction.returnedValue && !!callbackFunction.returnedValue.get(result.value))
          callbackFunction.returnedValue.get(result.value)();
        else if (!!callbackFunction.confirm) callbackFunction.confirm();
      } else if (result.isDenied) {
        if (!!callbackFunction.returnedValue && !!callbackFunction.returnedValue.get(result.value))
          callbackFunction.returnedValue.get(result.value)();
        else if (!!callbackFunction.denied) callbackFunction.denied();
      } else if (result.isDismissed) {
        switch (result.dismiss) {
          case Swal.DismissReason.cancel:
            this._getCallBackFunction(callbackFunction.dismissedCancel, callbackFunction.dismissed);
            break;
          case Swal.DismissReason.backdrop:
            this._getCallBackFunction(
              callbackFunction.dismissedBackdrop,
              callbackFunction.dismissed
            );
            break;
          case Swal.DismissReason.close:
            this._getCallBackFunction(callbackFunction.dismissedClose, callbackFunction.dismissed);
            break;
          case Swal.DismissReason.esc:
            this._getCallBackFunction(callbackFunction.dismissedEsc, callbackFunction.dismissed);
            break;
          case Swal.DismissReason.timer:
            this._getCallBackFunction(callbackFunction.dismissedTimer, callbackFunction.dismissed);
            break;
          default:
            this._getCallBackFunction(callbackFunction.dismissed);
        }
      }
    });
  }
  private _getCallBackFunction(...calls: any[]): any {
    if (!calls || calls.length <= 0) return;

    calls.forEach((call) => {
      if (!!call) return call();
    });
    return;
  }
}

export interface CallbackFunctionsModel {
  confirm?: any;
  denied?: any;
  returnedValue?: Map<any, any>;
  dismissed?: any;
  dismissedCancel?: any;
  dismissedBackdrop?: any;
  dismissedClose?: any;
  dismissedEsc?: any;
  dismissedTimer?: any;
}

export interface AlertServiceOptions {
  message: string;
  title?: string;
  timer?: number;
  emptyTitle?: boolean;
  isHtml?: boolean;
  html?: string;
  callbackFn?: () => void;
  callbackConfirmFn?: () => void;
  callbackCancelFn?: () => void;
}
