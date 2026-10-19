import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Client } from '../models';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClientDetailsService {
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
    return this.http.get(url).subscribe((response) => {
      this.getClients(response);
    });
  }

  private getClients(response: Object) {
    this.clients.next(response as Client[]);
  }
}
