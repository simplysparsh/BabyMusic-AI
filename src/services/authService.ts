import { supabase } from '../lib/supabase';
import { SignupMethod } from '../store/authStore';

export async function signInWithGoogle() {
  localStorage.setItem('lastSignupMethod', SignupMethod.OAuth);
  return supabase.auth.signInWithOAuth({ provider: 'google' });
} 