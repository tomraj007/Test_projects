import { TestBed } from '@angular/core/testing';
import { provideZoneChangeDetection } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from './common.service';

describe('CommonService', () => {
  let service: CommonService;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      providers: [
        provideZoneChangeDetection(),
        CommonService,
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    });

    service = TestBed.inject(CommonService);
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('showSuccess', () => {
    it('should display success message with default duration', () => {
      const message = 'Success message';
      service.showSuccess(message);

      expect(snackBar.open).toHaveBeenCalledWith(message, 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['success-snackbar']
      });
    });

    it('should display success message with custom duration', () => {
      const message = 'Success message';
      const duration = 5000;
      service.showSuccess(message, duration);

      expect(snackBar.open).toHaveBeenCalledWith(message, 'Close', {
        duration: 5000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['success-snackbar']
      });
    });
  });

  describe('showError', () => {
    it('should display error message with default duration', () => {
      const message = 'Error message';
      service.showError(message);

      expect(snackBar.open).toHaveBeenCalledWith(message, 'Close', {
        duration: 5000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
    });

    it('should display error message with custom duration', () => {
      const message = 'Error message';
      const duration = 10000;
      service.showError(message, duration);

      expect(snackBar.open).toHaveBeenCalledWith(message, 'Close', {
        duration: 10000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
    });
  });

  describe('showInfo', () => {
    it('should display info message with default duration', () => {
      const message = 'Info message';
      service.showInfo(message);

      expect(snackBar.open).toHaveBeenCalledWith(message, 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['info-snackbar']
      });
    });

    it('should display info message with custom duration', () => {
      const message = 'Info message';
      const duration = 4000;
      service.showInfo(message, duration);

      expect(snackBar.open).toHaveBeenCalledWith(message, 'Close', {
        duration: 4000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['info-snackbar']
      });
    });
  });

  describe('formatDate', () => {
    it('should format string date correctly', () => {
      const date = '2024-01-15T10:30:00';
      const result = service.formatDate(date);
      
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}/);
    });

    it('should format Date object correctly', () => {
      const date = new Date('2024-01-15T10:30:00');
      const result = service.formatDate(date);
      
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}/);
    });

    it('should return "N/A" for null date', () => {
      expect(service.formatDate(null as any)).toBe('N/A');
    });

    it('should return "N/A" for undefined date', () => {
      expect(service.formatDate(undefined as any)).toBe('N/A');
    });

    it('should return "N/A" for empty string', () => {
      expect(service.formatDate('')).toBe('N/A');
    });
  });

  describe('handleError', () => {
    it('should return error.error.message if available', () => {
      const error = {
        error: {
          message: 'Custom error message'
        }
      };

      expect(service.handleError(error)).toBe('Custom error message');
    });

    it('should return error.message if error.error.message is not available', () => {
      const error = {
        message: 'Error message'
      };

      expect(service.handleError(error)).toBe('Error message');
    });

    it('should return error.error string if it is a string', () => {
      const error = {
        error: 'String error'
      };

      expect(service.handleError(error)).toBe('String error');
    });

    it('should return default message for unknown error format', () => {
      const error = {};

      expect(service.handleError(error)).toBe('An unexpected error occurred. Please try again.');
    });

    it('should return default message for null error', () => {
      expect(service.handleError(null)).toBe('An unexpected error occurred. Please try again.');
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      jasmine.clock().install();
    });

    afterEach(() => {
      jasmine.clock().uninstall();
    });

    it('should debounce function calls', () => {
      const mockFn = jasmine.createSpy('mockFn');
      const debouncedFn = service.debounce(mockFn, 300);

      debouncedFn('arg1');
      debouncedFn('arg2');
      debouncedFn('arg3');

      expect(mockFn).not.toHaveBeenCalled();

      jasmine.clock().tick(300);

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('arg3');
    });

    it('should call function after delay', () => {
      const mockFn = jasmine.createSpy('mockFn');
      const debouncedFn = service.debounce(mockFn, 500);

      debouncedFn('test');

      jasmine.clock().tick(499);
      expect(mockFn).not.toHaveBeenCalled();

      jasmine.clock().tick(1);
      expect(mockFn).toHaveBeenCalledWith('test');
    });

    it('should reset timer on subsequent calls', () => {
      const mockFn = jasmine.createSpy('mockFn');
      const debouncedFn = service.debounce(mockFn, 300);

      debouncedFn('first');
      jasmine.clock().tick(200);
      
      debouncedFn('second');
      jasmine.clock().tick(200);
      
      expect(mockFn).not.toHaveBeenCalled();
      
      jasmine.clock().tick(100);
      
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('second');
    });
  });
});
