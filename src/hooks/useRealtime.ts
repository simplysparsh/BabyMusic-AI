import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useSongStore } from '../store/songStore';

export function useRealtime() {
  const user = useAuthStore(state => state.user);
  const setupSubscription = useSongStore(state => state.setupSubscription);

  useEffect(() => {
    if (!user?.id) return;

    const unsubscribe = setupSubscription(user.id);

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user?.id, setupSubscription]);
}