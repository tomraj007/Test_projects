import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
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
export class TransactionReportComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('scrollWrapper') scrollWrapper?: ElementRef;
  filterForm!: FormGroup;
  transactions: Transaction[] = [];
  tableHeaders: string[] = [
    '#',
    'Reference Number',
    'Service',
    'Service Name',
    'Status',
    'Amount',
    'Fee',
    'Total Payable',
    'Sender',
    'Receiver',
    'First Name',
    'Last Name',
    'Customer Number',
    'DOB',
    'ID Number',
    'Agent Name',
    'Agent ID',
    'Location',
    'Location ID',
    'Country',
    'Principle',
    'MG Ref Num',
    'Profile Risk',
    'Country Risk',
    'Is Alert',
    'Suspicious Note',
    'Created By',
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
    private commonService: CommonService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Load user info immediately
    this.userInfo = this.authService.getUserInfo();
    
    this.initializeForm();
    
    // Load transactions immediately - use Promise.resolve to avoid ExpressionChangedAfterItHasBeenCheckedError
    Promise.resolve().then(() => {
      this.loadTransactions();
    });
  }

  ngAfterViewInit(): void {
    // Add scroll listener to the scroll wrapper
    if (this.scrollWrapper) {
      this.scrollWrapper.nativeElement.addEventListener('scroll', () => this.onScrollWrapper());
    }
  }

  ngOnDestroy(): void {
    // Clean up scroll listener
    if (this.scrollWrapper) {
      this.scrollWrapper.nativeElement.removeEventListener('scroll', () => this.onScrollWrapper());
    }
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

    // Note: API call is only triggered when Search button is clicked
    // No auto-search on field value changes
  }

  loadTransactions(append: boolean = false): void {
    if (this.loading || this.loadingMore) {
      return;
    }

    if (append) {
      this.loadingMore = true;
      this.cdr.detectChanges(); // Force immediate UI update
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
        
        // Add a small delay to ensure loader is visible
        setTimeout(() => {
          this.loading = false;
          this.loadingMore = false;
          this.cdr.detectChanges();
        }, 500); // 500ms minimum display time
        
        if (newItems.length === 0 && !append) {
          this.commonService.showInfo('No transactions found for the selected filters');
        }
      },
      error: (error) => {
        console.error('Error loading transactions:', error);
        const errorMessage = this.commonService.handleError(error);
        this.commonService.showError(errorMessage);
        this.hasMore = false;
        this.loading = false;
        this.loadingMore = false;
        this.cdr.detectChanges();
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
    // Clear all form fields
    this.filterForm.reset({
      agentId: '',
      locationId: '',
      fromDate: '',
      toDate: '',
      transactionType: '',
      status: '',
      profRisk: '',
      countryRisk: ''
    });
    
    // Reset to first page and reload with default parameters (pageNumber: 1, pageSize: 20)
    this.resetAndSearch();
  }

  onScrollWrapper(): void {
    if (!this.scrollWrapper) return;
    
    const element = this.scrollWrapper.nativeElement;
    const scrollPosition = element.scrollTop + element.clientHeight;
    const scrollHeight = element.scrollHeight;
    
    // Load more when user scrolls near the bottom (within 100px)
    const threshold = 100;
    if (scrollPosition >= scrollHeight - threshold && this.hasMore && !this.loading && !this.loadingMore) {
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
      'Service Name': t.serviceName || 'N/A',
      'Status': t.status,
      'Amount': t.amount,
      'Fee': t.fee,
      'Total Payable': t.totalPayableAmount,
      'Sender': t.senderName || 'N/A',
      'Receiver': t.receiverName || 'N/A',
      'First Name': t.firstName || 'N/A',
      'Last Name': t.lastName || 'N/A',
      'Customer Number': t.customerNumber || 'N/A',
      'DOB': t.dob,
      'ID Number': t.idNumber || 'N/A',
      'Agent Name': t.agentName || 'N/A',
      'Agent ID': t.agentId || 'N/A',
      'Location': t.location,
      'Location ID': t.locationId || 'N/A',
      'Country': t.country,
      'Principle': t.principle,
      'MG Ref Num': t.mgRefNum || 'N/A',
      'Profile Risk': t.profRisk,
      'Country Risk': t.countryRisk,
      'Is Alert': t.isAlert ? 'Yes' : 'No',
      'Suspicious Note': t.suspiciousNote || '-',
      'Created By': t.createdBy || 'N/A',
      'Created On': t.createdOn
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
