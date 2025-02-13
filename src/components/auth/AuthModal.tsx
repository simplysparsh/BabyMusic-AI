import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [babyName, setBabyName] = useState('');
  const [babyNameError, setBabyNameError] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState<'credentials' | 'babyName'>('credentials');
  const { signIn, signUp } = useAuthStore();

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
    setBabyNameError('');
    
    if (!babyName.trim()) {
      setBabyNameError('Please enter your baby\'s name');
      return;
    }
    
    try {
      await signUp(email, password, babyName);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleBack = () => {
    setStep('credentials');
    setError('');
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md z-50 flex items-center justify-center">
      <div className="card p-8 w-full max-w-md mx-4 relative border-white/[0.05] fade-in">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white/60 hover:text-white
                   transition-all duration-300 hover:rotate-90"
        >
          <X className="w-5 h-5" />
        </button>
        
        <h2 className="text-3xl font-bold text-white mb-8">
          {isSignIn ? 'Welcome Back' : step === 'credentials' ? 'Create Account' : 'One Last Step'}
        </h2>
        
        {step === 'credentials' ? (
          <form onSubmit={handleCredentialsSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input w-full"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input w-full"
              required
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-secondary text-white
                     py-3 rounded-xl hover:opacity-90 transition-all duration-300
                     shadow-lg shadow-primary/25"
          >
            {isSignIn ? 'Sign In' : 'Next'}
          </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                What's your baby's name?
                <span className="text-primary ml-1">*</span>
              </label>
              <input
                type="text"
                value={babyName}
                onChange={(e) => setBabyName(e.target.value)}
                className={`input w-full ${babyNameError ? 'border-red-400' : ''}`}
                required
                placeholder="Enter your baby's name"
              />
              {babyNameError && (
                <p className="text-red-400 text-sm mt-1">{babyNameError}</p>
              )}
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 bg-white/10 text-white py-3 rounded-xl
                         hover:bg-white/20 transition-all duration-300"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-primary to-secondary text-white
                         py-3 rounded-xl hover:opacity-90 transition-all duration-300
                         shadow-lg shadow-primary/25"
              >
                Complete Sign Up
              </button>
            </div>
          </form>
        )}
        
        <p className="mt-6 text-center text-white/60">
          {isSignIn ? "Don't have an account?" : "Already have an account?"}{' '}
          <button
            onClick={() => {
              setIsSignIn(!isSignIn);
              setStep('credentials');
              setError('');
            }}
            className="text-primary hover:text-secondary transition-colors"
          >
            {isSignIn ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
}