import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Client, LoanDraft } from '../../models';
import { ClientDetailsService } from '../client-details.service';
import { SaveLoan } from '../../urls';

@Component({
  selector: 'app-loan-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './loan-form.component.html',
  styleUrl: './loan-form.component.css'
})
export class LoanFormComponent {
  @Input() activeClients: Client[] = [];
  clientFormDto: LoanDraft = {
    clientId: '',
    principal: 0,
    interestPercent: 0,
    dueDate: '',
    penaltyPerDay: 0
  }

  constructor(private clientDetailsService: ClientDetailsService) {}

  bindLoanData() {
    const loanData = {
      clientId: 2,
      principal: this.clientFormDto.principal,
      interestPercent: this.clientFormDto.interestPercent,
      dueDate: this.clientFormDto.dueDate,
      penaltyPerDay: this.clientFormDto.penaltyPerDay
    };
    return loanData;
  }

  saveLoan(): void {
    this.clientDetailsService.save(this.bindLoanData(), SaveLoan);
  }
}
