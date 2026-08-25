import { HttpInterceptorFn } from '@angular/common/http';

export const authMembreInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('membre_token');

  if (token && req.url.includes('/api/membres/') && !req.url.includes('/api/membres/auth/')) {
    const reqClone = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(reqClone);
  }

  return next(req);
};