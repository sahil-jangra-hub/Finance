import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from './api';
@Component({ standalone: true, imports: [FormsModule, CommonModule], template: `
<div style="max-width:360px;margin:60px auto;font-family:sans-serif">
  <h2>Finance Tracker - {{reg ? 'Register' : 'Login'}}</h2>
  <div *ngIf="reg">
    <input [(ngModel)]="f.name" placeholder="Name" style="width:100%;margin:4px 0"><br>
    <input [(ngModel)]="f.email" placeholder="Email" style="width:100%;margin:4px 0"><br>
    <input [(ngModel)]="f.phone" placeholder="Phone" style="width:100%;margin:4px 0"><br>
  </div>
  <input *ngIf="!reg" [(ngModel)]="id" placeholder="Email or phone" style="width:100%;margin:4px 0"><br>
  <input type="password" [(ngModel)]="f.password" placeholder="Password" style="width:100%;margin:4px 0"><br>
  <button (click)="go()">{{reg ? 'Register' : 'Login'}}</button>
  <a href="#" (click)="reg=!reg;$event.preventDefault()" style="margin-left:12px">{{reg ? 'Have account? Login' : 'New? Register'}}</a>
  <p style="color:red">{{err}}</p>
</div>` })
export class LoginComponent {
  reg = false; id = ''; err = ''; f: any = {};
  constructor(private a: AuthService, private r: Router) {}
  go() {
    this.err = '';
    if (this.reg) this.a.register(this.f).subscribe({ next: () => { this.reg = false; this.id = this.f.email; }, error: e => this.err = e.error?.message || 'Failed' });
    else this.a.login(this.id, this.f.password).subscribe({ next: x => { this.a.setSession(x); this.r.navigate(['/dashboard']); }, error: () => this.err = 'Invalid login' });
  }
}
