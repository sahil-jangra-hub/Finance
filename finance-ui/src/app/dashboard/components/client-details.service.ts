import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { Client, Loan } from '../models';
import { map, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClientDetailsService {
  clientsCount = signal(0);
  clientList = signal<Client[]>([]);
  activeClients = computed(() => this.clientList().filter(client => client.Status === 'Active'));
  lent = signal(0);
  receivable = signal(0);
  overdue = signal(0);
  clients = new Subject<Client[]>();
  client$ = this.clients.asObservable();

  constructor(private http: HttpClient) {}


  save(clientData: any, url: string) {
    return this.http.post(url, clientData).subscribe((response) => {
      console.log('Client saved successfully:', response);
      return response;
    });
  }

  getClientDetails(url: string) {
    return this.http.get<Client[]>(url).subscribe((response) => {
      this.getClients(response);
    });
  }

  getAllLoans(url: string): Observable<any> {
    return this.http.get(url).pipe(
      map((response) => {
        console.log('Loans fetched successfully:', response);
        return response;
      })
    );
  }

  private getClients(response: Client[]) {
    this.getClientCount(response);
    this.clientList.set(response);
    this.clients.next(response);
  }

  getClientCount(response: Client[]) {
    this.clientsCount.set(response.filter((client: Client) => client.Status === 'Active').length);
  }

  updateLoanStats(loans: Loan[]): void {
    const activeLoans = loans.filter(loan => loan.Status === 'Active');
    this.lent.set(activeLoans.reduce((total, loan) => total + loan.Principal, 0));
    this.receivable.set(activeLoans.reduce((total, loan) => total + loan.TotalDue, 0));
    this.overdue.set(activeLoans.filter(loan => loan.DaysOverdue > 0).length);
  }
}
