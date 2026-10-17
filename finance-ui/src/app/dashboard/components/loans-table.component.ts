import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Loan } from '../models';

@Component({
  selector: 'app-loans-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './loans-table.component.html',
  styleUrl: './loans-table.component.css'
})
export class LoansTableComponent {
  @Input() loans: Loan[] = [];
  @Input() query = '';
  @Output() queryChange = new EventEmitter<string>();
  @Output() clearLoan = new EventEmitter<number>();

  get filteredLoans(): Loan[] {
    const query = this.query.toLowerCase();
    return this.loans.filter(loan => loan.clientName.toLowerCase().includes(query));
  }
}
