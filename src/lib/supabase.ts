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
  }
});

// Set up periodic token refresh to prevent stale tokens during long sessions
let refreshInterval: ReturnType<typeof setInterval> | null = null;

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
  // Clear any existing interval
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
  
  // Refresh token every 10 minutes (600000ms)
  // This is well before the default JWT expiration of 1 hour
  refreshInterval = setInterval(async () => {
    try {
      const { error } = await supabase.auth.refreshSession();
      if (error) {
        console.warn('Token refresh failed:', error.message);

        // If the refresh token itself is invalid we must clear local session immediately
        if (error.message.includes('Invalid Refresh Token') || error.message.includes('Not Found')) {
          console.warn('[Supabase] Detected invalid refresh token during periodic refresh. Forcing sign-out.');

          try {
            await supabase.auth.signOut();
          } catch (signOutErr) {
            console.warn('[Supabase] signOut after periodic refresh failure produced an error – clearing storage manually.', signOutErr);
            clearSupabaseStorage();
          }

          if (sessionExpiredCallback) {
            await sessionExpiredCallback();
          }
          return; // Exit early so we don't log misleading success message below
        }
      } else {
        console.log('Auth token refreshed successfully');
      }
    } catch (err) {
      console.error('Error during token refresh:', err);
    }
  }, 600000);
  
  console.log('Started periodic token refresh');
}

// Function to stop token refresh
export function stopTokenRefresh() {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
    console.log('Stopped periodic token refresh');
  }
}

// Function to force an immediate refresh
export async function forceTokenRefresh() {
  console.log('[DEBUG] [Supabase] Attempting token refresh');
  try {
    // Create a timeout promise that rejects after 10 seconds
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Token refresh timed out after 10 seconds'));
      }, 10000);
    });
    
    // Race between the refresh operation and the timeout
    const { error } = await Promise.race([
      supabase.auth.refreshSession(),
      timeoutPromise
    ]) as { error: any };
    
    console.log('[DEBUG] [Supabase] Token refresh completed');
    
    // If there's an error, handle it gracefully
    if (error) {
      console.warn('[DEBUG] [Supabase] Session refresh failed:', error.message);
      
      // If this is an invalid refresh token error, we should redirect to login
      if (error.message.includes('Invalid Refresh Token') || 
          error.message.includes('Token expired') ||
          error.message.includes('Not Found')) {
        
        // Log the user out cleanly instead of leaving in a broken state
        await supabase.auth.signOut();
        
        // Use the registered callback instead of dynamic import
        if (sessionExpiredCallback) {
          await sessionExpiredCallback();
        } else {
          console.warn('[DEBUG] [Supabase] No session expired callback registered');
        }
        
        // If in browser environment, you might want to redirect
        if (typeof window !== 'undefined') {
          // Notify the user
          alert('Your session has expired. Please log in again.');
          
          // Redirect to login (adjust path as needed)
          window.location.href = '/login';
        }
        
        return { error };
      }
    }
    
    return { error: null };
  } catch (err) {
    console.error('[DEBUG] [Supabase] Unexpected error refreshing session:', err);
    
    // Handle timeout specifically
    if (err instanceof Error && err.message.includes('timed out')) {
      console.warn('[DEBUG] [Supabase] Token refresh timed out. Continuing with existing token.');
      
      // Return a specific error that calling code can identify but no need
      // for the calling code to handle it specially
      return { error: { message: 'TOKEN_REFRESH_TIMEOUT', originalError: err } };
    }
    
    return { error: err };
  }
}

// Export a wrapped supabase instance with retry functionality for function calls
export const supabaseWithRetry = {
  functions: {
    invoke: async (functionName: string, options?: any) => {
      try {
        // Try the function call normally first
        const result = await supabase.functions.invoke(functionName, options);
        
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
          
          // Retry the function call after token refresh
          return await supabase.functions.invoke(functionName, options);
        }
        
        return result;
      } catch (error) {
        // For unexpected errors, still try to refresh and retry once
        console.error(`Error calling function ${functionName}:`, error);
        
        try {
          const refreshed = await forceTokenRefresh();
          if (refreshed.error) {
            console.error(`Retry failed for function ${functionName}:`, refreshed.error);
            return { data: null, error: refreshed.error };
          }
          return await supabase.functions.invoke(functionName, options);
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