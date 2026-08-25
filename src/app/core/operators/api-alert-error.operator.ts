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

        const getAsObjectOrNull = (v: any) => {
          if (!v) return null;
          if ('object' === typeof v) {
            return v;
          }
          if ('string' === typeof v) {
            try {
              return JSON.parse(v);
            } catch {
              return null;
            }
          }
          return null;
        }

        let message = getAsObjectOrNull(err.error)?.detail || err.message;
        alertService.showError({
          message: message,
          title: 'Erro',
        });
        console.error(err);

        return throwError(() => err);
      })
    );
}
