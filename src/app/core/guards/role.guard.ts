import { Location } from '@angular/common';
import { inject } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivateChildFn,
  CanActivateFn,
  CanMatchFn,
  Data,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../modules/authentication/services/auth.service';
import { AlertService } from '../services/alert.provided.service';
import { alertApiError } from '../operators/api-alert-error.operator';

export const roleGuardCanActivateFn: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
  return _checkRole(route.data);
};
export const roleGuardCanActivateChildFn: CanActivateChildFn = (
  childRoute: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> => {
  return _checkRole(childRoute.data);
};
export const roleGuardCanMatchFn: CanMatchFn = (
  route: Route,
  segments: UrlSegment[]
): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> => {
  return _checkRole(route.data);
};

function _checkRole(routeData?: Data): boolean {
  const authService = inject(AuthService);
  const alertService = inject(AlertService);
  let hasRole: boolean = !routeData?.['role'] && !routeData?.['roles'];
  let hasPermission: boolean = !routeData?.['permission'] && !routeData?.['permissions'];
  if (routeData?.['roles']) hasRole = authService.hasRoles(routeData?.['roles']);
  if (routeData?.['role']) hasRole = authService.hasRole(routeData?.['role']);
  if (routeData?.['permissions'])
    hasPermission = authService.hasPermissions(routeData?.['permissions']);
  if (routeData?.['permission'])
    hasPermission = authService.hasPermission(routeData?.['permission']);
  if (!hasRole || !hasPermission) {
    authService.checkToken().subscribe({
      next: (isLoggedIn) => {
        if (isLoggedIn) _alertAndGoPrevious();
        else {
          alertService.showError({ message: 'Usuário não logado' });
          console.log('User not logged-in to check your role');
        }
      },
      error: () => {
        authService.logout();
      },
    });
  }
  return hasRole && hasPermission;
}

function _alertAndGoPrevious() {
  const alertService = inject(AlertService);
  const location = inject(Location);
  alertService.showWarning({
    message: 'Este recurso solicitou uma permissão que não foi encontrada no seu acesso.',
    title: 'Acesso restrito',
    callbackFn: () => location.back(),
  });
}
