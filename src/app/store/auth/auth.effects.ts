import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthActions } from "./auth.actions";
import { catchError, map, of, switchMap, tap } from "rxjs";
import { AuthService } from "../../core/services/auth.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastService } from "../../shared/ui/service/toast.service";

@Injectable()
export class AuthEffects {
    actions$ = inject(Actions)
    authService = inject(AuthService)
    router = inject(Router)
    toastService = inject(ToastService)
    activatedRouter = inject(ActivatedRoute);

    login$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.login),
            switchMap(credentials =>
                this.authService.doLogin(credentials).pipe(
                    map(res => {
                        localStorage.setItem('user', JSON.stringify({ id: res.localId, email: res.email }));
                        localStorage.setItem('token', res.idToken);
                        localStorage.setItem('refreshToken', res.refreshToken);
                        localStorage.setItem('expiresIn', res.expiresIn);

                        // const expiresAt = new Date().getTime() + +res.expiresIn * 1000;
                        const expiresAt = new Date().getTime() + 120 * 1000;
                        localStorage.setItem('expiresAt', expiresAt.toString());

                        return AuthActions.loginSuccess({
                            user: {
                                id: res.localId,
                                email: res.email
                            },
                            token: res.idToken,
                            refreshToken: res.refreshToken,
                            expiresIn: res.expiresIn
                        })
                    }),

                    catchError(error =>
                        of(AuthActions.loginFailure({ error: error.message }))
                    )
                )
            ),
        )
    )

    loginSuccess$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.loginSuccess),
            tap(() => {
                const returnUrl = this.activatedRouter.snapshot.queryParams['returnUrl'] || '/home';
                this.router.navigate([returnUrl]);
                this.toastService.show('Login successful!', 'success');
            }),
        ), { dispatch: false }
    )

    autoLogin$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.autoLogin),

            map(() => {
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                const token = localStorage.getItem('token') || ''
                const refreshToken = localStorage.getItem('refreshToken') || ''
                const expiresIn = localStorage.getItem('expiresIn') || ''
                if (!user && !token && !refreshToken && !expiresIn) {
                    return AuthActions.logout();
                }
                return AuthActions.autoLoginSuccess({ user: { email: user.email, id: user.id }, token, refreshToken, expiresIn })
            })
        )
    )

    logout$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.logout),
            tap(() => {
                this.authService.doLogout();
                this.router.navigate(['/login']);
            })
        ), { dispatch: false }
    )

} 