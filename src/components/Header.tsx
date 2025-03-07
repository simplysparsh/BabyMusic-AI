import { useState, useEffect } from 'react';
import { Music2, Settings } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useErrorStore } from '../store/errorStore';
import AuthModal from './auth/AuthModal';
import EmailSignupForm from './EmailSignupForm';
import ProfileModal from './profile/ProfileModal';

export default function Header() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isEmailSignupOpen, setIsEmailSignupOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const { user, profile, signOut } = useAuthStore();
  const { error, clearError } = useErrorStore();

  // Handle client-side only operations
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Handle email signup form visibility
  useEffect(() => {
    if (isMounted && import.meta.env.VITE_DISABLE_SIGNUP?.toLowerCase() === 'true' && !user && !isEmailSignupOpen) {
      setIsEmailSignupOpen(true);
    }
  }, [isMounted, user, isEmailSignupOpen]);

  const handleAuthClick = () => {
    clearError();
    setIsAuthModalOpen(true);
  };

  const handleProfileClick = () => {
    setIsProfileModalOpen(true);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-background-dark/80 backdrop-blur-xl border-b border-white/[0.05] z-[100] will-change-transform">
      {error && (
        <div className="absolute top-full left-0 right-0 bg-red-500/90 text-white text-sm py-2 px-4 text-center">
          {error}
          <button
            onClick={() => window.location.reload()}
            className="ml-2 underline hover:no-underline"
          >
            Refresh Page
          </button>
        </div>
      )}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-2 relative">
            <Music2 className="w-6 h-6 sm:w-8 sm:h-8 text-primary animate-float" />
            <a href="/" className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              BabyMusic AI
            </a>
          </div>
          
          <div className="flex items-center">
            {isMounted && user ? (
              <>
                <button
                  onClick={handleProfileClick}
                  className="fixed-button w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full
                           bg-white/10 text-white/80 hover:text-white hover:bg-white/20 
                           transition-all duration-300 hover:scale-105 shadow-lg shadow-black/5
                           relative z-[101]"
                >
                  <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  className="text-white/80 hover:text-white transition-all duration-300 px-3 py-1.5 sm:px-4 sm:py-2 
                           hover:bg-white/5 rounded-lg text-sm sm:text-base active:scale-95"
                  onClick={async () => {
                    try {
                      await signOut();
                    } catch (error) {
                      console.error('Sign out failed:', error);
                      window.location.reload();
                    }
                  }}
                >
                  Sign Out
                </button>
                <ProfileModal
                  isOpen={isProfileModalOpen}
                  onClose={() => setIsProfileModalOpen(false)}
                />
              </>
            ) : (
              <>
                <button
                  onClick={handleAuthClick}
                  className="btn-secondary text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3" 
                  data-auth-trigger
                >
                  Sign In
                </button>
                {isMounted && (
                  <>
                    <AuthModal
                      isOpen={isAuthModalOpen}
                      onClose={() => setIsAuthModalOpen(false)}
                    />
                    {import.meta.env.VITE_DISABLE_SIGNUP?.toLowerCase() === 'true' && (
                      <EmailSignupForm
                        isOpen={isEmailSignupOpen}
                        onClose={() => setIsEmailSignupOpen(false)}
                      />
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}