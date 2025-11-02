# Environment Configuration

This folder contains environment-specific configuration files for the application.

## Files

### `environment.ts` (Development)
Used during development (`ng serve` or `ng build`)
- `production: false`
- Development API URLs
- Debug mode enabled

### `environment.prod.ts` (Production)
Used for production builds (`ng build -c production`)
- `production: true`
- Production API URLs
- Optimized for performance

## Configuration Properties

```typescript
{
  production: boolean;           // Flag to indicate production mode
  apiUrl: string;               // Base API URL
  apiEndpoints: {
    userManagement: string;     // User management API endpoint
    report: string;             // Report API endpoint
  }
}
```

## Usage in Services

Import the environment in your service:

```typescript
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MyService {
  private readonly API_URL = environment.apiEndpoints.userManagement;
  
  // Use API_URL in your HTTP calls
}
```

## Build Commands

### Development Build
```bash
ng build
# Uses environment.ts
```

### Production Build
```bash
ng build -c production
# Uses environment.prod.ts (via file replacement)
```

### Serve Development
```bash
ng serve
# Uses environment.ts
```

## File Replacement

The `angular.json` configuration automatically replaces `environment.ts` with `environment.prod.ts` during production builds:

```json
"fileReplacements": [
  {
    "replace": "src/environments/environment.ts",
    "with": "src/environments/environment.prod.ts"
  }
]
```

## Customization

To add new environment variables:

1. Add the property to both `environment.ts` and `environment.prod.ts`
2. Update the type definition if using TypeScript strict mode
3. Import and use in your services/components

Example:
```typescript
export const environment = {
  production: false,
  apiUrl: '/api/gateway',
  apiEndpoints: {
    userManagement: '/api/gateway/usermgt/UserAccountManager',
    report: '/api/gateway/report'
  },
  // Add new properties here
  featureFlags: {
    enableNewFeature: true
  },
  apiTimeout: 30000
};
```

## Best Practices

1. **Never commit sensitive data** (API keys, passwords) to environment files
2. **Use environment variables** for sensitive configuration
3. **Keep environment files in sync** - ensure both files have the same structure
4. **Document all properties** - add comments for complex configurations
5. **Use TypeScript interfaces** for type safety

## Security Notes

- Environment files are bundled into the application
- Do not store secrets or API keys in these files
- For sensitive data, use server-side environment variables
- Consider using Angular's APP_INITIALIZER for runtime configuration
