import { supabase } from '../lib/supabase';
import { useUIStore } from '../store/uiStore';
import { SignupMethod } from '../store/authStore';

export async function signInWithGoogle(isSignup: boolean = false) {
  if (isSignup) {
    localStorage.setItem('onboardingInProgress', 'true');
    localStorage.setItem('lastSignupMethod', SignupMethod.OAuth);
  }
  const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
  if (!error && data && isSignup) {
    useUIStore.getState().openOnboarding(SignupMethod.OAuth);
  }
  return { data, error };
} 