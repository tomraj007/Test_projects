import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse } from '../models/auth.model';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = environment.apiEndpoints.userManagement;
  private readonly TOKEN_KEY = 'accessToken';
  private readonly EXPIRY_KEY = 'expiryDate';
  private readonly CSRF_KEY = 'csrfToken';
  private readonly USER_KEY = 'userInfo';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.checkTokenExpiry();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    // Encode credentials to base64 as per Postman example
    const encodedCredentials = {
      username: btoa(credentials.username),
      password: btoa(credentials.password)
    };

    return this.http.post<LoginResponse>(`${this.API_URL}/login`, encodedCredentials).pipe(
      tap(response => {
        this.storeAuthData(response);
        this.isAuthenticatedSubject.next(true);
        this.scheduleTokenExpiryCheck(response.expiryDate);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.EXPIRY_KEY);
    localStorage.removeItem(this.CSRF_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getCsrfToken(): string | null {
    return localStorage.getItem(this.CSRF_KEY);
  }

  getUserInfo(): any {
    const userInfo = localStorage.getItem(this.USER_KEY);
    if (!userInfo || userInfo === 'undefined') {
      return null;
    }
    try {
      return JSON.parse(userInfo);
    } catch (e) {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return this.hasValidToken();
  }

  private storeAuthData(response: LoginResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.accessToken);
    localStorage.setItem(this.EXPIRY_KEY, response.expiryDate);
    localStorage.setItem(this.CSRF_KEY, response.csrfToken);
    const userInfo = {
      userName: response.userName,
      email: response.email,
      companyId: response.companyId,
      roles: response.roles,
      isFirstTimeLogin: response.isFirstTimeLogin
    };
    localStorage.setItem(this.USER_KEY, JSON.stringify(userInfo));
  }

  private hasValidToken(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const expiry = localStorage.getItem(this.EXPIRY_KEY);
    
    if (!token || !expiry) {
      return false;
    }

    const expiryDate = new Date(expiry);
    return expiryDate > new Date();
  }

  private checkTokenExpiry(): void {
    const expiry = localStorage.getItem(this.EXPIRY_KEY);
    if (expiry) {
      this.scheduleTokenExpiryCheck(expiry);
    }
  }

  private scheduleTokenExpiryCheck(expiryDate: string): void {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const timeout = expiry.getTime() - now.getTime();

    if (timeout > 0) {
      setTimeout(() => {
        this.logout();
        alert('Your session has expired. Please login again.');
      }, timeout);
    }
  }
}
