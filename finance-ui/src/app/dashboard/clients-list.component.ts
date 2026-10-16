import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Client, ClientDocument, ClientUpload } from './models';

@Component({
  selector: 'app-clients-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="card">
      <h3>👥 Clients</h3>
      <div class="empty" *ngIf="!clients.length">No clients yet</div>
      <div class="client" *ngFor="let client of clients">
        <img class="avatar" [src]="client.photoPath ? root + client.photoPath : emptyPhoto" alt="">
        <div class="info">
          <div class="name">{{ client.name }} <span class="badge" [ngClass]="client.status">{{ client.status }}</span></div>
          <div class="meta">{{ client.gender }} · {{ client.mobile }} · {{ client.address }}</div>
          <div class="docs meta">📄 {{ client.docCount }} documents
            <a href="#" (click)="showDocuments.emit(client.id); $event.preventDefault()">view</a>
            <a *ngFor="let document of documents[client.id]" [href]="root + document.filePath" target="_blank">{{ document.docType }}</a>
          </div>
        </div>
        <div class="uploads">
          <label>Photo</label><input type="file" (change)="upload($event, client.id, 'photo')">
          <label>Document</label>
          <select [(ngModel)]="docType" (ngModelChange)="docTypeChange.emit($event)"><option>Aadhaar</option><option>PAN</option><option>Cheque</option><option>Promissory Note</option><option>Other</option></select>
          <input type="file" (change)="upload($event, client.id, 'documents')">
        </div>
        <div class="actions">
          <button class="btn btn-sm" (click)="edit.emit(client)">Edit</button>
          <button class="btn btn-warn btn-sm" (click)="clearClient.emit(client.id)">Clear</button>
          <button class="btn btn-bad btn-sm" (click)="deleteClient.emit(client.id)">Delete</button>
        </div>
      </div>
    </section>
  `
})
export class ClientsListComponent {
  @Input() clients: Client[] = [];
  @Input() root = '';
  @Input() documents: Record<number, ClientDocument[]> = {};
  @Input() docType = 'Aadhaar';
  @Output() docTypeChange = new EventEmitter<string>();
  @Output() edit = new EventEmitter<Client>();
  @Output() clearClient = new EventEmitter<number>();
  @Output() deleteClient = new EventEmitter<number>();
  @Output() showDocuments = new EventEmitter<number>();
  @Output() uploadFile = new EventEmitter<ClientUpload>();

  readonly emptyPhoto = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22/%3E';

  upload(event: Event, clientId: number, kind: ClientUpload['kind']): void {
    const input = event.target;
    if (!(input instanceof HTMLInputElement) || !input.files?.length) return;
    this.uploadFile.emit({ clientId, kind, file: input.files[0], docType: this.docType });
  }
}
