import { HttpInterceptorFn } from '@angular/common/http';
import { retry, timer } from 'rxjs';

export const retryInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    retry({
      count: 2,
      delay: (err, retryCount) => {
        console.log(`Retrying (${retryCount})...`);
        return timer(1000 * retryCount); // exponential delay
      }
    })
  );
};
