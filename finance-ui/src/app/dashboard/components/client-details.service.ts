import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ClientDetailsService {
  constructor(private http: HttpClient) {}


  save(clientData: any, url: string) {
    return this.http.post(url, clientData).subscribe((response) => {
      console.log('Client saved successfully:', response);
      return response;
    });
  }

  getClientDetails(url: string) {
    return this.http.get(url);
  }
}
