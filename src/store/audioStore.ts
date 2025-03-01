import { create } from 'zustand';
import { songAdapter } from '../utils/songAdapter';

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
    
    // If it's the same URL and audio exists, toggle play/pause
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

    // Stop any currently playing audio
    stopAllAudio();

    // Create and play new audio
    const audio = new Audio(url);
    audio.addEventListener('ended', () => {
      set({ isPlaying: false });
    });

    audio.play();
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