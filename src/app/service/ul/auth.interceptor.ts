import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authReq = req.clone({
    setHeaders: {
      Authorization: 'Bearer TOKEN_DE_EJEMPLO'
    }
  });

  return next(authReq);
};
