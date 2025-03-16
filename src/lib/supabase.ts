import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug logging
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key exists:', !!supabaseKey);

// Check for environment variables
if (!supabaseUrl) {
  console.error('Missing VITE_SUPABASE_URL environment variable');
  // Return a dummy client that will show appropriate UI messages
  throw new Error('Please click "Connect to Supabase" to set up your database connection');
}

if (!supabaseKey) {
  console.error('Missing VITE_SUPABASE_ANON_KEY environment variable');
  throw new Error('Please click "Connect to Supabase" to set up your database connection');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

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
  (window as any).clearSupabaseStorage = clearSupabaseStorage;
  (window as any).testSupabaseConnection = testSupabaseConnection;
  (window as any).checkUserExists = checkUserExists;
}