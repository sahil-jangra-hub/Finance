import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { API, ROOT, AuthService } from '../api';
import { ClientFormComponent } from './components/Client form/client-form.component';
import { DashboardHeaderComponent } from './components/dashboard-header.component';
import { DashboardStatsComponent } from './components/client stats/dashboard-stats.component';
import { LoanFormComponent } from './components/loan form/loan-form.component';
import { LoansTableComponent } from './components/Loan Table/loans-table.component';
import { Client, ClientDocument, ClientDraft, ClientUpload, Loan, LoanDraft } from './models';
import { ClientsListComponent } from './components/Client List/clients-list.component';

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
  q = '';
  docType = 'Aadhaar';

  constructor(private h: HttpClient, private a: AuthService, private r: Router) {
  }

  showDocs(id: number): void {
    this.h.get<ClientDocument[]>(API + `/clients/${id}/documents`).subscribe(documents => this.docs[id] = documents);
  }

  up(upload: ClientUpload): void {
    const form = new FormData();
    form.append('file', upload.file);
    form.append('docType', upload.docType);
  }

  out(): void {
    this.a.logout();
    this.r.navigate(['/login']);
  }
}
