import { HttpInterceptorFn } from '@angular/common/http';
import { ToastService } from '../../shared/ui/service/toast.service';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService)

  return next(req).pipe(
    catchError((err) => {
      switch (err.status) {
        case 400:
          toastService.show('Sessoin has expired or Invalid login credentials. Please login again!', 'error')
          break;
        case 401:
          toastService.show('Unauthorized! Please login again.', 'error')
          break;
        case 500:
          toastService.show('Server error. Try again later', 'error');
          break;
        default:
          toastService.show(err.error.error.message || 'Something went wrong', 'error');
      }

      return throwError(() => err)
      // return of()
      //  throw new Error(err);

    })
  )
};
