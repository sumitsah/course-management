import { inject, Injectable } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { BehaviorSubject, catchError, EMPTY, finalize, tap } from 'rxjs';
import { UserAuth } from '../../core/models/user';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../shared/ui/service/toast.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import { isLoggedIn, selectError, selectLoading, selectToken, selectUser } from '../../store/auth/auth.selectors';
import { AuthActions } from '../../store/auth/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthFacade {
  router = inject(Router);
  activatedRouter = inject(ActivatedRoute);
  authService = inject(AuthService);
  toastService = inject(ToastService);
  store = inject(Store<AppState>);

  // Selectors (streams for UI)
  user$ = this.store.select(selectUser);
  token$ = this.store.select(selectToken);
  loading$ = this.store.select(selectLoading);
  error$ = this.store.select(selectError);
  isLoggedIn$ = this.store.select(isLoggedIn);

  //Actions (commands)
  login(credentials: UserAuth) {
    this.store.dispatch(AuthActions.login(credentials));
  }

  constructor() { }

  // login(credentials: UserAuth) {
  //   this.loadingSubject.next(true);
  //   this.authService.doLogin(credentials).pipe(
  //     tap(() => {
  //       const returnUrl = this.activatedRouter.snapshot.queryParams['returnUrl'] || '/home';
  //       this.router.navigate([returnUrl]);
  //       this.toastService.show('Login successful!', 'success');
  //     }),
  //     finalize(() => this.loadingSubject.next(false))
  //   ).subscribe();
  // }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }

  autoLogin() {
    // this.authService.doAutoLogin();
    this.store.dispatch(AuthActions.autoLogin());
  }

}
