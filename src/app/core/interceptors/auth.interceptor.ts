import { HttpContextToken, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService, CHECK_TOKEN_PATH } from '../../modules/authentication/services/auth.service';
import { switchMap } from 'rxjs';
import { USE_AUTH_CONTEXT } from '../services/request.provided.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authSvc = inject(AuthService);
  if (!req.url.includes(CHECK_TOKEN_PATH) && !req.context.get(USE_AUTH_CONTEXT)) {
    return next(req);
  }
  if (authSvc.isAuthenticated()) {
    const authRequest = addAuthorizationHeader(req);
    return next(authRequest);
  } else {
    return authSvc.refreshToken().pipe(
      switchMap(() => {
        const authRequest = addAuthorizationHeader(req);
        return next(authRequest);
      })
    );
  }
};
const addAuthorizationHeader = (req: HttpRequest<any>) => {
  const token = localStorage.getItem('token');
  return req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`),
  });
};
