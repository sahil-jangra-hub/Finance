import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Client, LoanDraft } from './models';

@Component({
  selector: 'app-loan-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <h3>🏦 Give Loan</h3>
      <div class="form-grid">
        <select [(ngModel)]="loan.clientId">
          <option value="" disabled>Select client</option>
          <option *ngFor="let client of activeClients" [value]="client.id">{{ client.name }}</option>
        </select>
        <input type="number" [(ngModel)]="loan.principal" placeholder="Amount ₹">
        <input type="number" [(ngModel)]="loan.interestPercent" placeholder="Interest % / month">
        <input type="date" [(ngModel)]="loan.dueDate">
        <input type="number" [(ngModel)]="loan.penaltyPerDay" placeholder="Penalty ₹ / day">
      </div>
      <button class="btn" (click)="save.emit()">Add loan</button>
    </div>
  `
})
export class LoanFormComponent {
  @Input({ required: true }) loan!: LoanDraft;
  @Input() activeClients: Client[] = [];
  @Output() save = new EventEmitter<void>();
}
