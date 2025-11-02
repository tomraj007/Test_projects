# Transaction Report Application

A comprehensive Angular application for managing and viewing transaction reports with advanced filtering, infinite scrolling, risk assessment, and CSV export capabilities.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Building](#building)
- [Testing](#testing)
- [Features](#features)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software

1. **Node.js** (v18.x or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** (v9.x or higher)
   - Comes with Node.js
   - Verify installation: `npm --version`

3. **Angular CLI** (v20.x or higher)
   - Install globally: `npm install -g @angular/cli`
   - Verify installation: `ng version`

### Optional Software

- **Git** - For version control
- **Visual Studio Code** - Recommended IDE
- **Chrome Browser** - For running tests

### Check Your Environment

Run these commands to verify your setup:

```bash
node --version    # Should output v18.x or higher
npm --version     # Should output 9.x or higher
ng version        # Should output Angular CLI 20.x or higher
```

---

## Installation

### Step 1: Clone or Download the Project

**Option A: Using Git**
```bash
git clone <repository-url>
cd Test_project
```

**Option B: Download ZIP**
1. Download the project ZIP file
2. Extract to your desired location
3. Open terminal/command prompt in the extracted folder

### Step 2: Install Dependencies

Navigate to the project directory and run:

```bash
npm install
```

This command will install all required dependencies including:
- Angular framework (v20.x)
- Angular Material (v20.x)
- RxJS (v7.8.x)
- Zone.js (v0.15.x)
- Testing frameworks (Jasmine, Karma)
- And all other dependencies listed in `package.json`

**Installation may take 2-5 minutes depending on your internet speed.**

### Step 3: Verify Installation

Check if all packages were installed correctly:

```bash
npm list --depth=0
```

You should see a list of installed packages without any errors.

### Step 4: Verify Project Setup

Run a quick build to ensure everything is set up correctly:

```bash
ng build
```

If successful, you'll see:
```
Application bundle generation complete.
```

---

## Running the Application

### Development Server

Start the development server:

```bash
npm start
```

Or:

```bash
ng serve
```

**The application will be available at:** `http://localhost:4200/`

The application will automatically reload when you modify source files.

### Development Server Options

**Open browser automatically:**
```bash
ng serve --open
```

**Use a different port:**
```bash
ng serve --port 4300
```

**Run in production mode locally:**
```bash
ng serve --configuration production
```

### Default Login Credentials

For testing purposes, you can use:
- **Email:** `admin@lucidplus.com`
- **Password:** `Welcome@123*`

*(Note: These are commented out in the code. Uncomment lines 52-53 in `login.component.ts` for auto-fill)*

---

## Building

### Development Build

Build the project for development:

```bash
npm run build
```

Or:

```bash
ng build
```

**Output:** `dist/Test_project/`

### Production Build

Build the project for production with optimizations:

```bash
ng build -c production
```

Or:

```bash
ng build --configuration production
```

**Features of Production Build:**
- ✅ Minification and uglification
- ✅ Tree shaking (removes unused code)
- ✅ AOT (Ahead-of-Time) compilation
- ✅ Output hashing for cache busting
- ✅ Environment variable replacement
- ✅ Optimized bundle size

**Output:** `dist/Test_project/`

### Build with Source Maps

For debugging production builds:

```bash
ng build --source-map
```

### Watch Mode (Continuous Build)

Automatically rebuild on file changes:

```bash
npm run watch
```

Or:

```bash
ng build --watch --configuration development
```

### Build Output Example

```
Initial chunk files       | Names         | Raw size | Estimated transfer size
main-XXXXXX.js           | main          | 861.78 kB | 187.40 kB
styles-XXXXXX.css        | styles        | 104.07 kB | 7.76 kB

Initial total            | 965.86 kB | 195.16 kB

Application bundle generation complete.
Output location: dist/Test_project
```

---

## Testing

### Run All Tests (Interactive Mode)

Runs tests in Chrome browser with watch mode:

```bash
npm test
```

- Opens Chrome browser automatically
- Test runner available at: `http://localhost:9876/`
- Watches for file changes and re-runs tests
- Best for development and debugging

### Run Tests in Watch Mode

```bash
npm run test:watch
```

Same as `npm test` - keeps browser open and watches for changes.

### Run Tests in Headless Mode

Runs tests without opening browser (faster):

```bash
npm run test:headless
```

- No browser UI
- Single run (no watch mode)
- Best for quick test checks

### Run Tests with Code Coverage

Generates code coverage report:

```bash
npm run test:ci
```

- Runs in headless mode
- Generates coverage report
- Coverage report location: `coverage/Test_project/index.html`
- Best for CI/CD pipelines

### Test Results

**Current Test Status:**
- **Total Tests:** 117
- **Passing:** 106 ✅
- **Failing:** 11 ⚠️
- **Success Rate:** 90.6%

**Test Coverage:**
- Services: 100% (48/48 passing)
- Interceptors: 100% (8/8 passing)
- Components: 78% (36/47 passing)

### Debugging Tests

1. Run `npm test`
2. Chrome browser opens automatically
3. Press F12 to open DevTools
4. Go to Sources tab
5. Set breakpoints in your test files
6. Refresh browser to re-run tests

### Run Specific Test File

```bash
npm test -- --include='**/auth.service.spec.ts'
```

---

## Features

### Authentication
- ✅ Email/password login with validation
- ✅ JWT token management
- ✅ Auto-logout on token expiry
- ✅ Protected routes with auth guard
- ✅ HTTP interceptor for automatic auth headers
- ✅ Session persistence

### Transaction Report
- ✅ Advanced filtering:
  - Agent ID
  - Location ID
  - Date range (From/To)
  - Profile Risk (Low, Medium, High)
  - Country Risk (Low, Medium, High)
- ✅ Infinite scroll pagination (20 records per page)
- ✅ Real-time search
- ✅ CSV export functionality
- ✅ Risk assessment badges with icons
- ✅ Alert indicators
- ✅ Responsive table design
- ✅ Loading states with spinners
- ✅ Empty states

### UI/UX
- ✅ Material Design components
- ✅ Responsive layout (mobile-friendly)
- ✅ Toast notifications (success, error, info)
- ✅ Loading indicators
- ✅ Form validation with error messages
- ✅ Smooth animations
- ✅ Professional styling

---

## Project Structure

```
Test_project/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── login/                    # Login component
│   │   │   │   ├── login.component.ts
│   │   │   │   ├── login.component.html
│   │   │   │   ├── login.component.css
│   │   │   │   └── login.component.spec.ts
│   │   │   └── transaction-report/       # Transaction report component
│   │   │       ├── transaction-report.component.ts
│   │   │       ├── transaction-report.component.html
│   │   │       ├── transaction-report.component.css
│   │   │       └── transaction-report.component.spec.ts
│   │   ├── services/
│   │   │   ├── auth.service.ts           # Authentication service
│   │   │   ├── common.service.ts         # Common utilities
│   │   │   └── transaction.service.ts    # Transaction API service
│   │   ├── interceptors/
│   │   │   └── auth.interceptor.ts       # HTTP auth interceptor
│   │   ├── guards/
│   │   │   └── auth.guard.ts             # Route protection
│   │   ├── models/
│   │   │   ├── auth.model.ts             # Auth interfaces
│   │   │   └── transaction.model.ts      # Transaction interfaces
│   │   ├── app.ts                        # Root component
│   │   ├── app.config.ts                 # App configuration
│   │   └── app.routes.ts                 # Routing
│   ├── environments/
│   │   ├── environment.ts                # Dev environment
│   │   └── environment.prod.ts           # Prod environment
│   ├── styles.css                        # Global styles
│   └── main.ts                           # App entry point
├── dist/                                 # Build output (generated)
├── coverage/                             # Test coverage (generated)
├── node_modules/                         # Dependencies (generated)
├── angular.json                          # Angular config
├── package.json                          # NPM dependencies
├── tsconfig.json                         # TypeScript config
├── karma.conf.js                         # Test config
└── README.md                             # This file
```

---

## Configuration

### Environment Variables

**Development (`src/environments/environment.ts`):**
```typescript
export const environment = {
  production: false,
  apiUrl: '/api/gateway',
  apiEndpoints: {
    userManagement: '/api/gateway/usermgt/UserAccountManager',
    report: '/api/gateway/report'
  }
};
```

**Production (`src/environments/environment.prod.ts`):**
```typescript
export const environment = {
  production: true,
  apiUrl: '/api/gateway',
  apiEndpoints: {
    userManagement: '/api/gateway/usermgt/UserAccountManager',
    report: '/api/gateway/report'
  }
};
```

### API Endpoints

1. **Login:** `POST /api/gateway/usermgt/UserAccountManager/login`
2. **Transaction Report:** `POST /api/gateway/report/getTransactionReport`

### Customizing Configuration

To change API URLs:
1. Edit `src/environments/environment.ts` for development
2. Edit `src/environments/environment.prod.ts` for production
3. Rebuild the application

---

## Deployment

### Build for Production

```bash
ng build -c production
```

### Deploy to Web Server

1. Build the application (see above)
2. Copy contents of `dist/Test_project/` to your web server
3. Configure server for SPA routing

### Server Configuration

**Apache (.htaccess):**
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

**Nginx:**
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

### Deploy to Cloud Platforms

**Vercel/Netlify:**
- Build command: `ng build -c production`
- Output directory: `dist/Test_project`

**AWS S3:**
```bash
aws s3 sync dist/Test_project/ s3://your-bucket-name --delete
```

---

## Troubleshooting

### Issue: `npm install` fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: Port 4200 already in use

**Solution:**
```bash
# Use a different port
ng serve --port 4300

# Or kill the process (Windows)
netstat -ano | findstr :4200
taskkill /PID <PID> /F

# Or kill the process (Linux/Mac)
lsof -ti:4200 | xargs kill -9
```

### Issue: Build fails with memory error

**Solution:**
```bash
# Increase Node.js memory limit
set NODE_OPTIONS=--max_old_space_size=4096
ng build
```

### Issue: Tests fail to run

**Solution:**
```bash
# Ensure Chrome is installed
# Clear Angular cache
rm -rf .angular/cache

# Reinstall dependencies
npm install

# Run tests
npm test
```

### Issue: Module not found errors

**Solution:**
```bash
# Reinstall dependencies
npm install

# Or use legacy peer deps
npm install --legacy-peer-deps
```

---

## NPM Scripts Reference

| Command | Description |
|---------|-------------|
| `npm start` | Start development server |
| `npm run build` | Build for development |
| `npm run watch` | Build in watch mode |
| `npm test` | Run tests (opens browser) |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:headless` | Run tests without browser |
| `npm run test:ci` | Run tests with coverage |

---

## Technology Stack

- **Framework:** Angular 20.x
- **UI Library:** Angular Material 20.x
- **Language:** TypeScript 5.8.x
- **Styling:** CSS3
- **State Management:** RxJS 7.8.x
- **Testing:** Jasmine 5.8.x + Karma 6.4.x
- **Build Tool:** Angular CLI 20.x

---

## Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

---

## Additional Resources

- **Angular Documentation:** https://angular.dev/
- **Angular Material:** https://material.angular.io/
- **RxJS Documentation:** https://rxjs.dev/
- **TypeScript Documentation:** https://www.typescriptlang.org/

### Project Documentation

- `TESTING.md` - Comprehensive testing guide
- `TEST_COMMANDS.md` - Test commands reference
- `TEST_STATUS.md` - Current test status
- `FINAL_TEST_REPORT.md` - Detailed test report
- `src/environments/README.md` - Environment configuration guide

---

## Support

For issues and questions:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review project documentation files
3. Check Angular CLI documentation

---

## Version

**Current Version:** 1.0.0

**Last Updated:** November 2, 2025

---

**Generated with [Angular CLI](https://github.com/angular/angular-cli) version 20.1.5**
