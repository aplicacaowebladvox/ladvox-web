import { AuthService } from './../../modules/authentication/services/auth.service';
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const accountGuardCanActivateFn: CanActivateFn = (route, state) => {
  if (inject(AuthService).isAuthenticated()) {
    inject(Router).navigate(['home']);
    return false;
  }
  return true;
};
