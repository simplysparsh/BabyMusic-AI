import React from 'react';
import { Music2, Settings } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import AuthModal from './auth/AuthModal';
import ProfileModal from './profile/ProfileModal';
import { useEffect } from 'react';

export default function Header() {
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
  const [authMode, setAuthMode] = React.useState<'signin' | 'signup'>('signup');
  const [isProfileModalOpen, setIsProfileModalOpen] = React.useState(false);
  const { user, signOut, error: authError } = useAuthStore();

  useEffect(() => {
    if (authError) {
      console.error('Auth error detected:', authError);
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
            <div className="flex items-center space-x-2 relative">
              <Music2 className="w-6 h-6 sm:w-8 sm:h-8 text-primary animate-float" />
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {user ? 'Studio' : 'BabyMusic AI'}
              </span>
            </div>
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
                    onClick={() => signOut()}
                    className="text-white/80 hover:text-white transition-colors px-3 py-1.5 sm:px-4 sm:py-2 hover:bg-white/5 rounded-lg text-sm sm:text-base"
                  >
                    Sign Out
                  </button>
                </>
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
            </nav>
          </div>
        </div>
      </header>
      <AuthModal
        isOpen={isAuthModalOpen}
        defaultMode={authMode}
        onClose={() => setIsAuthModalOpen(false)}
      />
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </>
  );
}