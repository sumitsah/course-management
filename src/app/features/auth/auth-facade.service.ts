import { inject, Injectable } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { BehaviorSubject, catchError, EMPTY, finalize, tap } from 'rxjs';
import { UserAuth } from '../../core/models/user';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AppError } from '../../core/models/error';
import { ToastService } from '../../shared/ui/service/toast.service';

@Injectable({
  providedIn: 'root'
})
export class AuthFacade {
  router = inject(Router);
  authService = inject(AuthService);
  toastService = inject(ToastService);

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  // private errorSubject = new BehaviorSubject<AppError | null>(null);
  // error$ = this.errorSubject.asObservable();

  isAuthenticated$ = this.authService.isAuthenticated$;
  user$ = this.authService.user$;

  constructor() { }

  login(credentials: UserAuth) {
    this.loadingSubject.next(true);
    this.authService.doLogin(credentials).pipe(
      tap(() => {
        this.router.navigate(['/home']);
        this.toastService.show('Login successful!', 'success');
      }),
      catchError((err) => {
        this.handleError(err);
        return EMPTY;
      }),
      finalize(() => this.loadingSubject.next(false))
    ).subscribe();
  }

  logout() {
    this.authService.doLogout();
    this.router.navigate(['/login']);
  }

  autoLogin() {
    this.authService.doAutoLogin();
  }

  handleError(err: HttpErrorResponse) {
    let error: AppError = {
      message: 'An unknown error occurred',
      status: 'Failed',
      code: err.error?.error?.message || 'UNKNOWN_ERROR'
    };

    switch (err.error.error.message) {
      case 'EMAIL_EXISTS':
        error.message = "This email already exists.";
        break;
      case 'OPERATION_NOT_ALLOWED':
        error.message = 'This operation is not allowed.';
        break;
      case 'INVALID_LOGIN_CREDENTIALS':
        error.message = 'The email ID or Password is not correct.';
        break
    }
    // this.errorSubject.next(error);
    this.toastService.show(error.message, 'error');
  }
}
