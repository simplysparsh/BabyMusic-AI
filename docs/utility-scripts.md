# Utility Scripts

Baby Music AI includes a collection of utility scripts for development, testing, and maintenance tasks. These scripts are located in the `scripts` directory and can be run using the Node.js runtime or the `tsx` command for TypeScript execution.

## Testing Scripts

### Real-time System Testing

- **testRealtimeHandler.ts**: Browser-based testing utilities for the RealtimeHandler system.

**Usage**:

The RealtimeHandler testing utilities are designed to run in the browser during development to verify real-time functionality:

```javascript
// Test all RealtimeHandler functionality
window.testRealtimeHandler.runBrowserTests();

// Diagnose real-time connection issues
window.testRealtimeHandler.diagnoseMealtimeConnection();

// Test with real user session
window.testRealtimeHandler.testWithRealSession('user-id-here');

// Individual test functions
window.testRealtimeHandler.testHandlerInitialization();
window.testRealtimeHandler.testChannelManagement();
window.testRealtimeHandler.testSubscriptionCallbacks();
window.testRealtimeHandler.testVisibilityHandling();
window.testRealtimeHandler.testSupabaseIntegration();
window.testRealtimeHandler.testErrorRecovery();
```

**Features**:
- Comprehensive test suite covering all RealtimeHandler functionality
- Channel management and factory pattern testing
- Subscription callback verification
- Visibility change handling tests
- Error recovery and timeout handling validation
- Real session integration testing with actual Supabase channels
- Connection diagnostics for troubleshooting real-time issues

**Test Results**:
The testing utilities provide detailed feedback including:
- ✅ Test pass/fail status with explanatory messages
- 📊 Summary statistics (passed/failed/total tests)
- 🔍 Diagnostic information for connection issues
- 📡 Real-time subscription status and behavior verification

### API Testing

- **test-webhook.ts**: Simulates webhook calls to test the webhook function locally.

**Usage**:

```bash
# Test webhook locally
npm run test:webhook
```

## Maintenance/DB Management Scripts

- **fix-task-ids.ts**: Utility to fix inconsistent task IDs in the database.
  ```bash
  npx tsx scripts/fix-task-ids.ts
  ```
  This script performs the following checks:
  - Finds songs with audio URLs that still have task IDs and clears those task IDs
  - Identifies songs with a failed status that still have task IDs and clears them
  - Checks for songs that have been generating for more than 5 minutes and updates their status to 'failed'

- **fix-stuck-tasks.ts**: Resolves stuck or stalled song generation tasks.
  ```bash
  npx tsx scripts/fix-stuck-tasks.ts
  ```
  This script:
  - Finds songs with task IDs that have been generating for more than 5 minutes
  - Updates these songs to have a 'failed' status and clears their task IDs
  - Marks them as retryable so they can be generated again

- **check-stuck-tasks.ts**: Identifies song generation tasks that may be stuck in the queue.
  ```bash
  npx tsx scripts/check-stuck-tasks.ts
  ```
  This script identifies and reports issues without making any changes to the database.

- **update-song-audio.ts**: Updates audio URLs for existing songs.
  ```bash
  npx tsx scripts/update-song-audio.ts <song_id> <audio_url>
  ```

- **list-songs.ts**: Lists all songs in the database with their metadata.
  ```bash
  npx tsx scripts/list-songs.ts
  ```
  This script displays:
  - Song ID
  - Song name
  - Creation date
  - Audio URL (if available)
  - Task ID (if present)
  - Error message (if any)

## Environment Setup

- **setup-env.ts**: Helper script to set up the development environment.
  ```bash
  npx tsx scripts/setup-env.ts
  ```
  This script will:
  - Guide you through setting up all required environment variables
  - Create a `.env.local` file with your provided values
  - Check if an existing `.env.local` file exists and ask before overwriting

- **check-for-secrets.ts**: Scans the codebase for accidentally committed secrets.
  ```bash
  npx tsx scripts/check-for-secrets.ts
  ```
  This script:
  - Searches for patterns that might indicate hardcoded secrets (API keys, tokens, etc.)
  - Excludes common false positives like React key props
  - Ignores files that typically contain environment variables (like .env files)
  - Reports any findings so they can be moved to environment variables

## Linting Utilities

The `scripts/lint` directory contains utilities for code linting and formatting:

- **fix-imports.mjs**: Fixes and organizes import statements.
  ```bash
  npm run lint:imports
  ```

- **fix-unused-vars.mjs**: Identifies and removes unused variables.
  ```bash
  npm run lint:vars
  ```

The linting scripts are combined in a single command for convenience:

```bash
npm run lint:fix
```

## Development Testing Workflow

For real-time functionality testing during development:

1. **Start the development server**: `npm run dev`
2. **Open browser console** and navigate to your local development URL
3. **Run comprehensive tests**: `window.testRealtimeHandler.runBrowserTests()`
4. **Diagnose issues** (if any): `window.testRealtimeHandler.diagnoseMealtimeConnection()`
5. **Test with real data**: Use `testWithRealSession()` with your actual user ID

This workflow helps ensure the RealtimeHandler system is working correctly before deploying changes.

## Usage Instructions

To run any script, use one of the following command patterns:

```bash
# For scripts with npm commands defined
npm run <command-name>

# For scripts without npm commands
npx tsx scripts/<script-name>.ts

# For browser-based testing (RealtimeHandler)
# Open browser console and use window.testRealtimeHandler methods
```

## Environment Variables

All scripts use environment variables from `.env.local` for configuration. The required variables are:

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

The scripts will automatically:
1. Look for a `.env.local` file in the project root
2. Fall back to `.env` if `.env.local` is not found
3. Display an error if the required environment variables are missing

## Security Considerations

Some maintenance scripts involve database operations or API calls that could affect production data. Always:

1. Test scripts in a development environment first
2. Use appropriate authentication and authorization
3. Add safeguards to prevent accidental data loss
4. Log all operations for audit purposes
5. Back up your database before running scripts that modify data

## Best Practices

- **Real-time Testing**: Run RealtimeHandler tests regularly during development to catch connection issues early
- **Secrets Scanning**: Run `check-for-secrets.ts` regularly to ensure no secrets are hardcoded in the codebase
- **Task Management**: Use `check-stuck-tasks.ts` to identify potential issues before using `fix-stuck-tasks.ts`
- **Database Safety**: Always back up your database before running scripts that modify data
- **Environment Security**: Keep your `.env.local` file secure and never commit it to version control 
- **Browser Testing**: Use the browser-based RealtimeHandler tests for more accurate real-time testing than Node.js alternatives 