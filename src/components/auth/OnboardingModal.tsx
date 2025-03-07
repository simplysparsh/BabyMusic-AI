import { useState, useEffect } from 'react';
import { Baby, Music2, Brain, ArrowRight, Calendar } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import type { AgeGroup, BabyProfile } from '../../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (babyProfile: BabyProfile) => void;
  initialBabyName: string;
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

const getAgeGroup = (month: number, year: number): AgeGroup => {
  const ageInMonths = ((CURRENT_YEAR - year) * 12) + (CURRENT_MONTH - month);
  if (ageInMonths <= 6) return '0-6';
  if (ageInMonths <= 12) return '7-12';
  return '13-24';
};

export default function OnboardingModal({ isOpen, onComplete, initialBabyName }: OnboardingModalProps) {
  const [step, setStep] = useState(1);
  const [isUpdating, setIsUpdating] = useState(false);
  const [babyName, setBabyName] = useState(initialBabyName);
  const [birthMonth, setBirthMonth] = useState<number>(CURRENT_MONTH);
  const [birthYear, setBirthYear] = useState<number>(CURRENT_YEAR);
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('0-6');
  const [gender, setGender] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const { updateProfile } = useAuthStore();

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setIsUpdating(false);
      setBabyName(initialBabyName);
      setGender('');
      setError(null);
    }
  }, [isOpen, initialBabyName]);

  useEffect(() => {
    setAgeGroup(getAgeGroup(birthMonth, birthYear));
  }, [birthMonth, birthYear]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (!gender) {
      setError("Please select your baby's gender");
      return;
    }
    setError(null);
    setStep(2);
  };

  const handleComplete = async () => {
    if (!gender) {
      setError("Please select your baby's gender");
      return;
    }
    
    try {
      setIsUpdating(true);
      setError(null);
      
      // Update profile with birth data
      await updateProfile({
        babyName,
        birthMonth,
        birthYear,
        ageGroup: getAgeGroup(birthMonth, birthYear),
        gender
      });
      
      // Call onComplete with profile data
      onComplete({
        babyName,
        birthMonth,
        birthYear,
        ageGroup: getAgeGroup(birthMonth, birthYear),
        gender
      });
    } catch (error) {
      console.error('Failed to update profile:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-lg z-50 flex items-center justify-center p-4">
      <div className="card w-full max-w-lg relative border-white/[0.05] fade-in overflow-hidden">
        {/* Add loading state for profile update */}
        {isUpdating && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
        
        <div className="relative p-8">
          {step === 1 ? (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Baby className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Welcome!</h2>
                  <p className="text-white/60">Let's personalize the experience</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  When was {babyName} born?
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <select
                      value={birthMonth}
                      onChange={(e) => setBirthMonth(parseInt(e.target.value))}
                      className="input w-full bg-white/[0.07] hover:bg-white/[0.09] transition-colors"
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
                      className="input w-full bg-white/[0.07] hover:bg-white/[0.09] transition-colors"
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
                  We use age to customize songs for your child's developmental stage
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  What is {babyName}'s gender?
                  <span className="text-primary ml-1" title="Required">*</span>
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className={`input w-full bg-white/[0.07] hover:bg-white/[0.09] transition-colors ${error ? 'border-red-400' : ''}`}
                  required
                >
                  <option value="">Select gender</option>
                  <option value="boy">Boy</option>
                  <option value="girl">Girl</option>
                  <option value="other">Other</option>
                </select>
                <p className="text-xs text-white/40 mt-2 flex items-center gap-2">
                  <Baby className="w-3 h-3" />
                  We use this to personalize songs with gender-appropriate lyrics
                </p>
                {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
              </div>

              <button
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-primary to-secondary text-black font-medium
                         py-3 rounded-xl hover:opacity-90 transition-all duration-300
                         shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40
                         hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                Continue
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Creating Your Songs</h2>
                  <p className="text-white/60">Customized for {babyName}'s development</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-3">
                    <Music2 className="w-5 h-5 text-primary" />
                    <div className="flex-1">
                      <p className="text-sm text-white/80">Your account is ready!</p>
                      <p className="text-sm text-white/60 mt-1">Explore preset songs in your dashboard.</p>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-white/80 leading-relaxed">
                  We've prepared special songs tailored to {babyName}'s age group ({ageGroup}).
                  These melodies are scientifically designed to support cognitive development and emotional well-being.
                </p>
              </div>

              <button
                onClick={handleComplete}
                className="w-full bg-gradient-to-r from-primary to-secondary text-black font-medium
                         py-3 rounded-xl hover:opacity-90 transition-all duration-300
                         shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40
                         hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                Continue to Dashboard
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}