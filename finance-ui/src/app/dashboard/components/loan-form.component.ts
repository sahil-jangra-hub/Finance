import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Client, LoanDraft } from '../models';

@Component({
  selector: 'app-loan-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './loan-form.component.html',
  styleUrl: './loan-form.component.css'
})
export class LoanFormComponent {
  @Input({ required: true }) loan!: LoanDraft;
  @Input() activeClients: Client[] = [];
  @Output() save = new EventEmitter<void>();
}
