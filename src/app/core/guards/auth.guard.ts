import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { map, take } from 'rxjs';

export const authGuard: CanMatchFn = (route, segments) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const attemptedUrl = '/' + segments.map(s => s.path).join('/');
  return authService.isAuthenticated$.pipe(
    take(1), // VERY IMPORTANT (complete the stream)
    map(isAuthenticated => {
      if (isAuthenticated) {
        return true;
      }

      return router.createUrlTree(['/login'], {
        queryParams: { returnUrl: attemptedUrl }
      });
    })
  );
};

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated$.pipe(
    take(1),
    map(isAuthenticated => !isAuthenticated ? true : router.createUrlTree(['/home']))
  )
}
