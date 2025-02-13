import { useEffect } from 'react';
import { useAppStore } from '../store/appStore';

export function useSubscription() {
  const setupSubscriptions = useAppStore(state => state.setupSubscriptions);

  useEffect(() => {
    const unsubscribe = setupSubscriptions();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [setupSubscriptions]);
}