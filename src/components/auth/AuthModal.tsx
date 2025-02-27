import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { X } from 'lucide-react';
import OnboardingModal from './OnboardingModal';
import type { BabyProfile } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'signin' | 'signup';
}

export default function AuthModal({ isOpen, onClose, defaultMode = 'signin' }: AuthModalProps) {
  const [isSignIn, setIsSignIn] = useState(defaultMode === 'signin');
  const [email, setEmail] = useState('');
  const [babyName, setBabyName] = useState('');
  const [babyNameError, setBabyNameError] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [step, setStep] = useState<'credentials' | 'babyName'>('credentials');
  const { signIn, signUp } = useAuthStore();

  useEffect(() => {
    if (isOpen) {
      setIsSignIn(defaultMode === 'signin');
      setStep('credentials');
      setEmail('');
      setPassword('');
      setBabyName('');
      setError('');
      setBabyNameError('');
    }
  }, [isOpen, defaultMode]);

  if (!isOpen) return null;

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignIn) {
      setError('');
      try {
        await signIn(email, password);
        onClose();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An error occurred';
        if (message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please try again.');
        } else {
          setError(message);
        }
      }
    } else {
      setStep('babyName');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setIsLoading(true);
    setBabyNameError('');
    
    const trimmedBabyName = babyName.trim();
    const trimmedEmail = email.trim();
    
    // Client-side validation
    if (!trimmedBabyName) {
      setBabyNameError('Please enter your baby\'s name');
      setIsLoading(false);
      setIsLoading(false);
      return;
    }
    
    if (!trimmedEmail) {
      setError('Please enter your email');
      setIsLoading(false);
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }
    
    try {
      await signUp(trimmedEmail, password, trimmedBabyName);
      setShowOnboarding(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(
        message.includes('already registered') 
          ? 'This email is already registered. Please sign in instead.'
          : message
      );
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnboardingComplete = (babyProfile: BabyProfile) => {
    setShowOnboarding(false);
    onClose();
  };

  const handleBack = () => {
    setStep('credentials');
    setError('');
  };

  if (showOnboarding) {
    return (
      <OnboardingModal
        isOpen={true}
        onComplete={handleOnboardingComplete}
        initialBabyName={babyName.trim()}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-lg z-50 flex items-center justify-center p-4">
      <div className="card w-full max-w-md relative border-white/[0.05] fade-in overflow-hidden">
        {/* Animated background gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-secondary/20 via-transparent to-transparent animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* Floating particles */}
        <div className="absolute top-12 left-12 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-12 right-12 w-20 h-20 bg-secondary/10 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative p-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white/60 hover:text-white bg-white/5 rounded-full p-2
                   transition-all duration-300 hover:rotate-90 hover:bg-white/10 hover:scale-110"
        >
          <X className="w-5 h-5" />
        </button>
        
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary via-white to-secondary 
                     bg-clip-text text-transparent mb-2">
          {isSignIn ? 'Welcome Back' : step === 'credentials' ? 'Create Account' : 'One Last Step'}
        </h2>
        <p className="text-white/60 text-sm mb-8">
          {isSignIn 
            ? "Sign in to continue your musical journey" 
            : step === 'credentials' 
              ? "Create an account to start your baby's musical adventure"
              : "Tell us about your little one"}
        </p>
        
        {step === 'credentials' ? (
          <form onSubmit={handleCredentialsSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Email
              <span className="text-primary ml-1">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input w-full bg-white/[0.07] focus:bg-white/[0.09] transition-colors"
              required
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Password
              <span className="text-primary ml-1">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input w-full bg-white/[0.07] focus:bg-white/[0.09] transition-colors"
              required
              placeholder={isSignIn ? "Enter your password" : "Create a password"}
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-secondary text-black font-medium
                     py-3 rounded-xl hover:opacity-90 transition-all duration-300 mt-6
                     shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40
                     hover:scale-[1.02] active:scale-[0.98]"
          >
            {isSignIn ? 'Sign In' : 'Next'}
          </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                What's your baby's name?
                <span className="text-primary ml-1">*</span>
              </label>
              <input
                type="text"
                value={babyName}
                onChange={(e) => setBabyName(e.target.value)}
                className={`input w-full bg-white/[0.07] focus:bg-white/[0.09] transition-colors
                         ${babyNameError ? 'border-red-400 focus:border-red-400' : ''}`}
                required
                placeholder="Enter your baby's name"
              />
              {babyNameError && (
                <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
                  <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                  {babyNameError}
                </p>
              )}
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleBack}
                disabled={isLoading}
                className="flex-1 bg-white/5 text-white py-3 rounded-xl border border-white/10
                         hover:bg-white/10 transition-all duration-300 hover:border-white/20
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-primary to-secondary text-black font-medium
                         py-3 rounded-xl hover:opacity-90 transition-all duration-300
                         shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40
                         hover:scale-[1.02] active:scale-[0.98]
                         disabled:opacity-50 disabled:cursor-not-allowed
                         disabled:hover:scale-100 disabled:hover:shadow-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-black/20 border-t-black/80 rounded-full animate-spin"></div>
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  'Complete Sign Up'
                )}
              </button>
            </div>
          </form>
        )}
        
        <div className="mt-8 text-center relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative">
            <span className="px-4 text-sm bg-[#2A2D3E] text-white/40">or</span>
          </div>
        </div>
        
        <p className="mt-6 text-center text-white/60 text-sm">
          {isSignIn ? "Don't have an account?" : "Already have an account?"}{' '}
          <button
            onClick={() => {
              setIsSignIn(!isSignIn);
              setStep('credentials');
              setError('');
            }}
            className="text-primary hover:text-secondary transition-colors font-medium"
          >
            {isSignIn ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
        </div>
      </div>
    </div>
  );
}