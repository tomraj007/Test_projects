import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideZoneChangeDetection } from '@angular/core';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';

describe('authInterceptor', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let mockRequest: HttpRequest<any>;
  let mockNext: HttpHandlerFn;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getToken', 'logout']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        provideZoneChangeDetection(),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    mockRequest = new HttpRequest('GET', '/api/test');
    mockNext = jasmine.createSpy('next').and.returnValue(of({}));
  });

  it('should add Authorization header when token exists and not login request', fakeAsync(() => {
    authService.getToken.and.returnValue('test-token');
    
    const interceptor = authInterceptor(mockRequest, mockNext);

    interceptor.subscribe(() => {
      expect(mockNext).toHaveBeenCalled();
      const callArgs = (mockNext as jasmine.Spy).calls.mostRecent().args[0] as HttpRequest<any>;
      expect(callArgs.headers.get('Authorization')).toBe('Bearer test-token');
    });
    tick();
  }));

  it('should not add Authorization header for login requests', fakeAsync(() => {
    authService.getToken.and.returnValue('test-token');
    const loginRequest = new HttpRequest('POST', '/api/login', {});
    
    const interceptor = authInterceptor(loginRequest, mockNext);

    interceptor.subscribe(() => {
      expect(mockNext).toHaveBeenCalled();
      const callArgs = (mockNext as jasmine.Spy).calls.mostRecent().args[0] as HttpRequest<any>;
      expect(callArgs.headers.has('Authorization')).toBe(false);
    });
    tick();
  }));

  it('should not add Authorization header when token does not exist', fakeAsync(() => {
    authService.getToken.and.returnValue(null);
    
    const interceptor = authInterceptor(mockRequest, mockNext);

    interceptor.subscribe(() => {
      expect(mockNext).toHaveBeenCalled();
      const callArgs = (mockNext as jasmine.Spy).calls.mostRecent().args[0] as HttpRequest<any>;
      expect(callArgs.headers.has('Authorization')).toBe(false);
    });
    tick();
  }));

  it('should handle 401 error by logging out and redirecting to login', fakeAsync(() => {
    authService.getToken.and.returnValue('test-token');
    const error401 = new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' });
    mockNext = jasmine.createSpy('next').and.returnValue(throwError(() => error401));
    
    const interceptor = authInterceptor(mockRequest, mockNext);

    interceptor.subscribe({
      next: () => fail('should have errored'),
      error: (error) => {
        expect(error.status).toBe(401);
        expect(authService.logout).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith(['/login']);
      }
    });
    tick();
  }));

  it('should not handle non-401 errors', fakeAsync(() => {
    authService.getToken.and.returnValue('test-token');
    const error500 = new HttpErrorResponse({ status: 500, statusText: 'Internal Server Error' });
    mockNext = jasmine.createSpy('next').and.returnValue(throwError(() => error500));
    
    const interceptor = authInterceptor(mockRequest, mockNext);

    interceptor.subscribe({
      next: () => fail('should have errored'),
      error: (error) => {
        expect(error.status).toBe(500);
        expect(authService.logout).not.toHaveBeenCalled();
        expect(router.navigate).not.toHaveBeenCalled();
      }
    });
    tick();
  }));

  it('should pass through successful requests', fakeAsync(() => {
    authService.getToken.and.returnValue('test-token');
    const mockResponse = new HttpResponse({ body: { data: 'test' } });
    mockNext = jasmine.createSpy('next').and.returnValue(of(mockResponse));
    
    const interceptor = authInterceptor(mockRequest, mockNext);

    interceptor.subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(mockNext).toHaveBeenCalled();
    });
    tick();
  }));

  it('should clone request with Authorization header', fakeAsync(() => {
    authService.getToken.and.returnValue('my-token-123');
    
    const interceptor = authInterceptor(mockRequest, mockNext);

    interceptor.subscribe(() => {
      const callArgs = (mockNext as jasmine.Spy).calls.mostRecent().args[0] as HttpRequest<any>;
      expect(callArgs).not.toBe(mockRequest); // Should be a cloned request
      expect(callArgs.headers.get('Authorization')).toBe('Bearer my-token-123');
    });
    tick();
  }));
});
