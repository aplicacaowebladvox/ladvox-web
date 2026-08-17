import { catchError, Observable, throwError } from 'rxjs';
import { AlertService } from '../services/alert.provided.service';

export function alertApiError<T>(): (source: Observable<T>) => Observable<T> {
  return (source) =>
    source.pipe(
      catchError((err) => {
        let alertService = new AlertService();
        // if (err.errorType === ErrorTypeEnum.INFO) {
        //   alertService.showInfo({
        //     message: err.message,
        //     title: 'Warning',
        //   });
        //   return throwError(() => err);
        // }

        let message = err.message;
        if (err.error && !!JSON.parse(err.error) && JSON.parse(err.error).detail) {
          message = JSON.parse(err.error).detail;
        }
        alertService.showError({
          message: message,
          title: 'Erro',
        });
        console.error(err);

        return throwError(() => err);
      })
    );
}
