import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  hidePassword = true;
  returnUrl: string = '/report';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Redirect if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/report']);
      return;
    }

    this.loginForm = this.fb.group({
      // username: ['admin@lucidplus.com', [Validators.required, Validators.email]],
      // password: ['Welcome@123*', [Validators.required, Validators.minLength(6)]]
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Get return url from route parameters or default to '/report'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/report';
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.commonService.showError('Please fill in all required fields correctly');
      return;
    }

    this.loading = true;
    const credentials = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.commonService.showSuccess('Login successful!');
        this.router.navigate([this.returnUrl]);
      },
      error: (error) => {
        this.loading = false;
        const errorMessage = this.commonService.handleError(error);
        this.commonService.showError(errorMessage);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
