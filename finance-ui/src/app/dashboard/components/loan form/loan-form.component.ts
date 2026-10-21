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
  selectedClientName = '';

  clientFormDto: LoanDraft = {
    clientId: '',
    principal: 0,
    interestPercent: 0,
    dueDate: '',
    penaltyPerDay: 0
  }

  constructor(private clientDetailsService: ClientDetailsService) {}

  bindLoanData(): LoanDraft | null {
    const clientId = this.getClientIdByName(this.selectedClientName);
    if (clientId === undefined) {
      return null;
    }

    return {
      clientId,
      principal: this.clientFormDto.principal,
      interestPercent: this.clientFormDto.interestPercent,
      dueDate: this.clientFormDto.dueDate,
      penaltyPerDay: this.clientFormDto.penaltyPerDay
    };
  }

  getClientIdByName(clientName: string): number | undefined {
    const client = this.activeClients.find(c => c.Name === clientName);
    return client?.Id;
  }

  saveLoan(): void {
    const loanData = this.bindLoanData();
    if (!loanData) {
      window.alert('Please select a client.');
      return;
    }

    this.clientDetailsService.save(loanData, SaveLoan);
  }
}
