import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useErrorStore } from '../../store/errorStore';
import { useEffect } from 'react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { profile, updateProfile } = useAuthStore();
  const { error: globalError, clearError } = useErrorStore();
  const [formState, setFormState] = useState({
    babyName: ''
  });
  const [error, setError] = useState('');
  const [babyNameError, setBabyNameError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Initialize form values when modal opens
  useEffect(() => {
    if (isOpen && profile) {
      setFormState({
        babyName: profile.babyName ?? ''
      });
      setError('');
      setIsUpdating(false);
      setBabyNameError('');
      clearError();
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBabyNameError('');
    const trimmedName = formState.babyName.trim();
    
    if (isUpdating) return;

    if (!trimmedName) {
      setBabyNameError('Please enter your baby\'s name');
      return;
    }

    setIsUpdating(true);
    
    try {
      // Update profile (preset songs will be generated in background)
      await updateProfile({ 
        babyName: trimmedName
      });
      
      // Only close on success
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update profile');
      setIsUpdating(false);
    }
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

        <h2 className="text-3xl font-bold text-white mb-8">Profile Settings</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Baby's Name
              <span className="text-primary ml-1" title="Required">*</span>
            </label>
            <input
              type="text"
              value={formState.babyName}
              onChange={(e) => setFormState(prev => ({ ...prev, babyName: e.target.value }))}
              className={`input w-full ${babyNameError ? 'border-red-400' : ''}`}
              placeholder="Enter your baby's name"
              required
            />
            {babyNameError && (
              <p className="text-red-400 text-sm mt-1">{babyNameError}</p>
            )}
            {(error || globalError) && !babyNameError && (
              <p className="text-red-400 text-sm mt-1">{error || globalError}</p>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isUpdating}
              className="px-6 py-2 rounded-xl bg-white/10 text-white/80
                       hover:bg-white/20 transition-all duration-300
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-primary to-secondary
                       text-white hover:opacity-90 transition-all duration-300 disabled:opacity-50"
            >
              {isUpdating ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}