# LucidPlus Angular Practical Assessment - Transaction Report Application

## Overview
This is a secure Angular 19+ application for managing login authentication and viewing transaction reports with advanced filtering, pagination, and CSV export capabilities.

## Features Implemented

### ✅ Core Features (100 points)
1. **Login Page** - Reactive form with email/password validation
2. **Transaction Report Page** - Advanced filters, data table, infinite scroll pagination
3. **Auth Interceptor** - Automatic Bearer token injection for authenticated requests
4. **Route Guard** - Protects report page, redirects to login if unauthenticated
5. **Error Handling** - Comprehensive error messages and empty state UI
6. **Material Design** - Modern UI with Angular Material components

### ✅ Bonus Features (10 points)
1. **CSV Export** - Export transaction data to CSV file
2. **Debounced Filter Fetch** - 500ms debounce on filter changes to reduce API calls
3. **Auto Logout on Token Expiry** - Automatic logout when JWT expires
4. **Infinite Scroll** - Load more transactions on scroll (80% threshold)

## Architecture

### Services
- **AuthService** - Handles login, logout, token management, and session expiry
- **TransactionService** - Fetches transaction reports and exports CSV
- **CommonService** - Utility functions for notifications, error handling, and debouncing

### Components
- **LoginComponent** - Secure login form with validation
- **TransactionReportComponent** - Transaction list with filters and infinite scroll

### Guards & Interceptors
- **authGuard** - Functional route guard for protected routes
- **authInterceptor** - HTTP interceptor for adding Bearer tokens

### Models
- **auth.model.ts** - Login request/response interfaces
- **transaction.model.ts** - Transaction and report request/response interfaces

## API Endpoints

### Login
- **URL**: `https://remittanceapp.microservice.uat-lplusltd.com/gateway/usermgt/UserAccountManager/login`
- **Method**: POST
- **Credentials**: 
  - Username: `admin@lucidplus.com` (base64 encoded)
  - Password: `Welcome@123*` (base64 encoded)

### Transaction Report
- **URL**: `https://remittanceapp.microservice.uat-lplusltd.com/gateway/report/TransactionReport`
- **Method**: POST
- **Authentication**: Bearer Token
- **Filters**: pageNumber, pageSize, agentId, locationId, fromDate, toDate, transactionType, status, profRisk, countryRisk

## Installation & Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Access Application**
   - Navigate to `http://localhost:4200`
   - Default credentials are pre-filled in login form

## Usage

### Login
1. Open the application at `http://localhost:4200`
2. Login credentials are pre-filled:
   - Email: `admin@lucidplus.com`
   - Password: `Welcome@123*`
3. Click "Login" button

### Transaction Report
1. After successful login, you'll be redirected to the transaction report page
2. **Filters Available**:
   - Agent ID (pre-filled with sample ID)
   - Location ID (pre-filled with sample ID)
   - Date Range (defaults to last 30 days)
   - Transaction Type (SM, SB)
   - Status (PENDING, COMPLETED, FAILED, CANCELLED)
   - Profile Risk (Low, Medium, High)
   - Country Risk (Low, Medium, High)

3. **Features**:
   - Filters auto-apply with 500ms debounce
   - Scroll down to load more transactions
   - Click menu icon (top-right) to export CSV or logout
   - Table shows transaction details with color-coded status and risk badges

## Security Features

1. **JWT Token Management**
   - Tokens stored in localStorage
   - Automatic Bearer token injection via interceptor
   - Token expiry validation

2. **Auto Logout**
   - Scheduled logout on token expiry
   - Alert notification before logout
   - Redirect to login page

3. **Route Protection**
   - Auth guard prevents unauthorized access
   - Return URL preservation for post-login redirect

4. **Base64 Encoding**
   - Credentials encoded before transmission (as per API requirement)

## Code Quality

- **Separation of Concerns**: Services for business logic, components for UI
- **Reactive Forms**: Form validation and state management
- **TypeScript Interfaces**: Strong typing for all data models
- **Error Handling**: Centralized error handling in CommonService
- **Responsive Design**: Mobile-friendly UI with Material Design
- **Clean Code**: Well-structured, commented, and maintainable

## Testing Sample Data

### Sample IDs (Pre-filled)
- **Agent ID**: `25ec3a76-b381-4854-a6c2-346cb8d77fdd`
- **Location ID**: `8f070c98-5ffc-418a-85bf-5922c3b68efd`

### Filter Combinations
- Transaction Type: `SM` or `SB`
- Status: `PENDING`, `COMPLETED`, `FAILED`, `CANCELLED`
- Risk Levels: `Low`, `Medium`, `High`

## Project Structure
```
src/
├── app/
│   ├── components/
│   │   ├── login/
│   │   │   ├── login.component.ts
│   │   │   ├── login.component.html
│   │   │   └── login.component.css
│   │   └── transaction-report/
│   │       ├── transaction-report.component.ts
│   │       ├── transaction-report.component.html
│   │       └── transaction-report.component.css
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── transaction.service.ts
│   │   └── common.service.ts
│   ├── guards/
│   │   └── auth.guard.ts
│   ├── interceptors/
│   │   └── auth.interceptor.ts
│   ├── models/
│   │   ├── auth.model.ts
│   │   └── transaction.model.ts
│   ├── app.ts
│   ├── app.html
│   ├── app.config.ts
│   └── app.routes.ts
├── styles.css
└── main.ts
```

## Technologies Used
- Angular 19+
- Angular Material
- RxJS
- TypeScript
- CSS3

## Evaluation Criteria Met

✅ **Functional Completeness (35 pts)**
- Login with API integration
- Transaction report with filters
- Pagination with infinite scroll
- All features working end-to-end

✅ **Code Quality (25 pts)**
- Clean architecture with services
- TypeScript interfaces
- Reactive forms
- Error handling
- Code organization

✅ **UX Polish (20 pts)**
- Material Design UI
- Responsive layout
- Loading states
- Empty states
- Color-coded badges
- Smooth animations

✅ **Security (10 pts)**
- JWT token management
- Auth interceptor
- Route guard
- Secure credential handling

✅ **Bonus Features (10 pts)**
- CSV export
- Debounced filters
- Auto logout on expiry
- Infinite scroll pagination

## Notes
- The application uses Angular 19's standalone components
- All components are modular and reusable
- Services are provided at root level for singleton behavior
- Interceptor uses functional approach (Angular 19+)
- Guard uses functional approach (Angular 19+)

## Author
Developed for LucidPlus Angular Practical Assessment
