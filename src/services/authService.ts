import { supabase } from '../lib/supabase';
import { useUIStore } from '../store/uiStore';
import { SignupMethod } from '../store/authStore';

export async function signInWithGoogle() {
  localStorage.setItem('onboardingInProgress', 'true');
  localStorage.setItem('lastSignupMethod', SignupMethod.OAuth);
  const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
  if (!error && data) {
    useUIStore.getState().openOnboarding(SignupMethod.OAuth);
  }
  return { data, error };
} 