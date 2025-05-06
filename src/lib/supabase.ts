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
    detectSessionInUrl: true
  }
});

// Set up periodic token refresh to prevent stale tokens during long sessions
let refreshInterval: ReturnType<typeof setInterval> | null = null;

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
  try {
    console.log('Forcing token refresh');
    const { error } = await supabase.auth.refreshSession();
    
    if (error) {
      console.error('Forced token refresh failed:', error.message);
      return false;
    }
    
    console.log('Forced token refresh successful');
    return true;
  } catch (err) {
    console.error('Error during forced token refresh:', err);
    return false;
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
          
          if (refreshed) {
            // Retry the function call after token refresh
            return await supabase.functions.invoke(functionName, options);
          }
        }
        
        return result;
      } catch (error) {
        // For unexpected errors, still try to refresh and retry once
        console.error(`Error calling function ${functionName}:`, error);
        
        try {
          await forceTokenRefresh();
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

// Make the functions available globally for debugging
if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).clearSupabaseStorage = clearSupabaseStorage;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).testSupabaseConnection = testSupabaseConnection;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).checkUserExists = checkUserExists;
}