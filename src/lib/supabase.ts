import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Debug logging
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key exists:', !!supabaseAnonKey);

// Check for environment variables
if (!supabaseUrl) {
  console.error('Missing VITE_SUPABASE_URL environment variable');
  // Return a dummy client that will show appropriate UI messages
  throw new Error('Please click "Connect to Supabase" to set up your database connection');
}

if (!supabaseAnonKey) {
  console.error('Missing VITE_SUPABASE_ANON_KEY environment variable');
  throw new Error('Please click "Connect to Supabase" to set up your database connection');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    // @ts-expect-error TypeScript type definition for AuthOptions might be outdated in this environment
    syncTabs: true
  },
  realtime: {
    heartbeatIntervalMs: 25000, // 25 seconds (less than 30s to avoid timeouts)
    reconnectAfterMs: function (tries: number) {
      // Exponential backoff: 1s, 2s, 4s, 8s, 16s (max 16s)
      return Math.min(1000 * Math.pow(2, tries), 16000);
    },
    timeout: 20000, // 20 second timeout for requests
    // Remove worker: true as it's causing "Unhandled message type: heartbeat" errors
    // The heartbeatIntervalMs alone should be sufficient to prevent connection drops
  }
});

// ──────────────────────────────────────────────────────────
// Refresher state (single-flight guard + timestamp)
// ──────────────────────────────────────────────────────────
let ongoingRefresh: Promise<{ error: any | null }> | null = null;
let lastSuccessfulRefreshAt = Date.now();

export function getLastSuccessfulRefresh(): number {
  return lastSuccessfulRefreshAt;
}

// NOTE: We previously kept a 10-minute setInterval to refresh tokens.
// Empirically this caused overlapping refresh requests and 400 "Invalid
// Refresh Token" errors.  We now rely on Supabase's built-in automatic
// refresh (~30 s before expiry) and only trigger manual refreshes via
// forceTokenRefresh() when explicitly needed.  The old interval helpers
// remain as NO-OPs so existing calls elsewhere keep compiling.
let refreshInterval: null = null; // kept for type compatibility

// Auth callback registration to avoid circular dependencies
type AuthSessionExpiredCallback = () => Promise<void>;
let sessionExpiredCallback: AuthSessionExpiredCallback | null = null;

// Function to register the callback
export function registerSessionExpiredCallback(callback: AuthSessionExpiredCallback): void {
  sessionExpiredCallback = callback;
  console.log('Session expired callback registered');
}

// Function to start token refresh
export function startTokenRefresh() {
  // Backwards-compatibility NO-OP
  console.log('[Supabase] startTokenRefresh() called – no longer needed; relying on built-in refresh.');
}

// Function to stop token refresh
export function stopTokenRefresh() {
  // Backwards-compatibility NO-OP
  console.log('[Supabase] stopTokenRefresh() called – interval mechanism removed.');
}

// Function to force an immediate refresh
export async function forceTokenRefresh(): Promise<{ error: any | null }> {
  // Enforce single-flight: if a refresh is already running return its promise
  if (ongoingRefresh) {
    return ongoingRefresh;
  }

  ongoingRefresh = (async (): Promise<{ error: any | null }> => {
    console.log('[DEBUG] [Supabase] Attempting token refresh');
    try {
      // Create a timeout promise that rejects after 20 seconds
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Token refresh timed out after 20 seconds'));
        }, 20000);
      });

      // Race between the refresh operation and the timeout
      const { error } = await Promise.race([
        supabase.auth.refreshSession(),
        timeoutPromise
      ]) as { error: any };

      // Update timestamp on success
      if (!error) {
        lastSuccessfulRefreshAt = Date.now();
      }

      // Handle fatal auth errors
      if (error && (error.message.includes('Invalid Refresh Token') ||
        error.message.includes('Token expired') ||
        error.message.includes('Not Found')))
      {
        await supabase.auth.signOut();
        if (sessionExpiredCallback) await sessionExpiredCallback();
        return { error };
      }

      return { error };
    } catch (err) {
      console.error('[DEBUG] [Supabase] Unexpected error refreshing session:', err);

      // Only treat TIMEOUT as soft-error (don't force sign-out). Caller can retry later.
      return { error: err };
    } finally {
      ongoingRefresh = null; // allow future refreshes
    }
  })();

  return ongoingRefresh;
}

// Export a wrapped supabase instance with retry functionality for function calls
export const supabaseWithRetry = {
  functions: {
    invoke: async (functionName: string, options?: any) => {
      const start = Date.now();
      console.log(`[supabaseWithRetry] Calling function ${functionName}`);
      const TIMEOUT_MS = 15000;
      const makeTimeout = () => new Promise<never>((_, reject) => setTimeout(() => reject(new Error('FUNCTION_TIMEOUT')), TIMEOUT_MS));
      try {
        // Race the real invoke against timeout
        const result = await Promise.race([
          supabase.functions.invoke(functionName, options),
          makeTimeout()
        ]) as { data: any; error: any };

        console.log(`[supabaseWithRetry] Function ${functionName} responded in ${Date.now() - start} ms`, result.error ? 'with error' : 'success');

        // If there's an error that might be auth-related, try refreshing the token and calling again
        if (result.error && (
          result.error.message?.includes('JWT') || 
          result.error.message?.includes('token') ||
          result.error.message?.includes('auth') ||
          result.error.status === 401
        )) {
          console.log(`Function call to ${functionName} failed, attempting token refresh and retry`);
          const refreshed = await forceTokenRefresh();
          
          if (refreshed.error) {
            console.error(`Retry failed for function ${functionName}:`, refreshed.error);
            return { data: null, error: refreshed.error };
          }
          
          // Retry the function call after token refresh (with timeout again)
          return await Promise.race([
            supabase.functions.invoke(functionName, options),
            makeTimeout()
          ]) as { data: any; error: any };
        }
        
        return result;
      } catch (error) {
        if (error instanceof Error && error.message === 'FUNCTION_TIMEOUT') {
          console.error(`[supabaseWithRetry] Function ${functionName} timed out after ${TIMEOUT_MS} ms`);
          return { data: null, error }; // surface timeout to caller
        }
        // For unexpected errors, still try to refresh and retry once
        console.error(`Error calling function ${functionName}:`, error);
        
        try {
          const refreshed = await forceTokenRefresh();
          if (refreshed.error) {
            console.error(`Retry failed for function ${functionName}:`, refreshed.error);
            return { data: null, error: refreshed.error };
          }
          return await Promise.race([
            supabase.functions.invoke(functionName, options),
            makeTimeout()
          ]) as { data: any; error: any };
        } catch (retryError) {
          console.error(`Retry failed for function ${functionName}:`, retryError);
          return { data: null, error: retryError };
        }
      }
    }
  }
};

// Helper function to clear browser storage (can be run from console)
export const clearSupabaseStorage = () => {
  try {
    localStorage.removeItem('supabase.auth.token');
    localStorage.removeItem('supabase.auth.refreshToken');
    sessionStorage.removeItem('supabase.auth.token');
    sessionStorage.removeItem('supabase.auth.refreshToken');
    console.log('Supabase storage cleared successfully');
    return true;
  } catch (error) {
    console.error('Error clearing Supabase storage:', error);
    return false;
  }
};

// Function to test Supabase connection
export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    
    if (error) {
      console.error('Supabase connection test failed:', error);
      return { success: false, error };
    }
    
    console.log('Supabase connection test successful:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Supabase connection test exception:', error);
    return { success: false, error };
  }
};

// Function to check if a user exists
export const checkUserExists = async (email: string) => {
  try {
    console.log('Checking if user exists:', email);
    
    // Use the auth.admin.listUsers endpoint with a filter
    // Note: This requires service role key, so it's better to implement this on the server side
    // For client-side, we'll use a workaround by trying to reset the password
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin
    });
    
    // If there's no error or the error is not about the user not existing,
    // then the user likely exists
    if (!error || !error.message.includes('User not found')) {
      console.log('User likely exists');
      return { exists: true };
    }
    
    console.log('User does not exist');
    return { exists: false };
  } catch (error) {
    console.error('Error checking if user exists:', error);
    return { exists: false, error };
  }
};

// After the supabase client is created and before exporting helper functions, register a global auth listener to catch refresh failures
supabase.auth.onAuthStateChange(async (event, _session) => {
  if ((event as string) === 'TOKEN_REFRESH_FAILED') {
    console.warn('[Supabase] Token refresh failed – logging user out to clear invalid tokens.');

    try {
      // Attempt to sign the user out cleanly
      await supabase.auth.signOut();
    } catch (signOutErr) {
      // If sign-out fails (can happen if refresh token already invalid), fall back to clearing storage manually
      console.warn('[Supabase] signOut after refresh failure produced an error – clearing storage manually.', signOutErr);
      clearSupabaseStorage();
    }

    // Invoke the consumer-registered callback so app-level stores reset themselves
    if (sessionExpiredCallback) {
      await sessionExpiredCallback();
    }
  }
});

// Make the functions available globally for debugging
if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).clearSupabaseStorage = clearSupabaseStorage;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).testSupabaseConnection = testSupabaseConnection;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).checkUserExists = checkUserExists;
}