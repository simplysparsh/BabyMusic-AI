import { useEffect } from 'react';
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

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user?.id, setupSubscription]);
}