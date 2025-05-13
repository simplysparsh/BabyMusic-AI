import { supabase } from '../lib/supabase';

export async function signInWithGoogle() {
  return supabase.auth.signInWithOAuth({ provider: 'google' });
} 