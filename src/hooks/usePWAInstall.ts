import { useState, useEffect, useCallback } from 'react';
import { ProfileService } from '../services/profileService';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAInstallStatus {
  canInstall: boolean;
  isInstalled: boolean;
  isIOS: boolean;
  triggerInstallPrompt: () => Promise<boolean>;
}

// Variable to store the event, needs to be outside the hook to persist across renders
let deferredInstallPrompt: BeforeInstallPromptEvent | null = null;

// Helper to detect iOS
const getIsIOS = () => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    // iPad on iOS 13 detection
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
};

export function usePWAInstall(userId?: string): PWAInstallStatus {
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    setIsIOS(getIsIOS());
  }, []);

  // Standalone mode detection: If user logs in and app is running as PWA, update profile
  useEffect(() => {
    if (userId && window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      ProfileService.updatePWAInstallStatus(userId, true)
        .catch((err) => {
          console.error('Failed to update PWA install status (standalone mode detection):', err);
        });
    }
  }, [userId]);

  const handleBeforeInstallPrompt = useCallback((event: Event) => {
    event.preventDefault();
    deferredInstallPrompt = event as BeforeInstallPromptEvent;
    // Only set canInstall if not already installed
    if (!window.matchMedia('(display-mode: standalone)').matches) {
      setCanInstall(true);
    }
    console.log('[usePWAInstall] beforeinstallprompt event captured.');
  }, []);

  useEffect(() => {
    // Check if running in standalone mode (already installed)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      setCanInstall(false); // Cannot install if already installed
      console.log('[usePWAInstall] App is running in standalone mode.');
      return; // No need to set up install prompt listeners if already installed
    }

    // Check if the prompt was already captured (e.g. due to HMR)
    if (deferredInstallPrompt && !isInstalled) {
      setCanInstall(true);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    console.log('[usePWAInstall] Event listener for beforeinstallprompt added.');

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      console.log('[usePWAInstall] Event listener for beforeinstallprompt removed.');
    };
  }, [handleBeforeInstallPrompt, isInstalled]);

  const triggerInstallPrompt = useCallback(async (): Promise<boolean> => {
    if (!deferredInstallPrompt) {
      console.log('[usePWAInstall] Install prompt not available.');
      setCanInstall(false); // Ensure canInstall is false if prompt is not available
      return false;
    }
    
    console.log('[usePWAInstall] Triggering install prompt...');
    try {
      await deferredInstallPrompt.prompt();
      const { outcome } = await deferredInstallPrompt.userChoice;
      console.log(`[usePWAInstall] User choice: ${outcome}`);

      if (outcome === 'accepted') {
        // Standalone mode detection effect will handle setting isInstalled and updating the profile.
        setIsInstalled(true); 
        console.log('[usePWAInstall] User accepted the PWA installation.');
      } else {
        console.log('[usePWAInstall] User dismissed the PWA installation.');
      }
      // Clear the deferred prompt; it can't be used again.
      deferredInstallPrompt = null; 
      setCanInstall(false); // Prompt is no longer available after being shown.
      return outcome === 'accepted';

    } catch (error) {
      console.error('[usePWAInstall] Error during install prompt:', error);
      // It's possible the prompt was invalidated or another error occurred.
      deferredInstallPrompt = null;
      setCanInstall(false);
      return false;
    }
  }, []);

  // Derived state: canInstall should only be true if not already installed.
  const actualCanInstall = canInstall && !isInstalled;

  return { canInstall: actualCanInstall, isInstalled, isIOS, triggerInstallPrompt };
} 