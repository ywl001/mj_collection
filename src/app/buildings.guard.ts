import { CanActivateFn } from '@angular/router';

export const buildingsGuard: CanActivateFn = (route, state) => {
  return true;
};
