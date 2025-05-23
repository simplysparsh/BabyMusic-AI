import { useState, useEffect } from 'react';
import { Baby, ArrowRight, Calendar, Download, CheckCircle, XCircle, Smartphone } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import type { AgeGroup, BabyProfile, Language } from '../../types';
import { DEFAULT_LANGUAGE } from '../../types';
import InstallPWAButton from '../common/InstallPWAButton';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { SongService } from '../../services/songService';

interface OAuthOnboardingModalProps {
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

export default function OAuthOnboardingModal({ isOpen, onComplete, userProfile, onShouldShowIOSInstallInstructions }: OAuthOnboardingModalProps) {
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

  useEffect(() => {
    if (isOpen && userProfile) {
      console.log('OAuthOnboardingModal opened for user profile:', userProfile);
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

    // Validate baby name
    if (!babyName.trim()) {
      setBabyNameError('Please enter your baby\'s name');
      hasError = true;
    }

    // Validate gender
    if (!gender) {
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

      console.log('Completing OAuth onboarding with data:', profileUpdates);
      setIsUpdating(true);
      
      if (user && user.id) {
        await updateProfile(profileUpdates);
        setOnboardingStep('pwaInstallPrompt');
        // Fire-and-forget: generate preset songs in the background
        SongService.regeneratePresetSongs(user.id, profileUpdates.babyName, profileUpdates.gender, true);
      } else {
        console.error('User ID not available in OAuthOnboardingModal for updateProfile');
        setError('User session error. Please try again.');
      }
      
    } catch (error) {
      console.error('Failed to update profile during OAuth onboarding:', error);
      setError(error instanceof Error ? error.message : 'Failed to save information. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

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
          <p className="text-white/60">Help us personalize the experience for your baby</p>
        </div>
      </div>

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
          <option value="" disabled>Select gender</option>
          <option value="boy">Boy</option>
          <option value="girl">Girl</option>
        </select>
        {genderError && <p className="text-red-400 text-sm mt-1">{genderError}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-white/90 mb-2">
          When was {babyName || 'your baby'} born?
          <span className="text-primary ml-1" title="Required">*</span>
        </label>
        <div className="flex gap-2">
          <select
            value={birthMonth}
            onChange={(e) => {
              setBirthMonth(parseInt(e.target.value));
              if (birthDateError) setBirthDateError(null);
            }}
            className="input w-full bg-white/[0.07] hover:bg-white/[0.09] transition-colors"
          >
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">June</option>
            <option value="7">July</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
          <select
            value={birthYear}
            onChange={(e) => {
              setBirthYear(parseInt(e.target.value));
              if (birthDateError) setBirthDateError(null);
            }}
            className="input w-full bg-white/[0.07] hover:bg-white/[0.09] transition-colors"
          >
            {AGE_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        {birthDateError && <p className="text-red-400 text-sm mt-1">{birthDateError}</p>}
        <div className="flex items-center gap-2 mt-1.5 text-white/60 text-xs">
          <Calendar className="w-3.5 h-3.5" />
          <span>We use age to customize songs for developmental stage.</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white/90 mb-2">
          Preferred Language for Songs
        </label>
        <select
          value={preferredLanguage}
          onChange={(e) => setPreferredLanguage(e.target.value as Language)}
          className="input w-full bg-white/[0.07] hover:bg-white/[0.09] transition-colors"
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
        </select>
        <div className="flex items-center gap-2 mt-1.5 text-white/60 text-xs">
          <span className="inline-block w-3.5 h-3.5 text-center font-bold">🌍</span>
          <span>Lyrics will be generated in this language.</span>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-500/20 border border-red-500/10 rounded-lg text-sm text-red-200">
          {error}
        </div>
      )}

      <button
        onClick={handleInfoSubmit}
        disabled={isUpdating}
        className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity shadow-md py-3 rounded-xl text-black font-semibold flex items-center justify-center gap-1 disabled:opacity-70"
      >
        {isUpdating ? (
          <>
            <span className="animate-spin rounded-full h-5 w-5 border-2 border-b-transparent border-black inline-block mr-1"></span>
            Processing...
          </>
        ) : (
          <>
            Save & Continue <ArrowRight className="w-5 h-5" />
          </>
        )}
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
            <p className="text-gray-300 text-sm text-center">
              For the best experience on iOS, add TuneLoom to your Home Screen. Instructions will appear separately.
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
          <p className="text-green-300 text-sm text-center font-medium">
            Awesome! You've already got TuneLoom on your device for the best experience.
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
          <p className="text-white/80 text-sm leading-relaxed">
            Install TuneLoom to your phone for one-tap instant access, a silky-smooth experience, and offline listening. Don't miss out! <strong className="text-white">It's free & takes just a moment!</strong>
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
            Install TuneLoom to your phone for one-tap instant access, a silky-smooth experience, and offline listening. Don't miss out! <strong className="text-white">It's free & takes just a moment!</strong>
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