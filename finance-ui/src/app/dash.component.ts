import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { API, ROOT, AuthService } from './api';
@Component({ standalone: true, imports: [CommonModule, FormsModule], selector: 'app-dash', template: `
<header class="topbar"><div class="brand">💰 Finance Tracker</div>
  <div>👤 {{name}} <button class="btn btn-ghost btn-sm" (click)="out()">Logout</button></div></header>
<main class="container">
<section class="stats"> 
  <div class="stat"><small>Money lent (active)</small><b>₹{{lent | number:'1.0-0'}}</b></div>
  <div class="stat green"><small>Total to receive</small><b>₹{{receivable | number:'1.0-0'}}</b></div>
  <div class="stat red"><small>Overdue loans</small><b>{{overdue}}</b></div>
  <div class="stat"><small>Clients</small><b>{{clients.length}}</b></div>
</section>

<section class="grid2">
 <div class="card"><h3>{{c.id ? '✏️ Edit' : '➕ Add'}} Client</h3>
  <div class="form-grid">
   <input [(ngModel)]="c.name" placeholder="Name"><input [(ngModel)]="c.mobile" placeholder="Mobile">
   <select [(ngModel)]="c.gender"><option>Male</option><option>Female</option><option>Other</option></select>
   <input [(ngModel)]="c.address" placeholder="Address"></div>
  <button class="btn" (click)="saveClient()">Save client</button>
  <button *ngIf="c.id" class="btn btn-ghost" style="margin-left:8px" (click)="c={gender:'Male'}">Cancel</button>
 </div>
 <div class="card"><h3>🏦 Give Loan</h3>
  <div class="form-grid">
   <select [(ngModel)]="l.clientId"><option value="" disabled>Select client</option><option *ngFor="let x of active()" [value]="x.id">{{x.name}}</option></select>
   <input type="number" [(ngModel)]="l.principal" placeholder="Amount ₹">
   <input type="number" [(ngModel)]="l.interestPercent" placeholder="Interest % / month">
   <input type="date" [(ngModel)]="l.dueDate">
   <input type="number" [(ngModel)]="l.penaltyPerDay" placeholder="Penalty ₹ / day"></div>
  <button class="btn" (click)="saveLoan()">Add loan</button>
 </div>
</section>

<section class="card">
 <div class="card-head"><h3>📒 Loans</h3><input [(ngModel)]="q" placeholder="🔍 Search client"></div>
 <div class="table-wrap"><table>
  <thead><tr><th>Client</th><th>Principal</th><th>Int %</th><th>Interest</th><th>Due date</th><th>Days late</th><th>Penalty</th><th>Total due</th><th>Status</th><th></th></tr></thead>
  <tbody>
  <tr *ngFor="let x of filtered()" [class.late]="x.daysOverdue>0">
   <td><b>{{x.clientName}}</b><br><small>{{x.mobile}}</small></td><td>₹{{x.principal | number}}</td><td>{{x.interestPercent}}%</td><td>₹{{x.interest | number}}</td>
   <td>{{x.dueDate | date:'dd MMM yyyy'}}</td><td>{{x.daysOverdue}}</td><td>₹{{x.penalty | number}}</td><td><b>₹{{x.totalDue | number}}</b></td>
   <td><span class="badge" [ngClass]="x.daysOverdue>0 ? 'late' : x.status">{{x.daysOverdue>0 ? 'Overdue' : x.status}}</span></td>
   <td><button *ngIf="x.status=='Active'" class="btn btn-ok btn-sm" (click)="clearLoan(x.id)">Mark paid</button></td></tr>
  <tr *ngIf="!filtered().length"><td colspan="10" class="empty">No loans yet</td></tr>
  </tbody></table></div>
</section>

<section class="card"><h3>👥 Clients</h3>
 <div class="empty" *ngIf="!clients.length">No clients yet</div>
 <div class="client" *ngFor="let x of clients">
  <img class="avatar" [src]="x.photoPath ? root + x.photoPath : 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22/%3E'" alt="">
  <div class="info"><div class="name">{{x.name}} <span class="badge" [ngClass]="x.status">{{x.status}}</span></div>
   <div class="meta">{{x.gender}} · {{x.mobile}} · {{x.address}}</div>
   <div class="docs meta">📄 {{x.docCount}} documents <a href="#" (click)="showDocs(x.id);$event.preventDefault()">view</a>
    <a *ngFor="let d of docs[x.id]" [href]="root + d.filePath" target="_blank">{{d.docType}}</a></div></div>
  <div class="uploads">
   <label>Photo</label><input type="file" (change)="up($event,x.id,'photo')">
   <label>Document</label>
   <select [(ngModel)]="docType"><option>Aadhaar</option><option>PAN</option><option>Cheque</option><option>Promissory Note</option><option>Other</option></select>
   <input type="file" (change)="up($event,x.id,'documents')"></div>
  <div class="actions"><button class="btn btn-sm" (click)="c={id:x.id,name:x.name,mobile:x.mobile,gender:x.gender,address:x.address}">Edit</button>
   <button class="btn btn-warn btn-sm" (click)="clearClient(x.id)">Clear</button>
   <button class="btn btn-bad btn-sm" (click)="del(x.id)">Delete</button></div>
 </div>
</section>
</main>` })
export class DashComponent {
  root = ROOT; name = localStorage.getItem('n'); clients: any[] = []; loans: any[] = []; docs: any = {}; c: any = { gender: 'Male' }; l: any = { clientId: '' }; q = ''; docType = 'Aadhaar';
  constructor(private h: HttpClient, private a: AuthService, private r: Router) { this.load(); }
  get act() { return this.loans.filter(x => x.status == 'Active'); }
  get lent() { return this.act.reduce((s, x) => s + x.principal, 0); }
  get receivable() { return this.act.reduce((s, x) => s + x.totalDue, 0); }
  get overdue() { return this.act.filter(x => x.daysOverdue > 0).length; }
  load() { this.h.get<any[]>(API + '/clients').subscribe(x => this.clients = x); this.h.get<any[]>(API + '/loans').subscribe(x => this.loans = x); }
  active() { return this.clients.filter(x => x.status == 'Active'); }
  filtered() { return this.loans.filter(x => x.clientName.toLowerCase().includes(this.q.toLowerCase())); }
  saveClient() { this.h.post(API + '/clients', this.c).subscribe(() => { this.c = { gender: 'Male' }; this.load(); }); }
  saveLoan() { this.h.post(API + '/loans', this.l).subscribe(() => { this.l = { clientId: '' }; this.load(); }); }
  clearLoan(id: number) { if (confirm('Mark as paid?')) this.h.post(API + `/loans/${id}/clear`, {}).subscribe(() => this.load()); }
  clearClient(id: number) { if (confirm('Clear client and all loans?')) this.h.post(API + `/clients/${id}/clear`, {}).subscribe(() => this.load()); }
  del(id: number) { if (confirm('Delete client?')) this.h.delete(API + `/clients/${id}`).subscribe(() => this.load()); }
  showDocs(id: number) { this.h.get<any[]>(API + `/clients/${id}/documents`).subscribe(x => this.docs[id] = x); }
  up(e: any, id: number, kind: string) {
    const f = new FormData(); f.append('file', e.target.files[0]); f.append('docType', this.docType);
    this.h.post(API + `/clients/${id}/${kind}`, f).subscribe(() => this.load());
  }
  out() { this.a.logout(); this.r.navigate(['/login']); }
}