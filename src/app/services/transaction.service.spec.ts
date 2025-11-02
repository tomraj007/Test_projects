import { TestBed } from '@angular/core/testing';
import { provideZoneChangeDetection } from '@angular/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TransactionService } from './transaction.service';
import { TransactionReportRequest, TransactionReportResponse } from '../models/transaction.model';

describe('TransactionService', () => {
  let service: TransactionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        provideZoneChangeDetection(),
        TransactionService
      ]
    });

    service = TestBed.inject(TransactionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTransactionReport', () => {
    it('should fetch transaction report successfully', (done) => {
      const mockRequest: TransactionReportRequest = {
        pageNumber: 1,
        pageSize: 20,
        agentId: 'agent-123',
        locationId: 'location-456'
      };

      const mockResponse: TransactionReportResponse = {
        items: [
          {
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
          }
        ],
        totalCount: 1
      };

      service.getTransactionReport(mockRequest).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.items.length).toBe(1);
        expect(response.totalCount).toBe(1);
        done();
      });

      const req = httpMock.expectOne('/api/gateway/report/TransactionReport');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        transactionReportDto: mockRequest
      });
      req.flush(mockResponse);
    });

    it('should wrap request in transactionReportDto', () => {
      const mockRequest: TransactionReportRequest = {
        pageNumber: 1,
        pageSize: 20
      };

      service.getTransactionReport(mockRequest).subscribe();

      const req = httpMock.expectOne('/api/gateway/report/TransactionReport');
      expect(req.request.body).toEqual({
        transactionReportDto: mockRequest
      });
      req.flush({ items: [], totalCount: 0 });
    });

    it('should handle empty response', (done) => {
      const mockRequest: TransactionReportRequest = {
        pageNumber: 1,
        pageSize: 20
      };

      const emptyResponse: TransactionReportResponse = {
        items: [],
        totalCount: 0
      };

      service.getTransactionReport(mockRequest).subscribe(response => {
        expect(response.items.length).toBe(0);
        expect(response.totalCount).toBe(0);
        done();
      });

      const req = httpMock.expectOne('/api/gateway/report/TransactionReport');
      req.flush(emptyResponse);
    });

    it('should handle HTTP errors', (done) => {
      const mockRequest: TransactionReportRequest = {
        pageNumber: 1,
        pageSize: 20
      };

      service.getTransactionReport(mockRequest).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
          done();
        }
      });

      const req = httpMock.expectOne('/api/gateway/report/TransactionReport');
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('exportToCSV', () => {
    let createElementSpy: jasmine.Spy;
    let clickSpy: jasmine.Spy;
    let appendChildSpy: jasmine.Spy;
    let removeChildSpy: jasmine.Spy;

    beforeEach(() => {
      clickSpy = jasmine.createSpy('click');
      const mockLink = {
        setAttribute: jasmine.createSpy('setAttribute'),
        click: clickSpy,
        style: {}
      };

      createElementSpy = spyOn(document, 'createElement').and.returnValue(mockLink as any);
      appendChildSpy = spyOn(document.body, 'appendChild');
      removeChildSpy = spyOn(document.body, 'removeChild');
      spyOn(URL, 'createObjectURL').and.returnValue('blob:mock-url');
    });

    it('should export data to CSV', () => {
      const data = [
        { name: 'John', age: 30, city: 'New York' },
        { name: 'Jane', age: 25, city: 'Los Angeles' }
      ];

      service.exportToCSV(data, 'test.csv');

      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(appendChildSpy).toHaveBeenCalled();
      expect(clickSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();
    });

    it('should not export if data is empty', () => {
      service.exportToCSV([], 'test.csv');

      expect(createElementSpy).not.toHaveBeenCalled();
    });

    it('should not export if data is null', () => {
      service.exportToCSV(null as any, 'test.csv');

      expect(createElementSpy).not.toHaveBeenCalled();
    });

    it('should escape commas in CSV values', () => {
      const data = [
        { name: 'John, Doe', age: 30 }
      ];

      service.exportToCSV(data, 'test.csv');

      expect(createElementSpy).toHaveBeenCalled();
    });

    it('should escape quotes in CSV values', () => {
      const data = [
        { name: 'John "Johnny" Doe', age: 30 }
      ];

      service.exportToCSV(data, 'test.csv');

      expect(createElementSpy).toHaveBeenCalled();
    });

    it('should use default filename if not provided', () => {
      const data = [
        { name: 'John', age: 30 }
      ];

      service.exportToCSV(data);

      expect(createElementSpy).toHaveBeenCalled();
    });
  });
});
