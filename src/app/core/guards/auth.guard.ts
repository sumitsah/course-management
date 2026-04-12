import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { map, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import { isLoggedIn } from '../../store/auth/auth.selectors';
import { AuthActions } from '../../store/auth/auth.actions';

export const authGuard: CanMatchFn = (route, segments) => {
  const store = inject(Store<AppState>);
  const router = inject(Router);
  const attemptedUrl = '/' + segments.map(s => s.path).join('/');

  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    store.dispatch(AuthActions.logout())
    // return  throwError(() => new Error('No refresh token'));
  }

  return store.select(isLoggedIn).pipe(
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
  const router = inject(Router);
  const store = inject(Store<AppState>);

  return store.select(isLoggedIn).pipe(
    take(1),
    map(isAuthenticated => !isAuthenticated ? true : router.createUrlTree(['/home']))
  )
}
