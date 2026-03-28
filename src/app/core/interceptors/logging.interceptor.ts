import { HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const start = Date.now();
  return next(req).pipe(
    tap({
      next: (res) => console.log('Response: ', res),
      error: (err) => console.log('Error: ', err),
      finalize: () => console.log(`Time: ${Date.now() - start}ms Completed`)
    })
  );
};
