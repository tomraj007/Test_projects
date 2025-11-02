import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideZoneChangeDetection } from '@angular/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { LoginRequest, LoginResponse } from '../models/auth.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: jasmine.SpyObj<Router>;
  let localStorageSpy: jasmine.Spy;

  const mockLoginResponse: LoginResponse = {
    accessToken: 'mock-token',
    expiryDate: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
    csrfToken: 'mock-csrf-token',
    userName: 'Test User',
    email: 'test@example.com',
    companyId: 'company-123',
    roles: ['USER'],
    isFirstTimeLogin: false,
    rolePermissions: []
  };

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        provideZoneChangeDetection(),
        AuthService,
        { provide: Router, useValue: routerSpy }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should login successfully and store auth data', fakeAsync(() => {
      const credentials: LoginRequest = {
        username: 'test@example.com',
        password: 'password123'
      };

      service.login(credentials).subscribe(response => {
        expect(response).toEqual(mockLoginResponse);
        expect(localStorage.getItem('accessToken')).toBe(mockLoginResponse.accessToken);
        expect(localStorage.getItem('csrfToken')).toBe(mockLoginResponse.csrfToken);
        expect(service.isAuthenticated()).toBe(true);
      });

      const req = httpMock.expectOne('/api/gateway/usermgt/UserAccountManager/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body.username).toBe(btoa(credentials.username));
      expect(req.request.body.password).toBe(btoa(credentials.password));
      req.flush(mockLoginResponse);
      tick();
    }));

    it('should encode credentials to base64', () => {
      const credentials: LoginRequest = {
        username: 'test@example.com',
        password: 'password123'
      };

      service.login(credentials).subscribe();

      const req = httpMock.expectOne('/api/gateway/usermgt/UserAccountManager/login');
      expect(req.request.body.username).toBe(btoa(credentials.username));
      expect(req.request.body.password).toBe(btoa(credentials.password));
      req.flush(mockLoginResponse);
    });

    it('should update authentication state on successful login', fakeAsync(() => {
      const credentials: LoginRequest = {
        username: 'test@example.com',
        password: 'password123'
      };

      let authState = false;
      service.isAuthenticated$.subscribe(isAuth => {
        authState = isAuth;
      });

      service.login(credentials).subscribe();

      const req = httpMock.expectOne('/api/gateway/usermgt/UserAccountManager/login');
      req.flush(mockLoginResponse);
      tick();
      
      expect(authState).toBe(true);
    }));
  });

  describe('logout', () => {
    beforeEach(() => {
      localStorage.setItem('accessToken', 'test-token');
      localStorage.setItem('expiryDate', new Date().toISOString());
      localStorage.setItem('csrfToken', 'test-csrf');
      localStorage.setItem('userInfo', JSON.stringify({ email: 'test@example.com' }));
    });

    it('should clear all auth data from localStorage', () => {
      service.logout();

      expect(localStorage.getItem('accessToken')).toBeNull();
      expect(localStorage.getItem('expiryDate')).toBeNull();
      expect(localStorage.getItem('csrfToken')).toBeNull();
      expect(localStorage.getItem('userInfo')).toBeNull();
    });

    it('should navigate to login page', () => {
      service.logout();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should update authentication state', fakeAsync(() => {
      let authState = true;
      service.isAuthenticated$.subscribe(isAuth => {
        authState = isAuth;
      });

      service.logout();
      tick();
      
      expect(authState).toBe(false);
    }));
  });

  describe('getToken', () => {
    it('should return token from localStorage', () => {
      localStorage.setItem('accessToken', 'test-token');
      expect(service.getToken()).toBe('test-token');
    });

    it('should return null if no token exists', () => {
      expect(service.getToken()).toBeNull();
    });
  });

  describe('getCsrfToken', () => {
    it('should return CSRF token from localStorage', () => {
      localStorage.setItem('csrfToken', 'test-csrf-token');
      expect(service.getCsrfToken()).toBe('test-csrf-token');
    });

    it('should return null if no CSRF token exists', () => {
      expect(service.getCsrfToken()).toBeNull();
    });
  });

  describe('getUserInfo', () => {
    it('should return parsed user info from localStorage', () => {
      const userInfo = { email: 'test@example.com', userName: 'Test User' };
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      
      expect(service.getUserInfo()).toEqual(userInfo);
    });

    it('should return null if userInfo is undefined string', () => {
      localStorage.setItem('userInfo', 'undefined');
      expect(service.getUserInfo()).toBeNull();
    });

    it('should return null if userInfo does not exist', () => {
      expect(service.getUserInfo()).toBeNull();
    });

    it('should return null if JSON parsing fails', () => {
      localStorage.setItem('userInfo', 'invalid-json');
      expect(service.getUserInfo()).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true if token is valid and not expired', () => {
      const futureDate = new Date(Date.now() + 3600000).toISOString();
      localStorage.setItem('accessToken', 'test-token');
      localStorage.setItem('expiryDate', futureDate);

      expect(service.isAuthenticated()).toBe(true);
    });

    it('should return false if token is expired', () => {
      const pastDate = new Date(Date.now() - 3600000).toISOString();
      localStorage.setItem('accessToken', 'test-token');
      localStorage.setItem('expiryDate', pastDate);

      expect(service.isAuthenticated()).toBe(false);
    });

    it('should return false if no token exists', () => {
      expect(service.isAuthenticated()).toBe(false);
    });

    it('should return false if no expiry date exists', () => {
      localStorage.setItem('accessToken', 'test-token');
      expect(service.isAuthenticated()).toBe(false);
    });
  });
});
