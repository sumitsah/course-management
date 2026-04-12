import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { catchError, filter, switchMap, take, tap, throwError } from 'rxjs';
import { AuthActions } from '../../store/auth/auth.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // securetoken.googleapis.com
  // ✅ SKIP refresh API calls
  if (req.url.includes('securetoken.googleapis.com')) { // adjust this condition
    return next(req);
  }
  const authService = inject(AuthService);
  const store = inject(Store<AppState>);

  const token = localStorage.getItem('token') || ''
  const refreshToken = localStorage.getItem('refreshToken') || '';
  const expiresAt = Number(localStorage.getItem('expiresAt'));

  // 🔥 CHECK 1 minute BEFORE REQUEST
  if (expiresAt && Date.now() > (expiresAt - 60000)) {
    // Token about to expire → refresh BEFORE request
    console.log('inside before expires')
    return handlePreRefresh(req, next, authService, store, refreshToken);
  }

  const modifiedReq = req.clone({
    params: req.params.set('auth', token ?? '')
  })

  return next(modifiedReq).pipe(
    catchError(err => {
      console.log('Auth Interceptor : ', err)
      if (err.status === 401) {
        console.log('authInterceptor : ', err)
        return handle401Error(modifiedReq, next, authService, store, refreshToken);
      }

      return throwError(() => err);
    }))
};

function handle401Error(req: HttpRequest<unknown>, next: HttpHandlerFn, authService: AuthService, store: Store<AppState>, refreshToken: string) {
  if (!authService.isRefreshing) {
    console.log('Inside handle401Error : ')
    authService.isRefreshing = true;
    authService.refreshSubject.next(null);

    return authService.doRefreshTokenInExchangeIdToken(refreshToken).pipe(
      switchMap((res: any) => {
        authService.isRefreshing = false;
        const newToken = res.id_token;

        localStorage.setItem('token', newToken);
        localStorage.setItem('refreshToken', res.refresh_token);
        localStorage.setItem('expiresIn', res.expires_in);

        const expiresAt = new Date().getTime() + +res.expires_in * 1000;
        localStorage.setItem('expiresAt', expiresAt.toString())

        store.dispatch(AuthActions.refreshTokenSuccess({
          token: newToken,
          refreshToken: res.refresh_token,
          expiresIn: res.expires_in
        }));

        return next(
          req.clone({
            params: req.params.set('auth', newToken)
            // headers: req.headers.set('Authorization', `Bearer ${newToken}`)
          })
        );
      }),
      catchError(err => {
        authService.isRefreshing = false;
        // authService.doLogout();
        store.dispatch(AuthActions.logout());
        return throwError(() => err);
      })
    );
  }

  // 🔥 Queue requests while refreshing
  return authService.refreshSubject.pipe(
    filter(token => token != null),
    take(1),
    switchMap(token => {
      return next(
        req.clone({
          // headers: req.headers.set('Authorization', `Bearer ${token}`)
          params: req.params.set('auth', token)
        })
      );
    })
  );
}

function handlePreRefresh(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService,
  store: Store<AppState>,
  refreshToken: string
) {
  console.log('🔥 Pre-refresh START');
  return authService.doRefreshTokenInExchangeIdToken(refreshToken).pipe(
    tap(() => console.log('✅ Refresh API called')),
    switchMap((res: any) => {
      console.log('✅ Refresh SUCCESS', res);

      const newToken = res.id_token;

      const expiresAt = new Date().getTime() + +res.expires_in * 1000;

      localStorage.setItem('token', newToken);
      localStorage.setItem('refreshToken', res.refresh_token);
      localStorage.setItem('expiresAt', expiresAt.toString());

      store.dispatch(AuthActions.refreshTokenSuccess({
        token: newToken,
        refreshToken: res.refresh_token,
        expiresIn: res.expires_in
      }));

      console.log('➡️ Retrying original request');

      return next(
        req.clone({
          params: req.params.set('auth', newToken)
        })
      );
    }),

    catchError(err => {
      console.log('❌ Refresh FAILED', err);
      store.dispatch(AuthActions.logout());
      return throwError(() => err);
    })
  );
}

// https://securetoken.googleapis.com[API_KEY]
/* {
  "grant_type": "refresh_token",
  "refresh_token": "[YOUR_REFRESH_TOKEN]"
} */

/* Next level learning

Build multiple interceptors (auth + error + logging)
Control execution order
Retry failed requests automatically
Centralize API error handling 


How to analyze bundle size (Angular build stats)
Lazy loading impact on tree shaking
How RxJS operators affect bundle size
Real optimization techniques used in production*/

/* 
Select data from store
  return store.select(selectToken).pipe(
    take(1),
    switchMap(token => {
      const modifiedReq = req.clone({
        params: req.params.set('auth', token ?? '')
      })

      return next(modifiedReq).pipe(
        catchError(err => {
          console.log('Auth Interceptor : ', err)
          if (err.status === 401) {
            console.log('authInterceptor : ', err)
            return handle401Error(modifiedReq, next, authService, store);
          }

          return throwError(() => err);
        })
      )
    })
  )
*/

/* 
 return authService.user$.pipe(
    take(1),
    switchMap((user: User | null) => {
      if (!user?.token) {
        return next(req);
      }

      const modifiedReq = req.clone({
        params: req.params.set('auth', user.token) // firebase style
        // headers: req.headers.set('Authorization', 'Bearer token')
      })

      return next(modifiedReq).pipe(
        catchError(err => {
          console.log('Auth Interceptor : ', err)
          if (err.status === 401) {
            console.log('authInterceptor : ', err)
            return handle401Error(modifiedReq, next, authService);
          }

          return throwError(() => err);
        })
      );
    })
  )
 */

/* Refresh Token API response
{
  "access_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjM3MzAwNzY5YTA3ZTA1MTE2ZjdlNTEzOGZhOTA5MzY4NWVlYmMyNDAiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vYW5ndWxhcmh0dHBjbGllbnQtOTFmNWYiLCJhdWQiOiJhbmd1bGFyaHR0cGNsaWVudC05MWY1ZiIsImF1dGhfdGltZSI6MTc3NDYzNDE0NCwidXNlcl9pZCI6Ik9xNE1BRm90d1loNmJzUG5jRjFGZmxqSkcwNzIiLCJzdWIiOiJPcTRNQUZvdHdZaDZic1BuY0YxRmZsakpHMDcyIiwiaWF0IjoxNzc0NjQyNzgxLCJleHAiOjE3NzQ2NDYzODEsImVtYWlsIjoic3VtaXRAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbInN1bWl0QGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.ePCAtw5QWZ698D9yUQCReyJPPKI8_PTihjQyRDnQjNzSU9UEpmonjI61YqGmvvZv3tOhIOlgoPAQommH9X6Uf7rYbF8PEjvFK6J76Eg3rEbXx9CUt0ULrFihry9wCVkM278lUZBdn1WRcYyb66Y0ANf_H71mYWGGAo-HZaj1mOFXMjPloz5vk0euH3KLW3yWlZKgOv74y3QpgPOlD0JJqqrePacwyBmRDM0mIkA4Y_RZReSQkF-g33AV1nmwPjIZO3J_MHnyGiFZqWubAYeK5ZkXCUEQ5jsj4cAdBPjMlrtJLzCZsn2NECiK6Ou1oJIfUZ2u9IqYyKGhXGWBrE4D7w",
  "expires_in": "3600",
  "token_type": "Bearer",
  "refresh_token": "AMf-vBwo4wTqFNFyS7pizx4dInfhETHDRt69sjghJdUbgRF4lqhkoE2ONnH4PDBLKCwcrugno2-XoVBKVYtceTdqD0JwrkHOo_Whb_1jNwPRrGBx4CIYcllzSONAsZIl2BDtCFPCOve0HZTMvUbkSJ94HGGjL0yfuBgY3Uxq-2m9kGddf9TiDmK-Nujevjdss_wogVuO5wBz9RvkxfSvRq8tMAWZlyO9H1grx0Ac-g9iiKab6QsTyMc",
  "id_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjM3MzAwNzY5YTA3ZTA1MTE2ZjdlNTEzOGZhOTA5MzY4NWVlYmMyNDAiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vYW5ndWxhcmh0dHBjbGllbnQtOTFmNWYiLCJhdWQiOiJhbmd1bGFyaHR0cGNsaWVudC05MWY1ZiIsImF1dGhfdGltZSI6MTc3NDYzNDE0NCwidXNlcl9pZCI6Ik9xNE1BRm90d1loNmJzUG5jRjFGZmxqSkcwNzIiLCJzdWIiOiJPcTRNQUZvdHdZaDZic1BuY0YxRmZsakpHMDcyIiwiaWF0IjoxNzc0NjQyNzgxLCJleHAiOjE3NzQ2NDYzODEsImVtYWlsIjoic3VtaXRAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbInN1bWl0QGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.ePCAtw5QWZ698D9yUQCReyJPPKI8_PTihjQyRDnQjNzSU9UEpmonjI61YqGmvvZv3tOhIOlgoPAQommH9X6Uf7rYbF8PEjvFK6J76Eg3rEbXx9CUt0ULrFihry9wCVkM278lUZBdn1WRcYyb66Y0ANf_H71mYWGGAo-HZaj1mOFXMjPloz5vk0euH3KLW3yWlZKgOv74y3QpgPOlD0JJqqrePacwyBmRDM0mIkA4Y_RZReSQkF-g33AV1nmwPjIZO3J_MHnyGiFZqWubAYeK5ZkXCUEQ5jsj4cAdBPjMlrtJLzCZsn2NECiK6Ou1oJIfUZ2u9IqYyKGhXGWBrE4D7w",
  "user_id": "Oq4MAFotwYh6bsPncF1FfljJG072",
  "project_id": "640332824204"
} 
 */