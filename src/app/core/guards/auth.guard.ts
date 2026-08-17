import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateChildFn,
  CanActivateFn,
  CanMatchFn,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../modules/authentication/services/auth.service';

export const authGuardCanActivateFn: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
  const authService = inject(AuthService);
  if (!authService.isAuthenticated()) {
    inject(Router).navigate(['auth']);
  }
  return true;
};

export const authGuardCanActivateChildFn: CanActivateChildFn = (
  childRoute: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> => {
  const authService = inject(AuthService);
  if (!authService.isAuthenticated()) {
    inject(Router).navigate(['auth']);
  }
  return true;
};

export const authGuardCanMatchFn: CanMatchFn = (
  route: Route,
  segments: UrlSegment[]
): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> => {
  const authService = inject(AuthService);
  if (!authService.isAuthenticated()) {
    inject(Router).navigate(['auth']);
  }
  return true;
};
