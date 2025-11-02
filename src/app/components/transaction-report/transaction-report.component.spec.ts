import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideZoneChangeDetection } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ChangeDetectorRef } from '@angular/core';
import { of, throwError } from 'rxjs';
import { TransactionReportComponent } from './transaction-report.component';
import { TransactionService } from '../../services/transaction.service';
import { AuthService } from '../../services/auth.service';
import { CommonService } from '../../services/common.service';
import { Transaction, TransactionReportResponse } from '../../models/transaction.model';

describe('TransactionReportComponent', () => {
  let component: TransactionReportComponent;
  let fixture: ComponentFixture<TransactionReportComponent>;
  let transactionService: jasmine.SpyObj<TransactionService>;
  let authService: jasmine.SpyObj<AuthService>;
  let commonService: jasmine.SpyObj<CommonService>;
  let cdr: jasmine.SpyObj<ChangeDetectorRef>;

  const mockTransaction: Transaction = {
    id: 'TXN001',
    refNum: 'REF001',
    service: 'SM',
    serviceName: 'Service 1',
    status: 'OK',
    amount: '100.00',
    fee: 5.00,
    totalPayableAmount: 105.00,
    senderName: 'John Doe',
    receiverName: 'Jane Doe',
    firstName: 'John',
    lastName: 'Doe',
    customerNumber: 'CUST001',
    dob: '1990-01-01',
    idNumber: 'ID001',
    idType: 'Passport',
    agentName: 'Agent 1',
    agentId: 'agent-123',
    location: 'Location 1',
    locationId: 'location-456',
    country: 'USA',
    countryId: 'US',
    principle: 'Principle 1',
    principleId: 'PRIN001',
    mgRefNum: 'MG001',
    profRisk: 'Low',
    countryRisk: 'Low',
    isAlert: 0,
    suspiciousNote: '',
    createdBy: 'admin',
    createdOn: '2024-01-01T10:00:00'
  };

  const mockResponse: TransactionReportResponse = {
    items: [mockTransaction],
    totalCount: 1
  };

  beforeEach(async () => {
    const transactionServiceSpy = jasmine.createSpyObj('TransactionService', ['getTransactionReport', 'exportToCSV']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getUserInfo', 'logout']);
    const commonServiceSpy = jasmine.createSpyObj('CommonService', ['showSuccess', 'showError', 'showInfo', 'handleError', 'formatDate']);
    const cdrSpy = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

    await TestBed.configureTestingModule({
      imports: [
        TransactionReportComponent,
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      providers: [
        provideZoneChangeDetection(),
        { provide: TransactionService, useValue: transactionServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: CommonService, useValue: commonServiceSpy }
      ]
    }).compileComponents();

    transactionService = TestBed.inject(TransactionService) as jasmine.SpyObj<TransactionService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    commonService = TestBed.inject(CommonService) as jasmine.SpyObj<CommonService>;
    
    authService.getUserInfo.and.returnValue({ email: 'test@example.com' });
    transactionService.getTransactionReport.and.returnValue(of(mockResponse));
    commonService.formatDate.and.returnValue('01/01/2024, 10:00');

    fixture = TestBed.createComponent(TransactionReportComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load user info', () => {
      fixture.detectChanges();
      expect(authService.getUserInfo).toHaveBeenCalled();
      expect(component.userInfo).toEqual({ email: 'test@example.com' });
    });

    it('should initialize filter form', () => {
      fixture.detectChanges();
      expect(component.filterForm).toBeDefined();
      expect(component.filterForm.get('agentId')).toBeDefined();
      expect(component.filterForm.get('locationId')).toBeDefined();
      expect(component.filterForm.get('fromDate')).toBeDefined();
      expect(component.filterForm.get('toDate')).toBeDefined();
    });

    it('should load transactions on init', fakeAsync(() => {
      fixture.detectChanges();
      tick(600);
      expect(transactionService.getTransactionReport).toHaveBeenCalled();
    }));
  });

  describe('loadTransactions', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should load transactions successfully', fakeAsync(() => {
      component.loadTransactions(false);
      tick(600);
      
      expect(component.transactions.length).toBe(1);
      expect(component.totalRecords).toBe(1);
      expect(component.loading).toBe(false);
    }));

    it('should set loading flag when not appending', () => {
      component.loadTransactions(false);
      expect(component.loading).toBe(true);
    });

    it('should set loadingMore flag when appending', () => {
      component.loadTransactions(true);
      expect(component.loadingMore).toBe(true);
    });

    it('should append transactions when append is true', fakeAsync(() => {
      component.transactions = [mockTransaction];
      const newTransaction = { ...mockTransaction, id: 'TXN002', refNum: 'REF002' };
      transactionService.getTransactionReport.and.returnValue(of({
        items: [newTransaction],
        totalCount: 2
      }));

      component.loadTransactions(true);
      tick(600);

      expect(component.transactions.length).toBe(2);
    }));

    it('should replace transactions when append is false', fakeAsync(() => {
      component.transactions = [mockTransaction, mockTransaction];
      transactionService.getTransactionReport.and.returnValue(of(mockResponse));

      component.loadTransactions(false);
      tick(600);

      expect(component.transactions.length).toBe(1);
    }));

    it('should handle errors', fakeAsync(() => {
      const error = { error: { message: 'Server error' } };
      transactionService.getTransactionReport.and.returnValue(throwError(() => error));
      commonService.handleError.and.returnValue('Server error');

      component.loadTransactions(false);
      tick(600);

      expect(commonService.handleError).toHaveBeenCalledWith(error);
      expect(commonService.showError).toHaveBeenCalledWith('Server error');
      expect(component.loading).toBe(false);
      expect(component.hasMore).toBe(false);
    }));

    it('should not load if already loading', () => {
      component.loading = true;
      const callCount = transactionService.getTransactionReport.calls.count();
      
      component.loadTransactions(false);
      
      expect(transactionService.getTransactionReport.calls.count()).toBe(callCount);
    });

    it('should not load if already loadingMore', () => {
      component.loadingMore = true;
      const callCount = transactionService.getTransactionReport.calls.count();
      
      component.loadTransactions(true);
      
      expect(transactionService.getTransactionReport.calls.count()).toBe(callCount);
    });
  });

  describe('buildRequest', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should build request with page number and size', () => {
      const request = component.buildRequest();
      expect(request.pageNumber).toBe(1);
      expect(request.pageSize).toBe(20);
    });

    it('should include agentId if provided', () => {
      component.filterForm.patchValue({ agentId: 'agent-123' });
      const request = component.buildRequest();
      expect(request.agentId).toBe('agent-123');
    });

    it('should include locationId if provided', () => {
      component.filterForm.patchValue({ locationId: 'location-456' });
      const request = component.buildRequest();
      expect(request.locationId).toBe('location-456');
    });

    it('should not include empty filters', () => {
      component.filterForm.patchValue({ agentId: '', locationId: '' });
      const request = component.buildRequest();
      expect(request.agentId).toBeUndefined();
      expect(request.locationId).toBeUndefined();
    });
  });

  describe('onSearch', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should reset page to 1 and load transactions', () => {
      component.currentPage = 5;
      component.onSearch();
      expect(component.currentPage).toBe(1);
      expect(transactionService.getTransactionReport).toHaveBeenCalled();
    });

    it('should reset hasMore flag', () => {
      component.hasMore = false;
      component.onSearch();
      expect(component.hasMore).toBe(true);
    });
  });

  describe('onReset', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should clear all form fields', () => {
      component.filterForm.patchValue({
        agentId: 'agent-123',
        locationId: 'location-456',
        transactionType: 'SM'
      });

      component.onReset();

      expect(component.filterForm.get('agentId')?.value).toBe('');
      expect(component.filterForm.get('locationId')?.value).toBe('');
      expect(component.filterForm.get('transactionType')?.value).toBe('');
    });

    it('should reset to first page and reload', () => {
      component.currentPage = 5;
      component.onReset();
      expect(component.currentPage).toBe(1);
      expect(transactionService.getTransactionReport).toHaveBeenCalled();
    });
  });

  describe('exportToCSV', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should export transactions to CSV', () => {
      component.transactions = [mockTransaction];
      
      component.exportToCSV();
      expect(transactionService.exportToCSV).toHaveBeenCalled();
      expect(commonService.showSuccess).toHaveBeenCalledWith('Transactions exported successfully');
    });

    it('should show error if no transactions to export', () => {
      component.transactions = [];
      component.exportToCSV();
      expect(commonService.showError).toHaveBeenCalledWith('No data to export');
      expect(transactionService.exportToCSV).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should call authService.logout', () => {
      component.logout();
      expect(authService.logout).toHaveBeenCalled();
    });
  });

  describe('formatCurrency', () => {
    it('should format string amount correctly', () => {
      const result = component.formatCurrency('100,50');
      expect(result).toBe('€ 100.50');
    });

    it('should format number amount correctly', () => {
      const result = component.formatCurrency(100.50);
      expect(result).toBe('€ 100.50');
    });
  });

  describe('getRiskClass', () => {
    it('should return risk-low for Low risk', () => {
      expect(component.getRiskClass('Low')).toBe('risk-low');
    });

    it('should return risk-medium for Medium risk', () => {
      expect(component.getRiskClass('Medium')).toBe('risk-medium');
    });

    it('should return risk-high for High risk', () => {
      expect(component.getRiskClass('High')).toBe('risk-high');
    });

    it('should return empty string for unknown risk', () => {
      expect(component.getRiskClass('Unknown')).toBe('');
    });

    it('should be case insensitive', () => {
      expect(component.getRiskClass('low')).toBe('risk-low');
      expect(component.getRiskClass('MEDIUM')).toBe('risk-medium');
    });
  });

  describe('getStatusClass', () => {
    it('should return status-completed for OK status', () => {
      expect(component.getStatusClass('OK')).toBe('status-completed');
    });

    it('should return status-pending for PENDING status', () => {
      expect(component.getStatusClass('PENDING')).toBe('status-pending');
    });

    it('should return status-failed for ERROR status', () => {
      expect(component.getStatusClass('ERROR')).toBe('status-failed');
    });

    it('should return status-failed for FAILED status', () => {
      expect(component.getStatusClass('FAILED')).toBe('status-failed');
    });

    it('should return status-cancelled for CANCELLED status', () => {
      expect(component.getStatusClass('CANCELLED')).toBe('status-cancelled');
    });

    it('should be case insensitive', () => {
      expect(component.getStatusClass('ok')).toBe('status-completed');
      expect(component.getStatusClass('pending')).toBe('status-pending');
    });
  });

  describe('getRiskIcon', () => {
    it('should return check_circle for Low risk', () => {
      expect(component.getRiskIcon('Low')).toBe('check_circle');
    });

    it('should return warning for Medium risk', () => {
      expect(component.getRiskIcon('Medium')).toBe('warning');
    });

    it('should return error for High risk', () => {
      expect(component.getRiskIcon('High')).toBe('error');
    });

    it('should return help for unknown risk', () => {
      expect(component.getRiskIcon('Unknown')).toBe('help');
    });
  });

  describe('formatDate', () => {
    it('should call commonService.formatDate', () => {
      component.formatDate('2024-01-01');
      expect(commonService.formatDate).toHaveBeenCalledWith('2024-01-01');
    });
  });
});
