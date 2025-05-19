import { create } from 'zustand';
import { SignupMethod } from './authStore';

interface UIState {
  isOnboardingOpen: boolean;
  signupMethod: SignupMethod | null;
  openOnboarding: (method: SignupMethod) => void;
  closeOnboarding: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isOnboardingOpen: false,
  signupMethod: null,
  openOnboarding: (method) => set({ isOnboardingOpen: true, signupMethod: method }),
  closeOnboarding: () => set({ isOnboardingOpen: false, signupMethod: null }),
})); 