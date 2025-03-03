import React, { useState } from 'react';
import { useSongStore } from '../store/songStore';

interface ResetGeneratingButtonProps {
  className?: string;
}

export const ResetGeneratingButton: React.FC<ResetGeneratingButtonProps> = ({ className }) => {
  const [isResetting, setIsResetting] = useState(false);
  const { generatingSongs, resetGeneratingState } = useSongStore();
  
  // Only show the button if there are songs in generating state
  if (generatingSongs.size === 0) {
    return null;
  }
  
  const handleReset = async () => {
    if (window.confirm('This will clear all songs that are stuck in the generating state. Continue?')) {
      setIsResetting(true);
      try {
        await resetGeneratingState();
      } catch (error) {
        console.error('Failed to reset generating state:', error);
      } finally {
        setIsResetting(false);
      }
    }
  };
  
  return (
    <button
      onClick={handleReset}
      disabled={isResetting}
      className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 ${className || ''}`}
    >
      {isResetting ? 'Resetting...' : `Clear ${generatingSongs.size} Stuck Song${generatingSongs.size > 1 ? 's' : ''}`}
    </button>
  );
};

export default ResetGeneratingButton; 