import { Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { DashComponent } from './dash.component';
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashComponent, canActivate: [() => !!localStorage.getItem('t') || (location.hash = '', location.href = '/login', false)] },
  { path: '**', redirectTo: 'dashboard' }
];
