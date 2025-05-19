import { useState, useEffect } from 'react';
import { Baby, ArrowRight, Calendar, Download, CheckCircle, XCircle, Smartphone } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import type { AgeGroup, BabyProfile, Language } from '../../types';
import { DEFAULT_LANGUAGE } from '../../types';
import InstallPWAButton from '../common/InstallPWAButton';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { SongService } from '../../services/songService';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (updates: Partial<BabyProfile> & { babyName?: string; gender?: string }) => void;
  userProfile: BabyProfile | null;
  onShouldShowIOSInstallInstructions?: () => void;
}

const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_MONTH = new Date().getMonth() + 1;

// Calculate years for dropdown (current year down to 5 years ago)
const YEARS = Array.from(
  { length: 6 },
  (_, i) => CURRENT_YEAR - i
);

// Add "Older" option for future expansion
const AGE_OPTIONS = [
  ...YEARS.map(year => ({ value: year, label: year.toString() })),
  { value: CURRENT_YEAR - 6, label: 'Older' }
];

// Define onboarding steps
type OnboardingStep = 'infoCollection' | 'pwaInstallPrompt' | 'completed';

const getAgeGroup = (month: number, year: number): AgeGroup => {
  const ageInMonths = ((CURRENT_YEAR - year) * 12) + (CURRENT_MONTH - month);
  if (ageInMonths <= 6) return '0-6';
  if (ageInMonths <= 12) return '7-12';
  return '13-24';
};

export default function OnboardingModal({ isOpen, onComplete, userProfile, onShouldShowIOSInstallInstructions }: OnboardingModalProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [babyName, setBabyName] = useState(userProfile?.babyName || '');
  const [gender, setGender] = useState(userProfile?.gender || '');
  const [birthMonth, setBirthMonth] = useState<number>(userProfile?.birthMonth || CURRENT_MONTH);
  const [birthYear, setBirthYear] = useState<number>(userProfile?.birthYear || CURRENT_YEAR);
  const [preferredLanguage, setPreferredLanguage] = useState<Language>(userProfile?.preferredLanguage || DEFAULT_LANGUAGE);
  const [error, setError] = useState<string | null>(null);
  const [birthDateError, setBirthDateError] = useState<string | null>(null);
  const [babyNameError, setBabyNameError] = useState<string | null>(null);
  const [genderError, setGenderError] = useState<string | null>(null);
  const { user, updateProfile, clearOnboardingInProgress } = useAuthStore();
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('infoCollection');
  const { canInstall, isInstalled, isIOS } = usePWAInstall();
  const [showPwaInstallMessage, setShowPwaInstallMessage] = useState(false);
  const [pwaInstallOutcome, setPwaInstallOutcome] = useState<'success' | 'skipped' | 'failed' | null>(null);

  const needsBabyInfo = !userProfile?.babyName || !userProfile?.gender;

  useEffect(() => {
    if (isOpen && userProfile) {
      console.log('OnboardingModal opened for user profile:', userProfile);
      setOnboardingStep('infoCollection');
      setBabyName(userProfile.babyName || '');
      setGender(userProfile.gender || '');
      setBirthMonth(userProfile.birthMonth || CURRENT_MONTH);
      setBirthYear(userProfile.birthYear || CURRENT_YEAR);
      setPreferredLanguage(userProfile.preferredLanguage || DEFAULT_LANGUAGE);
      setError(null);
      setBirthDateError(null);
      setBabyNameError(null);
      setGenderError(null);
      setIsUpdating(false);
      setShowPwaInstallMessage(false);
      setPwaInstallOutcome(null);
    } else if (isOpen) {
      setOnboardingStep('infoCollection');
      setBabyName('');
      setGender('');
      setBirthMonth(CURRENT_MONTH);
      setBirthYear(CURRENT_YEAR);
      setPreferredLanguage(DEFAULT_LANGUAGE);
      setError(null);
      setBirthDateError(null);
      setBabyNameError(null);
      setGenderError(null);
      setIsUpdating(false);
      setShowPwaInstallMessage(false);
      setPwaInstallOutcome(null);
    }
  }, [isOpen, userProfile]);

  if (!isOpen || !userProfile) return null;

  const handleInfoSubmit = async () => {
    // Reset errors
    setError(null);
    setBirthDateError(null);
    setBabyNameError(null);
    setGenderError(null);

    let hasError = false;

    // Validate baby name if it was required
    if (needsBabyInfo && !babyName.trim()) {
      setBabyNameError('Please enter your baby\'s name');
      hasError = true;
    }

    // Validate gender if it was required
    if (needsBabyInfo && !gender) {
      setGenderError('Please select your baby\'s gender');
      hasError = true;
    }
    
    // Validate birth date (UI only)
    const currentDate = new Date();
    const selectedDate = new Date(birthYear, birthMonth - 1);
    
    if (selectedDate > currentDate) {
      setBirthDateError("Birth date cannot be in the future");
      hasError = true;
    }

    if (hasError) return; // Stop if validation failed
    
    try {
      const finalAgeGroup = getAgeGroup(birthMonth, birthYear); 
      const profileUpdates = {
        babyName: babyName.trim(),
        gender: gender,
        birthMonth,
        birthYear,
        ageGroup: finalAgeGroup,
        preferredLanguage,
      };

      console.log('Completing onboarding with data:', profileUpdates);
      setIsUpdating(true);
      
      if (user && user.id) {
        await updateProfile(profileUpdates);
        // Only for OAuth: trigger initial song regeneration after onboarding info is saved
        // Detect OAuth by checking if showPostOAuthOnboarding was true or if profile was missing name/gender before
        // For simplicity, assume if userProfile.babyName is missing, it's OAuth onboarding
        if (!userProfile?.babyName && !userProfile?.gender) {
          await SongService.regeneratePresetSongs(user.id, profileUpdates.babyName, profileUpdates.gender, true);
        }
        setOnboardingStep('pwaInstallPrompt');
      } else {
        console.error('User ID not available in OnboardingModal for updateProfile');
        setError('User session error. Please try again.');
      }
      
    } catch (error) {
      console.error('Failed to update profile during onboarding:', error);
      setError(error instanceof Error ? error.message : 'Failed to save information. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const currentBabyName = babyName || userProfile.babyName || 'your baby';

  const handleFinishOnboarding = () => {
    setOnboardingStep('completed');
    const finalAgeGroup = getAgeGroup(birthMonth, birthYear);
    const profileUpdatesForCallback = {
      babyName: babyName.trim(),
      gender: gender,
      birthMonth,
      birthYear,
      ageGroup: finalAgeGroup,
      preferredLanguage,
    };
    clearOnboardingInProgress();
    onComplete(profileUpdatesForCallback); 
  };

  const renderInfoCollectionStep = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
          <Baby className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Tell Us More</h2>
          <p className="text-white/60">Help us personalize the experience for {currentBabyName}</p>
        </div>
      </div>

      {needsBabyInfo && (
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            What's your baby's name?
            <span className="text-primary ml-1" title="Required">*</span>
          </label>
          <input
            type="text"
            value={babyName}
            onChange={(e) => {
              setBabyName(e.target.value);
              if (babyNameError) setBabyNameError(null);
            }}
            className={`input w-full bg-white/[0.07] hover:bg-white/[0.09] transition-colors ${babyNameError ? 'border-red-400' : ''}`}
            required
            placeholder="Enter your baby's name"
            autoFocus
          />
          {babyNameError && <p className="text-red-400 text-sm mt-1">{babyNameError}</p>}
        </div>
      )}

      {needsBabyInfo && (
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Baby's Gender
            <span className="text-primary ml-1" title="Required">*</span>
          </label>
          <select
            value={gender}
            onChange={(e) => {
              setGender(e.target.value);
              if (genderError) setGenderError(null);
            }}
            className={`input w-full bg-white/[0.07] hover:bg-white/[0.09] transition-colors ${genderError ? 'border-red-400' : ''}`}
            required
          >
            <option value="">Select gender</option>
            <option value="boy">Boy</option>
            <option value="girl">Girl</option>
            <option value="other">Other</option>
          </select>
          {genderError && <p className="text-red-400 text-sm mt-1">{genderError}</p>}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-white/90 mb-2">
          When was {needsBabyInfo ? 'your baby' : currentBabyName} born?
          <span className="text-primary ml-1" title="Required">*</span>
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <select
              value={birthMonth}
              onChange={(e) => setBirthMonth(parseInt(e.target.value))}
              className={`input w-full bg-white/[0.07] hover:bg-white/[0.09] transition-colors ${birthDateError ? 'border-red-400' : ''}`}
              required
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(2000, i).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>
          <div>
            <div className="relative">
              <select
                value={birthYear}
                onChange={(e) => setBirthYear(parseInt(e.target.value))}
                className={`input w-full bg-white/[0.07] hover:bg-white/[0.09] transition-colors ${birthDateError ? 'border-red-400' : ''}`}
                required
              >
                {AGE_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <p className="text-xs text-white/40 mt-2 flex items-center gap-2">
          <Calendar className="w-3 h-3" />
          We use age to customize songs for developmental stage.
        </p>
        {birthDateError && <p className="text-red-400 text-sm mt-1">{birthDateError}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-white/90 mb-2">
          Preferred Language for Songs
        </label>
        <select
          value={preferredLanguage}
          onChange={(e) => setPreferredLanguage(e.target.value as Language)}
          className={`input w-full bg-white/[0.07] hover:bg-white/[0.09] transition-colors`}
          disabled={true}
        >
          <option value="en">English</option>
        </select>
        <p className="text-xs text-white/40 mt-2 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
          Lyrics will be generated in this language.
        </p>
      </div>

      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}

      <button
        onClick={handleInfoSubmit}
        disabled={isUpdating}
        className="w-full bg-gradient-to-r from-primary to-secondary text-black font-medium
                 py-3 rounded-xl hover:opacity-90 transition-all duration-300
                 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40
                 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2
                 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isUpdating ? 'Saving...' : 'Save & Continue'}
        {!isUpdating && <ArrowRight className="w-5 h-5" />}
      </button>
    </div>
  );

  const renderPwaInstallStep = () => {
    if (isIOS) {
      onShouldShowIOSInstallInstructions?.();
      
      return (
        <>
          <div className="text-center space-y-6 sm:space-y-8 py-8 sm:py-10 px-2">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center border-2 border-primary/30 shadow-xl relative group">
              <Download className="w-10 h-10 sm:w-12 sm:h-12 text-primary group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 rounded-full border-2 border-primary/50 animate-ping opacity-50 group-hover:opacity-75 transition-opacity"></div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">iOS App Experience</h3>
            <p className="text-white/70 max-w-xs sm:max-w-sm mx-auto text-sm sm:text-base">
              For the best experience on iOS, add BabyMusic AI to your Home Screen. Instructions will appear separately.
              If you don't see them, you can always do this later from the browser menu.
            </p>
            <button
              onClick={handleFinishOnboarding}
              className="w-full max-w-xs mx-auto bg-gradient-to-r from-primary to-secondary text-black font-medium py-3 sm:py-3.5 text-base sm:text-lg rounded-xl hover:opacity-90 transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              Finish Setup <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </>
      );
    }
    
    if (isInstalled) {
      return (
        <div className="text-center space-y-6 sm:space-y-8 py-8 sm:py-10 px-2">
          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-green-500/10 rounded-full flex items-center justify-center border-2 border-green-500/20 shadow-lg">
            <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-500" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">App Already Installed!</h3>
          <p className="text-white/70 max-w-xs sm:max-w-sm mx-auto text-sm sm:text-base">
            Awesome! You've already got BabyMusic AI on your device for the best experience.
          </p>
          <button
            onClick={handleFinishOnboarding}
            className="w-full max-w-xs mx-auto bg-gradient-to-r from-primary to-secondary text-black font-medium py-3 sm:py-3.5 text-base sm:text-lg rounded-xl hover:opacity-90 transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            Finish Setup <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      );
    }
    
    if (showPwaInstallMessage) {
      return (
        <div className="text-center space-y-6 sm:space-y-8 py-8 sm:py-10 px-2">
          {pwaInstallOutcome === 'success' && (
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-green-500/10 rounded-full flex items-center justify-center border-2 border-green-500/20 shadow-lg">
              <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-500" />
            </div>
          )}
          {pwaInstallOutcome === 'failed' && (
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-yellow-500/10 rounded-full flex items-center justify-center border-2 border-yellow-500/20 shadow-lg">
              <XCircle className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-500" />
            </div>
          )}
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            {pwaInstallOutcome === 'success' ? 'Installation Started!' : 'No Problem!'}
          </h3>
          <p className="text-white/70 max-w-xs sm:max-w-sm mx-auto text-sm sm:text-base">
            {pwaInstallOutcome === 'success' 
              ? "Great! The app is being added to your home screen for easy access."
              : "You can always install the app later from the menu if you change your mind."
            }
          </p>
          <button
            onClick={handleFinishOnboarding}
            className="w-full max-w-xs mx-auto bg-gradient-to-r from-primary to-secondary text-black font-medium py-3 sm:py-3.5 text-base sm:text-lg rounded-xl hover:opacity-90 transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            Finish Setup <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      );
    }

    return (
      <div className="text-center space-y-6 sm:space-y-8 py-6 sm:py-10 px-2">
        <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center border-2 border-primary/30 shadow-xl relative group">
          <Download className="w-10 h-10 sm:w-12 sm:h-12 text-primary group-hover:scale-110 transition-transform duration-300" />
          <div className="absolute inset-0 rounded-full border-2 border-primary/50 animate-ping opacity-50 group-hover:opacity-75 transition-opacity"></div>
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">One Last Step for the Best Experience!</h3>
          <p className="text-white/70 max-w-xs sm:max-w-md mx-auto leading-relaxed text-sm sm:text-base">
            Install BabyMusic to your phone for one-tap instant access, a silky-smooth experience, and offline listening. Don't miss out! <strong className="text-white">It's free & takes just a moment!</strong>
          </p>
        </div>
        
        {canInstall ? (
          <InstallPWAButton 
            className="w-full max-w-xs mx-auto bg-gradient-to-r from-primary to-secondary text-black font-semibold py-3 sm:py-3.5 rounded-xl hover:opacity-90 transition-all duration-300 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 text-base sm:text-lg"
            buttonText="Unlock Full Experience"
            showIcon={true}
            IconComponent={Smartphone}
            onInstallSuccess={() => {
              setPwaInstallOutcome('success');
              setShowPwaInstallMessage(true);
              setTimeout(() => handleFinishOnboarding(), 2500); 
            }}
            onInstallFailure={() => {
              setPwaInstallOutcome('failed');
              setShowPwaInstallMessage(true);
              setTimeout(() => handleFinishOnboarding(), 2500); 
            }}
            onInstructionsShown={() => {
              setPwaInstallOutcome('skipped');
              setShowPwaInstallMessage(true);
              setTimeout(() => handleFinishOnboarding(), 3500);
            }}
          />
        ) : (
          <div className="bg-white/5 p-3 sm:p-4 rounded-lg max-w-xs mx-auto">
            <p className="text-white/60 text-xs sm:text-sm">
              App installation isn't available right now (perhaps private browsing or unsupported browser). Install via button on the menu.
            </p>
          </div>
        )}

        <button
          onClick={handleFinishOnboarding}
          className="w-full max-w-xs mx-auto text-white/60 hover:text-white font-medium py-3 rounded-xl transition-all duration-300 hover:bg-white/10 text-sm sm:text-base"
        >
          Maybe Later, Finish Setup
        </button>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-lg z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="card w-full max-w-xs sm:max-w-lg relative border-white/[0.05] fade-in overflow-hidden max-h-[95dvh] sm:max-h-[85vh] overflow-y-auto p-4 sm:p-8">
        {isUpdating && onboardingStep === 'infoCollection' && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
        <div className="relative">
          {onboardingStep === 'infoCollection' && renderInfoCollectionStep()}
          {onboardingStep === 'pwaInstallPrompt' && renderPwaInstallStep()}
        </div>
      </div>
    </div>
  );
}