import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Client, ClientDocument, ClientUpload } from '../../models';
import { ClientDetailsService } from '../client-details.service';
import { GetClients } from '../../urls';

@Component({
  selector: 'app-clients-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clients-list.component.html',
  styleUrl: './clients-list.component.css'
})
export class ClientsListComponent {
  clients: Client[] = [];
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

  constructor(private clientDetailsService: ClientDetailsService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.refreshClient();
  }

  refreshClient(){
    this.clientDetailsService.getClientDetails(GetClients);
    this.clientDetailsService.client$.subscribe((clients) => {
      this.clients = clients;
      this.cdr.detectChanges();
    });
  }

  upload(event: Event, clientId: number, kind: ClientUpload['kind']): void {
    const input = event.target;
    if (!(input instanceof HTMLInputElement) || !input.files?.length) return;
    this.uploadFile.emit({ clientId, kind, file: input.files[0], docType: this.docType });
  }
}
