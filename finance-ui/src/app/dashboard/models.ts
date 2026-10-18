export interface Client {
  UserId: number;
  Name: string;
  Mobile: string | null;
  Gender: string;
  Address: string | null;
  Status: string;
  PhotoPath: string | null;
  DocCount: number;
}

export interface ClientDraft {
  id?: number;
  name?: string;
  mobile?: string | null;
  gender: string;
  address?: string | null;
}

export interface Loan {
  id: number;
  clientId: number;
  clientName: string;
  mobile: string;
  principal: number;
  interestPercent: number;
  interest: number;
  dueDate: string;
  daysOverdue: number;
  penalty: number;
  totalDue: number;
  status: string;
}

export interface ClientFormDto {
  name: string;
  mobile: string;
  gender: string;
  address: string;
}

export interface LoanDraft {
  clientId: string | number;
  principal?: number;
  interestPercent?: number;
  dueDate?: string;
  penaltyPerDay?: number;
}

export interface ClientDocument {
  filePath: string;
  docType: string;
}

export interface ClientUpload {
  clientId: number;
  kind: 'photo' | 'documents';
  file: File;
  docType: string;
}
