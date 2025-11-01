import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TransactionReportRequest, TransactionReportResponse } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private readonly API_URL = '/api/gateway/report';

  constructor(private http: HttpClient) {}

  getTransactionReport(request: TransactionReportRequest): Observable<TransactionReportResponse> {
    // Wrap the request in transactionReportDto as expected by the API
    const body = {
      transactionReportDto: request
    };
    
    return this.http.post<TransactionReportResponse>(
      `${this.API_URL}/TransactionReport`,
      body
    );
  }

  exportToCSV(data: any[], filename: string = 'transactions.csv'): void {
    if (!data || data.length === 0) {
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escape commas and quotes
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
