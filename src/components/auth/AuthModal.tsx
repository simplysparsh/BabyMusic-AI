import { FormEvent, useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { X } from 'lucide-react';
import SocialAuthButtons from './SocialAuthButtons';

// Read the feature flag
const enableGoogleOAuth = import.meta.env.VITE_ENABLE_GOOGLE_OAUTH === 'true';

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
  const [gender, setGender] = useState('');
  const [genderError, setGenderError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'credentials' | 'babyNameFirst' | 'babyName'>(
    isSignIn ? 'credentials' : 'babyNameFirst'
  );
  const { signIn, signUp } = useAuthStore();

  useEffect(() => {
    if (isOpen) {
      setIsSignIn(defaultMode === 'signin');
      setStep(defaultMode === 'signin' ? 'credentials' : 'babyNameFirst');
      setEmail('');
      setPassword('');
      setBabyName('');
      setError('');
      setBabyNameError('');
      setGender('');
      setGenderError('');
    }
  }, [isOpen, defaultMode]);

  const shouldShowOAuthOptions = () => {
    return enableGoogleOAuth && (isSignIn || (!isSignIn && step === 'babyNameFirst'));
  };

  if (!isOpen) return null;

  const handleBabyNameFirstSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedBabyName = babyName.trim();
    
    if (!trimmedBabyName) {
      setBabyNameError('Please enter your baby\'s name');
      return;
    }
    
    setBabyNameError('');
    setStep('credentials');
  };

  const handleCredentialsSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (isSignIn) {
      try {
        await signIn(email, password);
        onClose();
      } catch (err: unknown) {
        if (err && typeof err === 'object' && 'message' in err) {
          const message = (err as { message: string }).message;
          if (message.includes('Invalid login credentials')) {
            setError('No account found with this email/password. Please check your credentials or sign up.');
          } else {
            setError(message || 'An unknown sign-in error occurred.');
          }
        } else {
          setError('An unexpected error occurred during sign in.');
        }
        console.error("Sign-in error:", err);
      } finally {
        setIsLoading(false);
      }
    } else {
      setBabyNameError('');
      setGenderError('');
      
      const trimmedBabyName = babyName.trim();
      const trimmedEmail = email.trim();
      
      if (!gender) {
        setGenderError('Please select your baby\'s gender');
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
        console.log('Starting signup process with gender:', gender);
        await signUp(trimmedEmail, password, trimmedBabyName, gender);
        console.log('Signup successful, closing modal...');
        onClose();
      } catch (err) {
        console.error('Signup error:', err);
        const message = err instanceof Error ? err.message : 'An error occurred';
        setError(
          message.includes('already registered') 
            ? 'This email is already registered. Please sign in instead.'
            : message
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (step === 'credentials' && !isSignIn) {
      setStep('babyNameFirst');
    } else if (step === 'babyName') {
      setStep('credentials');
    }
    setError('');
  };

  const renderStep = () => {
    switch (step) {
      case 'babyNameFirst':
        return (
          <form onSubmit={handleBabyNameFirstSubmit} className="space-y-6">
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
                autoFocus
              />
              {babyNameError && (
                <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
                  <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                  {babyNameError}
                </p>
              )}
              <p className="text-xs text-white/40 mt-2 whitespace-nowrap overflow-hidden text-ellipsis">
                To personalize songs for your little one
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-secondary text-black font-medium
                       py-2 rounded-xl hover:opacity-90 transition-all duration-300
                       shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40
                       hover:scale-[1.02] active:scale-[0.98]"
            >
              Next
            </button>
          </form>
        );

      case 'credentials':
        return (
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
                autoComplete={isSignIn ? "email" : "username"}
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
                autoComplete={isSignIn ? "current-password" : "new-password"}
              />
            </div>

            {!isSignIn && (
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Baby's Gender
                  <span className="text-primary ml-1">*</span>
                </label>
                <select
                  value={gender}
                  onChange={(e) => {
                    setGender(e.target.value);
                    setGenderError('');
                  }}
                  className={`input w-full bg-white/[0.07] focus:bg-white/[0.09] transition-colors ${genderError ? 'border-red-400 focus:border-red-400' : ''}`}
                  required
                >
                  <option value="">Select gender</option>
                  <option value="boy">Boy</option>
                  <option value="girl">Girl</option>
                  <option value="other">Other</option>
                </select>
                {genderError && (
                  <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
                    <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                    {genderError}
                  </p>
                )}
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
            
            <div className="flex gap-3">
              {!isSignIn && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 bg-white/5 text-white py-2 rounded-xl border border-white/10
                           hover:bg-white/10 transition-all duration-300 hover:border-white/20"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className={`flex-1 bg-gradient-to-r from-primary to-secondary text-black font-medium
                         py-2 rounded-xl hover:opacity-90 transition-all duration-300
                         shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40
                         hover:scale-[1.02] active:scale-[0.98]
                         disabled:opacity-50 disabled:cursor-not-allowed
                         disabled:hover:scale-100 disabled:hover:shadow-none`}
              >
                {isSignIn ? (
                  isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-black/20 border-t-black/80 rounded-full animate-spin"></div>
                      <span>Signing In...</span>
                    </div>
                  ) : 'Sign In'
                ) : (
                  isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-black/20 border-t-black/80 rounded-full animate-spin"></div>
                      <span>Creating Account...</span>
                    </div>
                  ) : 'Sign Up'
                )}
              </button>
            </div>
          </form>
        );
        
      case 'babyName':
        return (
          <div className="space-y-6">
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
                className="flex-1 bg-white/5 text-white py-3 rounded-xl border border-white/10
                         hover:bg-white/10 transition-all duration-300 hover:border-white/20"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep('credentials')}
                className="flex-1 bg-gradient-to-r from-primary to-secondary text-black font-medium
                         py-2 rounded-xl hover:opacity-90 transition-all duration-300
                         shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40
                         hover:scale-[1.02] active:scale-[0.98]"
              >
                Next
              </button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

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
        
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary via-white to-secondary 
                     bg-clip-text text-transparent mb-2">
          {isSignIn 
            ? 'Welcome Back' 
            : 'Create Account'}
        </h2>
        {isSignIn && (
          <p className="text-white/60 text-sm mb-8">
            Sign in to continue your musical journey
          </p>
        )}
        {(!isSignIn && step !== 'babyNameFirst') && (
          <p className="text-white/60 text-sm mb-8">
            Set up your account to start your baby's musical adventure
          </p>
        )}
        
        {/* OAuth sign-up */}
        {shouldShowOAuthOptions() && step === 'babyNameFirst' && (
          <div className="mt-6 mb-4">
            <SocialAuthButtons mode="signup" />
          </div>
        )}
        
        {/* "or" divider between Google and baby info */}
        {shouldShowOAuthOptions() && step === 'babyNameFirst' && (
          <div className="my-4 text-center relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative">
              <span className="px-4 text-sm bg-[#2A2D3E] text-white/40">or</span>
            </div>
          </div>
        )}
        
        {/* Baby name form with dedicated heading */}
        {(!isSignIn && step === 'babyNameFirst') && (
          <div className="mt-4">
            <h3 className="text-base sm:text-lg font-medium text-white mb-3">Tell Us About Your Baby</h3>
          </div>
        )}
        
        {renderStep()}

        {shouldShowOAuthOptions() && step !== 'babyNameFirst' && (
          <>
            <div className="my-6 text-center relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative">
                <span className="px-4 text-sm bg-[#2A2D3E] text-white/40">or</span>
              </div>
            </div>
            <div className="mt-6">
              <SocialAuthButtons mode={isSignIn ? 'signin' : 'signup'} />
            </div>
          </>
        )}
        
        <p className="mt-6 text-center text-white/60 text-sm">
          {isSignIn ? "Don't have an account?" : "Already have an account?"}{' '}
          <button
            onClick={() => {
              setIsSignIn(!isSignIn);
              setStep(isSignIn ? 'babyNameFirst' : 'credentials');
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