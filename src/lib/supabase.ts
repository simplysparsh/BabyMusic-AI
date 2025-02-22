import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

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

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);