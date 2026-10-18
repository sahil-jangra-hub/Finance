import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientFormDto } from '../../models';
import { SaveClient } from '../../urls';
import { ClientDetailsService } from '../client-details.service';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.css'
})
export class ClientFormComponent {
  @Output() cancel = new EventEmitter<void>();
  clientFormDto: ClientFormDto = {
    name: '',
    mobile: '',
    gender: 'Male',
    address: ''
  };

  constructor(private clientDetailsService: ClientDetailsService) {}

  saveClient(): void {
    this.clientDetailsService.save(this.bindClientData(), SaveClient);
  }

  bindClientData() {
    const clientData = {
      name: this.clientFormDto.name,
      mobile: this.clientFormDto.mobile,
      gender: this.clientFormDto.gender,
      address: this.clientFormDto.address
    };
    return clientData;
  }
}
