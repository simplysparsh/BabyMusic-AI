import { create } from 'zustand';
import { useAuthStore } from './authStore';
import { useErrorStore } from './errorStore';

const MONTHLY_PLAY_LIMIT = 25;

interface AudioState {
  currentAudio: HTMLAudioElement | null;
  isPlaying: boolean;
  currentUrl: string | null;
  stopAllAudio: () => void;
  playAudio: (url: string) => void;
  pauseAudio: () => void;
}

export const useAudioStore = create<AudioState>((set, get) => ({
  currentAudio: null,
  isPlaying: false,
  currentUrl: null,

  stopAllAudio: () => {
    const { currentAudio } = get();
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    set({ isPlaying: false, currentUrl: null });
  },

  playAudio: (url: string) => {
    const { currentAudio, currentUrl, stopAllAudio } = get();
    const { profile, incrementPlayCount } = useAuthStore.getState();
    const errorStore = useErrorStore.getState();
    
    let playAllowed = true;
    let shouldIncrement = false;
    if (profile && !profile.isPremium) {
      if (profile.monthlyPlaysCount >= MONTHLY_PLAY_LIMIT) {
         console.warn(`Play limit reached for user ${profile.id}. Plays: ${profile.monthlyPlaysCount}`);
         errorStore.setError('Monthly play limit reached. Upgrade to Premium for unlimited listening!');
         playAllowed = false;
      } else {
        shouldIncrement = true; 
      }
    }
    
    if (!playAllowed) {
      return;
    }
    
    errorStore.clearError();
    
    if (url === currentUrl && currentAudio) {
      if (currentAudio.paused) {
        currentAudio.play();
        set({ isPlaying: true });
      } else {
        currentAudio.pause();
        set({ isPlaying: false });
      }
      return;
    }

    stopAllAudio();

    const audio = new Audio(url);
    audio.addEventListener('ended', () => {
      set({ isPlaying: false, currentUrl: null });
    });

    audio.play().then(() => {
       if (shouldIncrement) {
         console.log(`Incrementing play count for user ${profile?.id}`);
         incrementPlayCount();
       }
    }).catch(err => {
       console.error("Error playing audio:", err);
       errorStore.setError("Could not play audio.");
       set({ isPlaying: false, currentUrl: null, currentAudio: null });
    });

    set({ 
      currentAudio: audio, 
      currentUrl: url,
      isPlaying: true 
    });
  },

  pauseAudio: () => {
    const { currentAudio } = get();
    if (currentAudio) {
      currentAudio.pause();
      set({ isPlaying: false });
    }
  }
}));