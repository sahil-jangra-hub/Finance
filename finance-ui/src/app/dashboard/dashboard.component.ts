import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { API, ROOT, AuthService } from '../api';
import { ClientFormComponent } from './components/Client form/client-form.component';
import { ClientsListComponent } from './components/clients-list.component';
import { DashboardHeaderComponent } from './components/dashboard-header.component';
import { DashboardStatsComponent } from './components/dashboard-stats.component';
import { LoanFormComponent } from './components/loan-form.component';
import { LoansTableComponent } from './components/loans-table.component';
import { Client, ClientDocument, ClientDraft, ClientUpload, Loan, LoanDraft } from './models';

@Component({
  selector: 'app-dash',
  standalone: true,
  imports: [
    CommonModule,
    DashboardHeaderComponent,
    DashboardStatsComponent,
    ClientFormComponent,
    LoanFormComponent,
    LoansTableComponent,
    ClientsListComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashComponent {
  readonly root = ROOT;
  readonly name = localStorage.getItem('n');
  clients: Client[] = [];
  loans: Loan[] = [];
  docs: Record<number, ClientDocument[]> = {};
  c: ClientDraft = { gender: 'Male' };
  l: LoanDraft = { clientId: '' };
  q = '';
  docType = 'Aadhaar';

  constructor(private h: HttpClient, private a: AuthService, private r: Router) {
    this.load();
  }

  get activeLoans(): Loan[] {
    return this.loans.filter(loan => loan.status === 'Active');
  }

  get lent(): number {
    return this.activeLoans.reduce((total, loan) => total + loan.principal, 0);
  }

  get receivable(): number {
    return this.activeLoans.reduce((total, loan) => total + loan.totalDue, 0);
  }

  get overdue(): number {
    return this.activeLoans.filter(loan => loan.daysOverdue > 0).length;
  }

  get activeClients(): Client[] {
    return this.clients.filter(client => client.status === 'Active');
  }

  load(): void {
    this.h.get<Client[]>(API + '/clients').subscribe(clients => this.clients = clients);
    this.h.get<Loan[]>(API + '/loans').subscribe(loans => this.loans = loans);
  }

  cancelClientEdit(): void {
    this.c = { gender: 'Male' };
  }

  editClient(client: Client): void {
    this.c = {
      id: client.id,
      name: client.name,
      mobile: client.mobile,
      gender: client.gender,
      address: client.address
    };
  }

  saveLoan(): void {
    this.h.post(API + '/loans', this.l).subscribe(() => {
      this.l = { clientId: '' };
      this.load();
    });
  }

  clearLoan(id: number): void {
    if (confirm('Mark as paid?')) {
      this.h.post(API + `/loans/${id}/clear`, {}).subscribe(() => this.load());
    }
  }

  clearClient(id: number): void {
    if (confirm('Clear client and all loans?')) {
      this.h.post(API + `/clients/${id}/clear`, {}).subscribe(() => this.load());
    }
  }

  del(id: number): void {
    if (confirm('Delete client?')) {
      this.h.delete(API + `/clients/${id}`).subscribe(() => this.load());
    }
  }

  showDocs(id: number): void {
    this.h.get<ClientDocument[]>(API + `/clients/${id}/documents`).subscribe(documents => this.docs[id] = documents);
  }

  up(upload: ClientUpload): void {
    const form = new FormData();
    form.append('file', upload.file);
    form.append('docType', upload.docType);
    this.h.post(API + `/clients/${upload.clientId}/${upload.kind}`, form).subscribe(() => this.load());
  }

  out(): void {
    this.a.logout();
    this.r.navigate(['/login']);
  }
}
