import { HttpClient, HttpInterceptorFn } from '@angular/common/http';
import { Injectable } from '@angular/core';
export const ROOT = 'http://localhost:5000';
export const API = ROOT + '/api';
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
