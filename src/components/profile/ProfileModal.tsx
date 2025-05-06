import { FormEvent, useEffect, useState } from 'react';
import { X, Star, Settings } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useErrorStore } from '../../store/errorStore';
import { supabaseWithRetry, forceTokenRefresh } from '../../lib/supabase';
import { Language, DEFAULT_LANGUAGE } from '../../types';
import { CURRENT_YEAR, CURRENT_MONTH, AGE_OPTIONS } from './utils/dateUtils';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { profile, updateProfile } = useAuthStore();
  const { error: globalError, setError: setGlobalError, clearError } = useErrorStore();
  const [formState, setFormState] = useState({
    babyName: '',
    gender: '',
    birthMonth: CURRENT_MONTH,
    birthYear: CURRENT_YEAR,
    preferredLanguage: DEFAULT_LANGUAGE,
  });
  const [localError, setLocalError] = useState<{
    global?: string;
    babyName?: string;
    gender?: string;
    birthDate?: string;
  }>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isPortalLoading, setIsPortalLoading] = useState(false);

  useEffect(() => {
    if (isOpen && profile) {
      setFormState({ 
        babyName: profile.babyName ?? '',
        gender: profile.gender ?? '',
        birthMonth: profile.birthMonth || CURRENT_MONTH,
        birthYear: profile.birthYear || CURRENT_YEAR,
        preferredLanguage: profile.preferredLanguage || DEFAULT_LANGUAGE,
      });
      setLocalError({});
      setShowSuccess(false);
      setIsPortalLoading(false);
      clearError();
    }
  }, [isOpen, profile, clearError]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showSuccess) {
      timer = setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [showSuccess, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError({});
    clearError();

    const trimmedName = formState.babyName.trim();
    if (!trimmedName) {
      setLocalError({ babyName: "Please enter your baby's name" });
      return;
    }

    if (!formState.gender) {
      setLocalError({ gender: "Please select your baby's gender" });
      return;
    }
    
    const selectedDate = new Date(formState.birthYear, formState.birthMonth - 1);
    if (selectedDate > new Date()) {
      setLocalError({ birthDate: "Birth date cannot be in the future" });
      return;
    }
    
    try {
      await updateProfile({ 
        babyName: trimmedName,
        gender: formState.gender,
        birthMonth: formState.birthMonth,
        birthYear: formState.birthYear,
        preferredLanguage: formState.preferredLanguage,
      });
      setShowSuccess(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update profile";
      if (!errorMessage.includes('preset') && !errorMessage.includes('songs')) {
         setGlobalError(errorMessage);
      }
    }
  };

  const handleManageSubscription = async () => {
    setLocalError({});
    clearError();
    setIsPortalLoading(true);

    try {
      // Refresh token before creating portal session
      await forceTokenRefresh();
      
      const { data, error } = await supabaseWithRetry.functions.invoke('create-customer-portal-session');

      if (error) {
        console.error('Error invoking create-customer-portal-session:', error);
        throw new Error(error.message || 'Could not open management portal.');
      }

      if (data?.url) {
        console.log('Redirecting to Stripe Customer Portal...');
        window.location.href = data.url;
      } else {
         throw new Error('Invalid response from portal function.');
      }

    } catch (err) {
      console.error('Stripe portal initiation failed:', err);
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      setGlobalError(`Failed to manage subscription: ${message}`);
      setIsPortalLoading(false); 
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md z-50 flex items-center justify-center">
      <div className="card p-8 w-full max-w-md mx-4 relative border-white/[0.05] fade-in">
        
        {showSuccess && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-60 rounded-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-white font-medium">Profile Updated Successfully!</p>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white/60 hover:text-white transition-all duration-300 hover:rotate-90"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-3xl font-bold text-white mb-8">Profile Settings</h2>

        <div className="mb-6 p-4 rounded-lg bg-white/5 border border-white/10">
          <h3 className="text-sm font-medium text-white/60 mb-2">Subscription Status</h3>
          {profile?.isPremium ? (
            <div className="flex items-center justify-between gap-2">
              <p className="flex items-center gap-2 font-semibold text-green-400">
                <Star className="w-4 h-4 fill-current text-yellow-400" /> Premium
              </p>
              <button
                onClick={handleManageSubscription}
                disabled={isPortalLoading}
                className={`px-3 py-1 rounded-md bg-white/10 text-xs text-white/80 font-medium hover:bg-white/20 transition-colors duration-300 flex items-center gap-1.5 ${isPortalLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isPortalLoading ? (
                  'Loading...'
                ) : (
                  <>
                    <Settings className="w-3 h-3" /> Manage
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold text-white/80">Free Plan</p>
              <a 
                href="/premium" 
                onClick={onClose}
                className="px-3 py-1 rounded-md bg-gradient-to-r from-primary to-secondary text-xs text-black font-bold hover:opacity-90 transition-opacity duration-300 shadow-sm"
              >
                Upgrade
              </a>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Baby's Name
              <span className="text-primary ml-1" title="Required">*</span>
            </label>
            <input
              type="text"
              value={formState.babyName}
              onChange={(e) => setFormState((prev) => ({ ...prev, babyName: e.target.value }))}
              className={`input w-full ${localError.babyName ? 'border-red-400' : ''}`}
              placeholder="Enter your baby's name"
              required
            />
            {localError.babyName && <p className="text-red-400 text-sm mt-1">{localError.babyName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Baby's Gender
              <span className="text-primary ml-1" title="Required">*</span>
            </label>
            <select
              value={formState.gender}
              onChange={(e) => setFormState((prev) => ({ ...prev, gender: e.target.value }))}
              className={`input w-full ${localError.gender ? 'border-red-400' : ''}`}
              required
            >
              <option value="">Select gender</option>
              <option value="boy">Boy</option>
              <option value="girl">Girl</option>
              <option value="other">Other</option>
            </select>
            {localError.gender && <p className="text-red-400 text-sm mt-1">{localError.gender}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Baby's Birth Date
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <select
                  value={formState.birthMonth}
                  onChange={(e) => setFormState((prev) => ({ ...prev, birthMonth: parseInt(e.target.value) }))}
                  className={`input w-full bg-white/[0.07] hover:bg-white/[0.09] transition-colors ${localError.birthDate ? 'border-red-400' : ''}`}
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(2000, i).toLocaleString('default', { month: 'long' })}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  value={formState.birthYear}
                  onChange={(e) => setFormState((prev) => ({ ...prev, birthYear: parseInt(e.target.value) }))}
                  className={`input w-full bg-white/[0.07] hover:bg-white/[0.09] transition-colors ${localError.birthDate ? 'border-red-400' : ''}`}
                >
                  {AGE_OPTIONS.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
            {localError.birthDate && <p className="text-red-400 text-sm mt-1">{localError.birthDate}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Preferred Language
            </label>
            <select
              value={formState.preferredLanguage}
              onChange={(e) => setFormState((prev) => ({ ...prev, preferredLanguage: e.target.value as Language }))}
              className={`input w-full bg-white/[0.07] hover:bg-white/[0.09] transition-colors`}
              disabled={true}
            >
              <option value="en">English</option>
            </select>
          </div>

          {(localError.global || globalError) && (
            <p className="text-red-400 text-sm mt-1">{localError.global || globalError}</p>
          )}

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-6 py-2 rounded-xl bg-white/10 text-white/80 hover:bg-white/20 transition-all duration-300">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
