import { HttpClient, HttpInterceptorFn } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { finalize } from 'rxjs';
export const ROOT = 'http://localhost:5000';
export const API = ROOT + '/api';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private activeRequests = 0;
  readonly isLoading = signal(false);

  beginRequest(): void {
    this.activeRequests++;
    this.isLoading.set(true);
  }

  endRequest(): void {
    this.activeRequests--;
    this.isLoading.set(this.activeRequests > 0);
  }
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private h: HttpClient) {}
  get token() { return localStorage.getItem('t'); }
  login(id: string, password: string) { return this.h.post<any>(API + '/auth/login', { id, password }); }
  register(x: any) { return this.h.post(API + '/auth/register', x); }
  setSession(r: any) { localStorage.setItem('t', r.token); localStorage.setItem('n', r.name); }
  logout() { localStorage.clear(); }
}
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const t = localStorage.getItem('t');
  return next(t ? req.clone({ setHeaders: { Authorization: 'Bearer ' + t } }) : req);
};

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loading = inject(LoadingService);
  loading.beginRequest();
  return next(req).pipe(finalize(() => loading.endRequest()));
};
