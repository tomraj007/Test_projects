# Testing Guide - Transaction Report Application

## Quick Start Testing

### 1. Login Flow Test
1. Open `http://localhost:4200`
2. Verify login page displays with:
   - Email field (pre-filled: `admin@lucidplus.com`)
   - Password field (pre-filled: `Welcome@123*`)
   - Login button
3. Click "Login" button
4. Verify:
   - Loading spinner appears
   - Success notification shows
   - Redirects to `/report` page

### 2. Authentication Guard Test
1. After logging in, manually navigate to `http://localhost:4200/login`
2. Verify: Automatically redirects to `/report` (already authenticated)
3. Logout from the app
4. Try to access `http://localhost:4200/report` directly
5. Verify: Redirects to `/login` page

### 3. Transaction Report Filters Test

#### Default Filters (Pre-filled)
- Agent ID: `25ec3a76-b381-4854-a6c2-346cb8d77fdd`
- Location ID: `8f070c98-5ffc-418a-85bf-5922c3b68efd`
- From Date: 30 days ago
- To Date: Today

#### Test Filter Combinations
1. **Date Range Filter**
   - Change from date to `2025-10-10`
   - Change to date to `2025-10-30`
   - Verify: Table updates with debounce (500ms)

2. **Transaction Type Filter**
   - Select `SM`
   - Verify: Only SM transactions show
   - Select `SB`
   - Verify: Only SB transactions show

3. **Status Filter**
   - Select `PENDING`
   - Verify: Only pending transactions show
   - Try other statuses: `COMPLETED`, `FAILED`, `CANCELLED`

4. **Risk Filters**
   - Profile Risk: Select `Low`, `Medium`, `High`
   - Country Risk: Select `Low`, `Medium`, `High`
   - Verify: Filters apply correctly

5. **Reset Button**
   - Change multiple filters
   - Click "Reset" button
   - Verify: All filters reset to defaults

### 4. Infinite Scroll Pagination Test
1. Load transaction report
2. Scroll down to 80% of page
3. Verify:
   - "Loading more transactions..." appears
   - New transactions append to table
   - No duplicates
4. Continue scrolling until all records loaded
5. Verify: "All transactions loaded" message appears

### 5. CSV Export Test
1. Load transactions with filters
2. Click menu icon (top-right)
3. Click "Export to CSV"
4. Verify:
   - Success notification shows
   - CSV file downloads
   - File contains correct data with headers

### 6. Error Handling Test

#### Network Error Simulation
1. Disconnect internet
2. Try to login or load transactions
3. Verify: Error notification displays with message

#### Invalid Credentials
1. Logout
2. Enter wrong credentials
3. Click Login
4. Verify: Error message displays

#### Empty State
1. Set filters that return no results
2. Verify: "No Transactions Found" message with icon

### 7. Token Expiry Test
1. Login successfully
2. Wait for token to expire (check expiry time in response)
3. Verify:
   - Alert notification appears
   - Auto logout occurs
   - Redirects to login page

### 8. Responsive Design Test
1. Resize browser window to mobile size (< 768px)
2. Verify:
   - Login form is responsive
   - Filters stack vertically
   - Table is scrollable horizontally
   - All buttons are accessible

### 9. Loading States Test
1. **Initial Load**
   - Verify: Spinner shows while loading
   - Verify: "Loading transactions..." text

2. **Filter Changes**
   - Change filter
   - Verify: Debounce works (500ms delay)
   - Verify: Loading state during fetch

3. **Scroll Load**
   - Scroll to trigger pagination
   - Verify: "Loading more..." indicator at bottom

### 10. UI/UX Polish Test
1. **Color-coded Badges**
   - Status badges: Green (completed), Orange (pending), Red (failed), Gray (cancelled)
   - Risk badges: Green (low), Orange (medium), Red (high)

2. **Material Design**
   - Verify: Consistent Material Design theme
   - Verify: Smooth animations
   - Verify: Proper spacing and alignment

3. **Form Validation**
   - Clear email field in login
   - Verify: "Username is required" error
   - Enter invalid email
   - Verify: "Please enter a valid email" error

## API Testing Checklist

### Login API
- ✅ Endpoint: `POST /gateway/usermgt/UserAccountManager/login`
- ✅ Base64 encoding of credentials
- ✅ Response includes: accessToken, expiryDate, csrfToken, user, roles
- ✅ Token stored in localStorage

### Transaction Report API
- ✅ Endpoint: `POST /gateway/report/TransactionReport`
- ✅ Bearer token in Authorization header
- ✅ All filters working: pageNumber, pageSize, agentId, locationId, dates, types, risks
- ✅ Pagination working correctly
- ✅ Response parsing and display

## Security Testing

### 1. Token Management
- ✅ Token stored securely in localStorage
- ✅ Token sent in Authorization header
- ✅ Token validated on each request
- ✅ Expired tokens handled gracefully

### 2. Route Protection
- ✅ Unauthenticated users redirected to login
- ✅ Authenticated users can access protected routes
- ✅ Return URL preserved after login

### 3. Error Handling
- ✅ 401 errors trigger logout
- ✅ Network errors show user-friendly messages
- ✅ API errors displayed appropriately

## Performance Testing

### 1. Debouncing
- ✅ Filter changes debounced (500ms)
- ✅ Reduces unnecessary API calls
- ✅ Smooth user experience

### 2. Infinite Scroll
- ✅ Loads data on demand
- ✅ Prevents loading all data at once
- ✅ Efficient memory usage

### 3. Loading States
- ✅ Prevents multiple simultaneous requests
- ✅ Loading indicators for user feedback
- ✅ Disabled buttons during operations

## Browser Compatibility
Test in:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Edge (latest)
- ✅ Safari (latest)

## Expected Results Summary

### Functional Requirements
- ✅ Login with API integration
- ✅ Transaction report with all filters
- ✅ Pagination (infinite scroll)
- ✅ Auth interceptor working
- ✅ Route guard protecting routes
- ✅ Error handling throughout

### Bonus Features
- ✅ CSV export functional
- ✅ Debounced filter fetch
- ✅ Auto logout on token expiry
- ✅ Infinite scroll pagination

### Code Quality
- ✅ Separate services for business logic
- ✅ Components for UI
- ✅ TypeScript interfaces
- ✅ Reactive forms
- ✅ Clean code structure

### UX Polish
- ✅ Material Design UI
- ✅ Responsive layout
- ✅ Loading states
- ✅ Empty states
- ✅ Color-coded indicators
- ✅ Smooth animations

## Known Limitations
1. API may have rate limiting
2. Sample IDs may expire or change
3. Token expiry time depends on API response

## Troubleshooting

### Issue: Login fails
- Check network connection
- Verify API endpoint is accessible
- Check browser console for errors

### Issue: Transactions not loading
- Verify token is valid
- Check filter values are correct
- Verify sample IDs are still valid

### Issue: CSV export not working
- Check browser allows downloads
- Verify transactions are loaded
- Check browser console for errors

## Video Recording Checklist
When recording functionality video, demonstrate:
1. ✅ Login flow
2. ✅ Successful authentication
3. ✅ Transaction report loading
4. ✅ Filter changes (show debounce)
5. ✅ Infinite scroll pagination
6. ✅ CSV export
7. ✅ Logout
8. ✅ Route guard (try accessing /report when logged out)
9. ✅ Error handling (optional)
10. ✅ Responsive design (optional)
