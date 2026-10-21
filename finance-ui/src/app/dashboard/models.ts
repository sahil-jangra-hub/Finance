export interface Client {
  UserId: number;
  Id: number;
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
  Id: number;
  ClientId: number;
  ClientName: string;
  Mobile: string;
  Principal: number;
  InterestPercent: number;
  Interest: number;
  DueDate: string;
  DaysOverdue: number;
  Penalty: number;
  TotalDue: number;
  Status: string;
  LoanDate: string;
  PenaltyPerDay: number;
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
