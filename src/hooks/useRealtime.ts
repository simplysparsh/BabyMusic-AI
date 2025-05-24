import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useSongStore } from '../store/songStore';

export function useRealtime() {
  const user = useAuthStore(state => state.user);
  const setupSubscription = useSongStore(state => state.setupSubscription);

  useEffect(() => {
    if (!user?.id) return;

    let unsubscribe = setupSubscription(user.id);

    // Handle visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Check if connection might be stale (tab was hidden for a while)
        const hiddenTime = performance.now() - (window as any).lastHiddenTime;
        if (hiddenTime > 5 * 60 * 1000) { // 5 minutes
          console.log('[Realtime] Tab was hidden for', Math.round(hiddenTime / 1000), 'seconds, reconnecting...');
          // Reconnect subscriptions
          if (unsubscribe) unsubscribe();
          unsubscribe = setupSubscription(user.id);
        }
      } else {
        // Store when tab was hidden
        (window as any).lastHiddenTime = performance.now();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (unsubscribe) unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user?.id, setupSubscription]);
}