import { supabase } from '../lib/supabase';
import { SignupMethod } from '../store/authStore';

export async function signInWithGoogle() {
  localStorage.setItem('lastSignupMethod', SignupMethod.OAuth);
  localStorage.setItem('onboardingInProgress', 'true');
  return supabase.auth.signInWithOAuth({ provider: 'google' });
} 