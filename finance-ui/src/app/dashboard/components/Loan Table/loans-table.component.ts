import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Loan } from '../../models';
import { ClientDetailsService } from '../client-details.service';
import { GetLoansList } from '../../urls';

@Component({
  selector: 'app-loans-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './loans-table.component.html',
  styleUrl: './loans-table.component.css'
})
export class LoansTableComponent implements OnInit {
  clientLoan: Loan[] = [];

  constructor(private clientDetailsService: ClientDetailsService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.clientDetailsService.getAllLoans(GetLoansList).subscribe(loans => {
      this.clientLoan = loans;
      this.clientDetailsService.updateLoanStats(loans);
      this.cdr.detectChanges();
    });
  }
}
