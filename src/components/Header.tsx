import { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import AuthModal from './auth/AuthModal';
import EmailSignupForm from './EmailSignupForm';
import ProfileModal from './profile/ProfileModal';
import { useErrorStore } from '../store/errorStore';
import { useEmailSignup } from '../hooks/useEmailSignup';

export default function Header() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const { user, signOut } = useAuthStore();
  const { error: authError } = useErrorStore();
  const { isOpen: isEmailSignupOpen, handleOpen: handleOpenEmailSignup, handleClose: handleCloseEmailSignup } = useEmailSignup();
  
  // Check for 'true' or 'TRUE' case-insensitively
  const isSignupDisabled = import.meta.env.VITE_DISABLE_SIGNUP?.toLowerCase() === 'true';

  // Force open the email signup form for testing
  useEffect(() => {
    if (isSignupDisabled && !user) {
      // Wait a bit to make sure everything is loaded
      const timer = setTimeout(() => {
        handleOpenEmailSignup();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isSignupDisabled, user, handleOpenEmailSignup]);

  useEffect(() => {
    if (authError) {
      console.error('Auth error:', authError);
    }
  }, [authError]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-background-dark/80 backdrop-blur-xl border-b border-white/[0.05] z-[100]">
        {authError && (
          <div className="absolute top-full left-0 right-0 bg-red-500/90 text-white text-sm py-2 px-4 text-center">
            {authError}
            <button
              onClick={() => window.location.reload()}
              className="ml-2 underline hover:no-underline"
            >
              Refresh Page
            </button>
          </div>
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <a href="/" className="flex items-center space-x-2 relative hover:opacity-80 transition-opacity">
              <img 
                src="/logo.png" 
                alt="BabyMusic AI Logo" 
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full transition-transform duration-300 ease-in-out hover:scale-105"
              /> 
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                BabyMusic AI
              </span>
            </a>
            <nav className="flex items-center space-x-4 relative">
              {user ? (
                <>
                  <button
                    onClick={() => setIsProfileModalOpen(true)}
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
                        // Force redirect to root after sign out to ensure landing page shows
                        window.location.href = '/'; 
                      } catch (error) {
                        console.error('Sign out failed:', error);
                        window.location.reload();
                      }
                    }}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  {isSignupDisabled ? (
                    <button
                      onClick={handleOpenEmailSignup}
                      className="btn-primary text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3"
                    >
                      Join Waitlist
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setAuthMode('signin');
                          setIsAuthModalOpen(true);
                        }}
                        className="btn-secondary text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3" 
                        data-auth-trigger
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => {
                          setAuthMode('signup');
                          setIsAuthModalOpen(true);
                        }}
                        className="btn-primary text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3"
                      >
                        Try Free
                      </button>
                    </>
                  )}
                </>
              )}
            </nav>
          </div>
        </div>
      </header>
      
      {isSignupDisabled ? (
        <EmailSignupForm
          isOpen={isEmailSignupOpen}
          onClose={handleCloseEmailSignup}
        />
      ) : (
        <AuthModal
          isOpen={isAuthModalOpen}
          defaultMode={authMode}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}
      
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </>
  );
}