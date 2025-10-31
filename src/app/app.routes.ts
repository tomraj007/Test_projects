import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { TransactionReportComponent } from './components/transaction-report/transaction-report.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'report', component: TransactionReportComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/login' }
];
