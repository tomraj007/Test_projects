export interface TransactionReportRequest {
  pageNumber: number;
  pageSize: number;
  locationId?: string;
  fromDate?: string;
  toDate?: string;
  agentId?: string;
  transactionType?: 'SM' | 'SB';
  status?: string;
  profRisk?: 'Low' | 'Medium' | 'High';
  countryRisk?: 'Low' | 'Medium' | 'High';
}

export interface TransactionReportResponse {
  items: Transaction[];
  totalCount: number;
}

export interface Transaction {
  id: string;
  status: string;
  createdOn: string;
  createdBy: string;
  principle: string;
  principleId: string;
  service: string;
  refNum: string;
  amount: string;
  senderName: string;
  receiverName: string;
  agentName: string;
  agentId: string;
  location: string;
  locationId: string;
  customerNumber: string;
  idType: string;
  idNumber: string;
  dob: string;
  firstName: string;
  lastName: string;
  fee: number;
  totalPayableAmount: number;
  country: string;
  isAlert: number;
  mgRefNum: string | null;
  countryRisk: string;
  profRisk: string;
  countryId: string;
  suspiciousNote: string | null;
  serviceName: string | null;
}
