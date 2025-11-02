# Unit Testing Documentation

## Overview
This document provides information about the unit tests implemented for the Transaction Report Application.

## Test Coverage

### Services (3 test files)

#### 1. AuthService (`auth.service.spec.ts`)
**Test Coverage:**
- Service creation
- Login functionality
  - Successful login with credential encoding
  - Token storage
  - Authentication state updates
- Logout functionality
  - LocalStorage cleanup
  - Navigation to login page
  - State updates
- Token management
  - Get access token
  - Get CSRF token
  - Token validation
  - Token expiry checking
- User information
  - Get user info from localStorage
  - Handle invalid JSON
  - Handle undefined values

**Total Tests:** 18 test cases

#### 2. CommonService (`common.service.spec.ts`)
**Test Coverage:**
- Service creation
- Snackbar notifications
  - Success messages (default and custom duration)
  - Error messages (default and custom duration)
  - Info messages (default and custom duration)
- Date formatting
  - String dates
  - Date objects
  - Null/undefined handling
- Error handling
  - Different error formats
  - Default error messages
- Debounce utility
  - Function debouncing
  - Timer reset on subsequent calls

**Total Tests:** 17 test cases

#### 3. TransactionService (`transaction.service.spec.ts`)
**Test Coverage:**
- Service creation
- Transaction report fetching
  - Successful API calls
  - Request wrapping in DTO
  - Empty responses
  - HTTP error handling
- CSV export
  - Data export functionality
  - Empty data handling
  - Null data handling
  - CSV value escaping (commas and quotes)
  - Default filename

**Total Tests:** 13 test cases

### Interceptor (1 test file)

#### 4. AuthInterceptor (`auth.interceptor.spec.ts`)
**Test Coverage:**
- Authorization header injection
  - Add Bearer token for authenticated requests
  - Skip token for login requests
  - Handle missing tokens
- Error handling
  - 401 Unauthorized (logout and redirect)
  - Other HTTP errors (pass through)
- Request cloning
- Successful request pass-through

**Total Tests:** 8 test cases

### Components (2 test files)

#### 5. LoginComponent (`login.component.spec.ts`)
**Test Coverage:**
- Component creation
- Initialization
  - Form initialization
  - Redirect if authenticated
  - Return URL handling
  - Form validation (email, password, required fields)
- Form submission
  - Invalid form handling
  - Successful login flow
  - Loading state management
  - Error handling
  - Navigation after login
- Form getters
- Password visibility toggle

**Total Tests:** 18 test cases

#### 6. TransactionReportComponent (`transaction-report.component.spec.ts`)
**Test Coverage:**
- Component creation
- Initialization
  - User info loading
  - Filter form initialization
  - Initial transaction loading
- Transaction loading
  - Successful loading
  - Loading states (loading, loadingMore)
  - Append vs replace transactions
  - Error handling
  - Prevent duplicate loads
- Request building
  - Page number and size
  - Filter inclusion
  - Empty filter handling
- Search and reset
  - Search functionality
  - Reset form and reload
- CSV export
  - Export with data
  - Handle empty data
- Utility methods
  - Currency formatting
  - Risk class mapping
  - Status class mapping
  - Risk icon mapping
  - Date formatting
- Logout

**Total Tests:** 29 test cases

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Specific Test File
```bash
npm test -- --include='**/auth.service.spec.ts'
```

## Test Statistics

| Category | Files | Test Cases |
|----------|-------|------------|
| Services | 3 | 48 |
| Interceptors | 1 | 8 |
| Components | 2 | 47 |
| **Total** | **6** | **103** |

## Testing Tools & Libraries

- **Jasmine**: Testing framework
- **Karma**: Test runner
- **Angular Testing Utilities**: TestBed, ComponentFixture, etc.
- **HttpClientTestingModule**: For HTTP testing
- **NoopAnimationsModule**: For animation testing

## Test Best Practices Followed

1. **Arrange-Act-Assert Pattern**: All tests follow AAA pattern
2. **Isolated Tests**: Each test is independent
3. **Mock Dependencies**: All external dependencies are mocked
4. **Descriptive Names**: Test names clearly describe what is being tested
5. **Setup and Teardown**: Proper beforeEach and afterEach hooks
6. **Async Handling**: Proper handling of async operations with done() callbacks
7. **Error Cases**: Both success and error scenarios are tested
8. **Edge Cases**: Null, undefined, and empty values are tested

## Code Coverage Goals

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

## Continuous Integration

Tests should be run automatically on:
- Every commit
- Pull requests
- Before deployment

## Future Enhancements

1. Add E2E tests using Cypress or Playwright
2. Add visual regression tests
3. Add performance tests
4. Increase coverage to > 90%
5. Add mutation testing

## Troubleshooting

### Common Issues

1. **Tests failing due to timing**: Increase timeout or use fakeAsync/tick
2. **Module import errors**: Ensure all required modules are imported in TestBed
3. **Spy not being called**: Check if the spy is properly configured before the test

### Debug Mode

Run tests in debug mode:
```bash
npm test -- --browsers=Chrome --watch
```

Then open Chrome DevTools and set breakpoints in your test files.

## Contributing

When adding new features:
1. Write tests first (TDD approach recommended)
2. Ensure all tests pass
3. Maintain or improve code coverage
4. Update this documentation if needed
