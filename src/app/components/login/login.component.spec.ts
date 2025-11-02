import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideZoneChangeDetection } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { CommonService } from '../../services/common.service';
import { LoginResponse } from '../../models/auth.model';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let commonService: jasmine.SpyObj<CommonService>;
  let router: jasmine.SpyObj<Router>;
  let activatedRoute: any;

  const mockLoginResponse: LoginResponse = {
    accessToken: 'mock-token',
    expiryDate: new Date(Date.now() + 3600000).toISOString(),
    csrfToken: 'mock-csrf',
    userName: 'Test User',
    email: 'test@example.com',
    companyId: 'company-123',
    roles: ['USER'],
    isFirstTimeLogin: false,
    rolePermissions: []
  };

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'isAuthenticated']);
    const commonServiceSpy = jasmine.createSpyObj('CommonService', ['showSuccess', 'showError', 'handleError']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    
    activatedRoute = {
      snapshot: {
        queryParams: {}
      }
    };

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      providers: [
        provideZoneChangeDetection(),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: CommonService, useValue: commonServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    commonService = TestBed.inject(CommonService) as jasmine.SpyObj<CommonService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    
    authService.isAuthenticated.and.returnValue(false);
    
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize login form with empty fields', () => {
      fixture.detectChanges();
      
      expect(component.loginForm).toBeDefined();
      expect(component.loginForm.get('username')?.value).toBe('');
      expect(component.loginForm.get('password')?.value).toBe('');
    });

    it('should redirect to /report if already authenticated', () => {
      authService.isAuthenticated.and.returnValue(true);
      
      fixture.detectChanges();
      
      expect(router.navigate).toHaveBeenCalledWith(['/report']);
    });

    it('should set returnUrl from query params', () => {
      activatedRoute.snapshot.queryParams['returnUrl'] = '/custom-route';
      
      fixture.detectChanges();
      
      expect(component.returnUrl).toBe('/custom-route');
    });

    it('should use default returnUrl if not provided', () => {
      fixture.detectChanges();
      
      expect(component.returnUrl).toBe('/report');
    });

    it('should set username field as required and email validator', () => {
      fixture.detectChanges();
      
      const usernameControl = component.loginForm.get('username');
      expect(usernameControl?.hasError('required')).toBe(true);
      
      usernameControl?.setValue('invalid-email');
      expect(usernameControl?.hasError('email')).toBe(true);
      
      usernameControl?.setValue('valid@email.com');
      expect(usernameControl?.valid).toBe(true);
    });

    it('should set password field as required with minLength 6', () => {
      fixture.detectChanges();
      
      const passwordControl = component.loginForm.get('password');
      expect(passwordControl?.hasError('required')).toBe(true);
      
      passwordControl?.setValue('12345');
      expect(passwordControl?.hasError('minlength')).toBe(true);
      
      passwordControl?.setValue('123456');
      expect(passwordControl?.valid).toBe(true);
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should show error if form is invalid', () => {
      component.loginForm.patchValue({
        username: '',
        password: ''
      });
      
      component.onSubmit();
      
      expect(commonService.showError).toHaveBeenCalledWith('Please fill in all required fields correctly');
      expect(authService.login).not.toHaveBeenCalled();
    });

    it('should call authService.login with form values', () => {
      authService.login.and.returnValue(of(mockLoginResponse));
      
      component.loginForm.patchValue({
        username: 'test@example.com',
        password: 'password123'
      });
      
      component.onSubmit();
      
      expect(authService.login).toHaveBeenCalledWith({
        username: 'test@example.com',
        password: 'password123'
      });
    });

    it('should set loading to true during login', () => {
      authService.login.and.returnValue(of(mockLoginResponse));
      
      component.loginForm.patchValue({
        username: 'test@example.com',
        password: 'password123'
      });
      
      component.onSubmit();
      
      expect(component.loading).toBe(true);
    });

    it('should show success message and navigate on successful login', fakeAsync(() => {
      authService.login.and.returnValue(of(mockLoginResponse));
      
      component.loginForm.patchValue({
        username: 'test@example.com',
        password: 'password123'
      });
      
      component.onSubmit();
      tick();
      
      expect(commonService.showSuccess).toHaveBeenCalledWith('Login successful!');
      expect(router.navigate).toHaveBeenCalledWith(['/report']);
      expect(component.loading).toBe(false);
    }));

    it('should navigate to returnUrl on successful login', fakeAsync(() => {
      authService.login.and.returnValue(of(mockLoginResponse));
      component.returnUrl = '/custom-route';
      
      component.loginForm.patchValue({
        username: 'test@example.com',
        password: 'password123'
      });
      
      component.onSubmit();
      tick();
      
      expect(router.navigate).toHaveBeenCalledWith(['/custom-route']);
    }));

    it('should show error message on login failure', fakeAsync(() => {
      const error = { error: { message: 'Invalid credentials' } };
      authService.login.and.returnValue(throwError(() => error));
      commonService.handleError.and.returnValue('Invalid credentials');
      
      component.loginForm.patchValue({
        username: 'test@example.com',
        password: 'wrongpassword'
      });
      
      component.onSubmit();
      tick();
      
      expect(commonService.handleError).toHaveBeenCalledWith(error);
      expect(commonService.showError).toHaveBeenCalledWith('Invalid credentials');
      expect(component.loading).toBe(false);
      expect(router.navigate).not.toHaveBeenCalled();
    }));

    it('should set loading to false after login completes', fakeAsync(() => {
      authService.login.and.returnValue(of(mockLoginResponse));
      
      component.loginForm.patchValue({
        username: 'test@example.com',
        password: 'password123'
      });
      
      component.loading = true;
      component.onSubmit();
      tick();
      
      expect(component.loading).toBe(false);
    }));
  });

  describe('form getters', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should return username control', () => {
      const usernameControl = component.username;
      expect(usernameControl).toBe(component.loginForm.get('username'));
    });

    it('should return password control', () => {
      const passwordControl = component.password;
      expect(passwordControl).toBe(component.loginForm.get('password'));
    });
  });

  describe('hidePassword', () => {
    it('should initialize hidePassword as true', () => {
      fixture.detectChanges();
      expect(component.hidePassword).toBe(true);
    });
  });
});
