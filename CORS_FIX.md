# CORS Error Fix - Proxy Configuration

## Problem
The login API was returning a CORS (Cross-Origin Resource Sharing) error:
```
Http failure response for https://remittanceapp.microservice.uat-lplusltd.com/gateway/usermgt/UserAccountManager/login: 0 Unknown Error
```

This happens because the browser blocks requests from `localhost:4200` to the remote API server due to security restrictions.

## Solution
Implemented an Angular proxy configuration to bypass CORS during development.

### Files Created/Modified

#### 1. proxy.conf.json (NEW)
```json
{
  "/api": {
    "target": "https://remittanceapp.microservice.uat-lplusltd.com",
    "secure": true,
    "changeOrigin": true,
    "pathRewrite": {
      "^/api": ""
    },
    "logLevel": "debug"
  }
}
```

**How it works:**
- Requests to `/api/*` are proxied to the remote server
- `changeOrigin: true` - Changes the origin header to match the target
- `pathRewrite` - Removes `/api` prefix before forwarding
- Example: `/api/gateway/usermgt/...` → `https://remittanceapp.microservice.uat-lplusltd.com/gateway/usermgt/...`

#### 2. angular.json (MODIFIED)
Added proxy configuration to serve options:
```json
"serve": {
  "builder": "@angular/build:dev-server",
  "options": {
    "proxyConfig": "proxy.conf.json"
  },
  ...
}
```

#### 3. auth.service.ts (MODIFIED)
Changed API URL from absolute to relative:
```typescript
// Before
private readonly API_URL = 'https://remittanceapp.microservice.uat-lplusltd.com/gateway/usermgt/UserAccountManager';

// After
private readonly API_URL = '/api/gateway/usermgt/UserAccountManager';
```

#### 4. transaction.service.ts (MODIFIED)
Changed API URL from absolute to relative:
```typescript
// Before
private readonly API_URL = 'https://remittanceapp.microservice.uat-lplusltd.com/gateway/report';

// After
private readonly API_URL = '/api/gateway/report';
```

## How to Use

### 1. Restart the Development Server
The proxy configuration requires a server restart:
```bash
# Stop current server (Ctrl+C)
# Start with proxy
npm start
```

### 2. Test Login
1. Open `http://localhost:4200`
2. Enter credentials:
   - Email: `admin@lucidplus.com`
   - Password: `Welcome@123*`
3. Click Login

### 3. Verify in Network Tab
- Request URL should be: `http://localhost:4200/api/gateway/usermgt/UserAccountManager/login`
- The proxy will forward it to: `https://remittanceapp.microservice.uat-lplusltd.com/gateway/usermgt/UserAccountManager/login`
- No CORS errors should appear

## Request Flow

```
Browser Request:
http://localhost:4200/api/gateway/usermgt/UserAccountManager/login
         ↓
Angular Dev Server (Proxy):
- Intercepts /api/* requests
- Changes origin header
- Removes /api prefix
         ↓
Actual API Request:
https://remittanceapp.microservice.uat-lplusltd.com/gateway/usermgt/UserAccountManager/login
         ↓
API Response:
← Returns through proxy to browser
← No CORS issues!
```

## Important Notes

### Development vs Production
- **Development**: Uses proxy (localhost → remote API)
- **Production**: Must configure CORS on the backend server OR deploy frontend on same domain

### Production Deployment Options

#### Option 1: Backend CORS Configuration
Ask backend team to add CORS headers:
```
Access-Control-Allow-Origin: https://your-frontend-domain.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

#### Option 2: Same Domain Deployment
Deploy frontend and backend on same domain:
- Frontend: `https://example.com`
- Backend: `https://example.com/api` or `https://api.example.com`

#### Option 3: API Gateway
Use an API gateway (like AWS API Gateway, Kong, etc.) to handle CORS

### Proxy Limitations
- Only works in development mode
- Requires `ng serve` to be running
- Not available in production build

## Troubleshooting

### Proxy Not Working
1. Ensure `proxy.conf.json` is in project root
2. Verify `angular.json` has `proxyConfig` option
3. Restart dev server completely
4. Check console for proxy logs

### Still Getting CORS Errors
1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R)
3. Check Network tab - URL should start with `http://localhost:4200/api/`
4. Verify services are using `/api/` prefix

### 502 Bad Gateway
- API server might be down
- Check API URL in `proxy.conf.json`
- Verify network connectivity

## Testing Checklist

✅ Proxy configuration file created
✅ Angular.json updated with proxy config
✅ Auth service using proxy path
✅ Transaction service using proxy path
✅ Dev server restarted
✅ Login request goes through proxy
✅ No CORS errors in console
✅ Successful authentication

## Additional Resources

- [Angular Proxy Configuration](https://angular.dev/tools/cli/serve#proxying-to-a-backend-server)
- [Understanding CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware)
