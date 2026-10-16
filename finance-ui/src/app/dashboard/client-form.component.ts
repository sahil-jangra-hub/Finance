import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientDraft } from './models';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <h3>{{ client.id ? '✏️ Edit' : '➕ Add' }} Client</h3>
      <div class="form-grid">
        <input [(ngModel)]="client.name" placeholder="Name">
        <input [(ngModel)]="client.mobile" placeholder="Mobile">
        <select [(ngModel)]="client.gender"><option>Male</option><option>Female</option><option>Other</option></select>
        <input [(ngModel)]="client.address" placeholder="Address">
      </div>
      <button class="btn" (click)="save.emit()">Save client</button>
      <button *ngIf="client.id" class="btn btn-ghost" style="margin-left:8px" (click)="cancel.emit()">Cancel</button>
    </div>
  `
})
export class ClientFormComponent {
  @Input({ required: true }) client!: ClientDraft;
  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
