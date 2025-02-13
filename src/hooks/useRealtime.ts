import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useSongStore } from '../store/songStore';
import { useAuthStore } from '../store/authStore';

export function useRealtime() {
  const user = useAuthStore(state => state.user);
  const setupSubscription = useSongStore(state => state.setupSubscription);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    if (user?.id) {
      unsubscribe = setupSubscription();
    }

    return () => unsubscribe?.();
  }, [user?.id, setupSubscription]);
}