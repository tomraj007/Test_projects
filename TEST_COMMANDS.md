# Test Commands Guide

## Available Test Commands

### 1. Default Test (Interactive with Browser)
```bash
npm test
```
- Opens Chrome browser automatically
- Watch mode enabled (re-runs on file changes)
- Shows Jasmine test runner in browser
- **Best for**: Development and debugging
- **Browser URL**: http://localhost:9876/

### 2. Test with Watch Mode
```bash
npm run test:watch
```
- Same as `npm test`
- Explicitly opens Chrome browser
- Watches for file changes
- **Best for**: Active development

### 3. Headless Test (No Browser UI)
```bash
npm run test:headless
```
- Runs in ChromeHeadless (no UI)
- Single run (no watch mode)
- Faster execution
- **Best for**: Quick test runs

### 4. CI/CD Test
```bash
npm run test:ci
```
- Runs in ChromeHeadless
- Generates code coverage report
- No sandbox mode (for CI environments)
- **Best for**: Continuous Integration pipelines

## Test Configuration

### Karma Configuration (`karma.conf.js`)
- **Port**: 9876
- **Default Browser**: Chrome
- **Auto Watch**: true
- **Single Run**: false (for `npm test`)

### Browser Access
When running `npm test` or `npm run test:watch`, the test runner will be available at:
```
http://localhost:9876/
```

The browser will open automatically with a unique session ID:
```
http://localhost:9876/?id=103732
```

## Test Results

### In Browser
- Navigate to http://localhost:9876/
- View detailed test results
- See individual test specs
- Debug failing tests

### In Terminal
- See summary of test results
- View pass/fail counts
- See error messages

## Debugging Tests

### 1. Open Browser DevTools
```bash
npm test
# Browser opens automatically
# Press F12 to open DevTools
# Go to Sources tab to set breakpoints
```

### 2. Add `debugger` Statement
```typescript
it('should do something', () => {
  debugger; // Execution will pause here
  expect(something).toBe(true);
});
```

### 3. Run Specific Test File
```bash
npm test -- --include='**/auth.service.spec.ts'
```

### 4. Filter Tests by Name
In the browser test runner, use the search box to filter tests.

## Code Coverage

### Generate Coverage Report
```bash
npm run test:ci
```

### View Coverage Report
After running tests with coverage, open:
```
coverage/Test_project/index.html
```

### Coverage Thresholds
- Statements: > 80%
- Branches: > 75%
- Functions: > 80%
- Lines: > 80%

## Common Issues

### Issue: Browser doesn't open
**Solution**: 
```bash
# Check if Chrome is installed
# Try running with explicit browser flag
npm test -- --browsers=Chrome
```

### Issue: Port 9876 already in use
**Solution**:
```bash
# Kill existing Karma process
# Or change port in karma.conf.js
```

### Issue: Tests timeout
**Solution**:
Increase timeout in `karma.conf.js`:
```javascript
browserNoActivityTimeout: 60000
```

### Issue: ChromeHeadless fails on CI
**Solution**:
Use ChromeHeadlessCI with no-sandbox flag:
```bash
npm run test:ci
```

## Test File Patterns

All test files follow the pattern: `*.spec.ts`

### Service Tests
- `auth.service.spec.ts`
- `common.service.spec.ts`
- `transaction.service.spec.ts`

### Component Tests
- `login.component.spec.ts`
- `transaction-report.component.spec.ts`

### Interceptor Tests
- `auth.interceptor.spec.ts`

## Best Practices

1. **Use `npm test` for development** - Interactive browser debugging
2. **Use `npm run test:headless` for quick checks** - Fast feedback
3. **Use `npm run test:ci` in CI/CD** - Automated testing with coverage
4. **Keep browser open** - Faster re-runs in watch mode
5. **Use descriptive test names** - Easy to identify failures
6. **Test both success and error paths** - Complete coverage

## Continuous Integration

### GitHub Actions Example
```yaml
- name: Run Tests
  run: npm run test:ci
  
- name: Upload Coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/Test_project/lcov.info
```

### GitLab CI Example
```yaml
test:
  script:
    - npm run test:ci
  coverage: '/Statements\s+:\s+(\d+\.\d+)%/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/Test_project/cobertura-coverage.xml
```

## Quick Reference

| Command | Browser | Watch | Coverage | Use Case |
|---------|---------|-------|----------|----------|
| `npm test` | Chrome (opens) | ✅ | ❌ | Development |
| `npm run test:watch` | Chrome (opens) | ✅ | ❌ | Development |
| `npm run test:headless` | Headless | ❌ | ❌ | Quick check |
| `npm run test:ci` | Headless | ❌ | ✅ | CI/CD |

---

**Current Test Status**: 106/117 passing (90.6%)
**Last Updated**: November 2, 2025
