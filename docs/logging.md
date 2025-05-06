# Logging Guidelines

Baby Music AI uses a custom logging system that automatically removes all console logs in production builds for optimal performance.

## Key Benefits

- **Zero Logs in Production**: All console logs are automatically stripped from production builds
- **Better Performance**: Removal of logging improves application performance, especially on mobile
- **Structured Logging**: Consistent format with timestamps and log levels
- **Development-Friendly**: Full logging available in development for debugging

## How It Works

We use two mechanisms to ensure logs don't affect production performance:

1. **Babel Plugin**: The `babel-plugin-transform-remove-console` removes all console statements at build time
2. **Terser Option**: As a fallback, `drop_console: true` in the terser configuration also removes console calls

## Using the Logger

Instead of using `console.log()` directly, import and use our Logger utility:

```typescript
import Logger from '../utils/logger';

// Different log levels
Logger.debug('Debugging information', { someData: 'value' });
Logger.info('General information');
Logger.warn('Warning message');
Logger.error('Error occurred', errorObject);

// With tags for filtering
Logger.info('User action', { action: 'click' }, { tags: ['user', 'interaction'] });

// Without timestamp
Logger.debug('Quick message', null, { timestamp: false });
```

## Rules for Logging

1. **Performance-Critical Code**: Avoid logging in frequently called functions
2. **Useful Context**: Always include relevant data objects when logging
3. **Log Levels**: Use the appropriate level for each message
4. **User Data**: Never log sensitive user information

## Migration Guide

### Basic Migration Pattern

```typescript
// BEFORE
console.log('User clicked button', { id: 123 });

// AFTER
Logger.info('User clicked button', { id: 123 });
```

### Log Level Selection

Choose the appropriate log level based on the message's importance:

```typescript
// Debugging/trace information - verbose details for developers
Logger.debug('Component rendered', { props, state });

// General information - notable events worth tracking
Logger.info('User authenticated', { userId });

// Warnings - problems that don't prevent functionality
Logger.warn('API response slow', { duration: '2.5s' });

// Errors - failures that affect functionality
Logger.error('Payment processing failed', { orderId, errorCode });
```

### Common Component Patterns

#### React Component with State Updates

```typescript
useEffect(() => {
  // BEFORE
  console.log(`Component ${name} state changed to:`, newState);
  
  // AFTER
  Logger.debug(`Component ${name} state changed`, { 
    prevState, 
    newState 
  }, { tags: ['state-change'] });
}, [newState]);
```

#### Event Handlers

```typescript
const handleClick = useCallback(() => {
  // BEFORE
  console.log('Button clicked', { buttonId });
  
  // AFTER - Use info for user actions
  Logger.info('Button clicked', { 
    buttonId, 
    context: 'checkout' 
  }, { tags: ['user-interaction'] });
}, [buttonId]);
```

#### Conditional or Sampled Logging

For high-frequency events, use sampling to reduce log volume:

```typescript
// Only log a percentage of events
if (Math.random() < 0.1) { // 10% of calls
  Logger.debug('High frequency event', { data });
}
```

#### API Responses

```typescript
try {
  const response = await api.getData();
  
  // BEFORE
  console.log('API response:', response);
  
  // AFTER
  Logger.info('API request successful', {
    endpoint: '/data',
    status: response.status,
    itemCount: response.data.length
  });
} catch (error) {
  // BEFORE
  console.error('API error:', error);
  
  // AFTER
  Logger.error('API request failed', {
    endpoint: '/data',
    errorCode: error.code,
    message: error.message
  });
}
```

## Tag Conventions

Use consistent tags to make filtering logs easier:

- `['ui']` - UI-related events
- `['api']` - API requests/responses
- `['user-interaction']` - User actions
- `['error']` - Error conditions
- `['performance']` - Performance metrics
- `['auth']` - Authentication events
- `['state']` - State changes
- `['lifecycle']` - Component lifecycle events

You can combine tags: `{ tags: ['api', 'error'] }`

## For New Developers

When refactoring existing code, replace direct console calls with the Logger utility:

```typescript
// Old way (will be removed in production)
console.log('User clicked button');

// New way (structured, consistent, and also removed in production)
Logger.info('User clicked button', { componentName: 'LoginForm' });
```

All logs will still be automatically stripped from production builds, but this approach gives us more consistent logging during development. 