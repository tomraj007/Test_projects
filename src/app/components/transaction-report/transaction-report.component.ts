import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { TransactionService } from '../../services/transaction.service';
import { AuthService } from '../../services/auth.service';
import { CommonService } from '../../services/common.service';
import { Transaction, TransactionReportRequest } from '../../models/transaction.model';

@Component({
  selector: 'app-transaction-report',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatToolbarModule,
    MatMenuModule
  ],
  templateUrl: './transaction-report.component.html',
  styleUrls: ['./transaction-report.component.css']
})
export class TransactionReportComponent implements OnInit {
  filterForm!: FormGroup;
  transactions: Transaction[] = [];
  tableHeaders: string[] = [
    '#',
    'Reference Number',
    'Service',
    'Status',
    'Amount',
    'Sender',
    'Receiver',
    'Location',
    'Profile Risk',
    'Country Risk',
    'Created On'
  ];
  
  loading = false;
  loadingMore = false;
  hasMore = true;
  currentPage = 1;
  pageSize = 20;
  totalRecords = 0;

  transactionTypes = ['SM', 'SB'];
  riskLevels = ['Low', 'Medium', 'High'];
  statuses = ['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED'];

  // Sample IDs for testing
  sampleAgentId = '25ec3a76-b381-4854-a6c2-346cb8d77fdd';
  sampleLocationId = '8f070c98-5ffc-418a-85bf-5922c3b68efd';

  userInfo: any;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private authService: AuthService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    // Use setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      this.userInfo = this.authService.getUserInfo();
      this.loadTransactions();
    });
  }

  initializeForm(): void {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    this.filterForm = this.fb.group({
      agentId: [''],
      locationId: [''],
      fromDate: [''],
      toDate: [''],
      transactionType: [''],
      status: [''],
      profRisk: [''],
      countryRisk: ['']
    });

    // Debounced filter change
    const debouncedSearch = this.commonService.debounce(() => {
      this.resetAndSearch();
    }, 500);

    this.filterForm.valueChanges.subscribe(() => {
      debouncedSearch();
    });
  }

  loadTransactions(append: boolean = false): void {
    if (this.loading || this.loadingMore) {
      return;
    }

    if (append) {
      this.loadingMore = true;
    } else {
      this.loading = true;
      this.transactions = [];
    }

    const request = this.buildRequest();

    this.transactionService.getTransactionReport(request).subscribe({
      next: (response) => {
        const newItems = response.items || [];
        
        if (append) {
          this.transactions = [...(this.transactions || []), ...newItems];
        } else {
          this.transactions = newItems;
        }
        
        this.totalRecords = response.totalCount || 0;
        this.hasMore = this.transactions.length < this.totalRecords;
        
        if (newItems.length === 0 && !append) {
          this.commonService.showInfo('No transactions found for the selected filters');
        }
      },
      error: (error) => {
        const errorMessage = this.commonService.handleError(error);
        this.commonService.showError(errorMessage);
        this.hasMore = false;
      },
      complete: () => {
        this.loading = false;
        this.loadingMore = false;
      }
    });
  }

  buildRequest(): TransactionReportRequest {
    const formValue = this.filterForm.value;
    const request: TransactionReportRequest = {
      pageNumber: this.currentPage,
      pageSize: this.pageSize
    };

    if (formValue.agentId) {
      request.agentId = formValue.agentId;
    }
    if (formValue.locationId) {
      request.locationId = formValue.locationId;
    }
    if (formValue.fromDate) {
      request.fromDate = this.commonService.formatDate(formValue.fromDate);
    }
    if (formValue.toDate) {
      request.toDate = this.commonService.formatDate(formValue.toDate);
    }
    if (formValue.transactionType) {
      request.transactionType = formValue.transactionType;
    }
    if (formValue.status) {
      request.status = formValue.status;
    }
    if (formValue.profRisk) {
      request.profRisk = formValue.profRisk;
    }
    if (formValue.countryRisk) {
      request.countryRisk = formValue.countryRisk;
    }

    return request;
  }

  resetAndSearch(): void {
    this.currentPage = 1;
    this.hasMore = true;
    this.loadTransactions(false);
  }

  onSearch(): void {
    this.resetAndSearch();
  }

  onReset(): void {
    this.filterForm.reset({
      agentId: this.sampleAgentId,
      locationId: this.sampleLocationId,
      fromDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      toDate: new Date()
    });
    this.resetAndSearch();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    const scrollPosition = window.pageYOffset + window.innerHeight;
    const pageHeight = document.documentElement.scrollHeight;
    
    // Load more when user scrolls to 80% of the page
    if (scrollPosition >= pageHeight * 0.8 && this.hasMore && !this.loading && !this.loadingMore) {
      this.currentPage++;
      this.loadTransactions(true);
    }
  }

  exportToCSV(): void {
    if (this.transactions.length === 0) {
      this.commonService.showError('No data to export');
      return;
    }

    const exportData = this.transactions.map(t => ({
      'Reference Number': t.refNum,
      'Service': t.service,
      'Status': t.status,
      'Amount': t.amount,
      'Profile Risk': t.profRisk,
      'Country Risk': t.countryRisk,
      'Created On': t.createdOn,
      'Sender': t.senderName || 'N/A',
      'Receiver': t.receiverName || 'N/A',
      'Location': t.location,
      'Country': t.country
    }));

    this.transactionService.exportToCSV(exportData, `transactions_${Date.now()}.csv`);
    this.commonService.showSuccess('Transactions exported successfully');
  }

  logout(): void {
    this.authService.logout();
  }

  formatCurrency(amount: string | number): string {
    // Amount comes as string like "111,00" from API
    const numAmount = typeof amount === 'string' ? parseFloat(amount.replace(',', '.')) : amount;
    return `€ ${numAmount.toFixed(2)}`;
  }

  formatDate(date: string): string {
    return this.commonService.formatDate(date);
  }

  getRiskClass(risk: string): string {
    switch (risk?.toLowerCase()) {
      case 'low':
        return 'risk-low';
      case 'medium':
        return 'risk-medium';
      case 'high':
        return 'risk-high';
      default:
        return '';
    }
  }

  getStatusClass(status: string): string {
    switch (status?.toUpperCase()) {
      case 'OK':
        return 'status-completed';
      case 'PENDING':
        return 'status-pending';
      case 'ERROR':
      case 'FAILED':
        return 'status-failed';
      case 'REJECTED':
      case 'CANCELLED':
        return 'status-cancelled';
      default:
        return '';
    }
  }

  getRiskIcon(risk: string): string {
    switch (risk?.toLowerCase()) {
      case 'low':
        return 'check_circle';
      case 'medium':
        return 'warning';
      case 'high':
        return 'error';
      default:
        return 'help';
    }
  }
}
