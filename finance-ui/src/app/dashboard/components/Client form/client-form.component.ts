import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientDraft } from '../../models';
import { HttpClient } from '@angular/common/http';
import { SaveClient } from '../../urls';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.css'
})
export class ClientFormComponent {
  @Input({ required: true }) client!: ClientDraft;
  @Output() cancel = new EventEmitter<void>();

  constructor(private http: HttpClient) {}

  saveClient(): void {
    this.http.post(SaveClient, this.bindClientData()).subscribe((response) => {
      console.log('Client saved successfully:', response);
      return response;
    });
  }

  bindClientData() {
    const clientData = {
      name: this.client.name,
      mobile: this.client.mobile,
      gender: this.client.gender,
      address: this.client.address
    };
    return clientData;
  }
}
