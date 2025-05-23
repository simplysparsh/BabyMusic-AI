import { useMemo, useState, useEffect } from 'react';
import './SoundThreadAnimation.css';

interface SoundThreadAnimationMobileProps {
  isGenerating: boolean;
  progress: number;
  timeLeft: number;
}

export default function SoundThreadAnimationMobile({
  isGenerating,
  progress,
  timeLeft
}: SoundThreadAnimationMobileProps) {
  const [animationCycles, setAnimationCycles] = useState(0);

  // Calculate time display
  const displayTime = useMemo(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')} min left`;
  }, [timeLeft]);

  // Progress messages that cycle through all options
  const progressMessages = [
    "✨ Gathering stardust melodies...",
    "🎨 Painting with sound colors...", 
    "🌙 Adding moonlight harmonies...",
    "🎁 Wrapping your musical gift...",
    "🌟 Weaving magical notes...",
    "🦋 Dancing with melodies..."
  ];

  // Get progress message based on animation cycles (changes every 3 cycles)
  const progressMessage = useMemo(() => {
    const messageIndex = Math.floor(animationCycles / 3) % progressMessages.length;
    return progressMessages[messageIndex];
  }, [animationCycles, progressMessages]);

  // Reset animation cycles when generation starts
  useEffect(() => {
    if (isGenerating) {
      setAnimationCycles(0);
    }
  }, [isGenerating]);

  // Handle animation iteration events
  const handleAnimationIteration = () => {
    setAnimationCycles(prev => prev + 1);
  };

  if (!isGenerating) return null;

  return (
    <div className="sound-thread-container mx-auto my-8 px-4 fade-in">
      <div className="sound-thread-box">
        {/* Animated sound threads */}
        <div className="sound-threads">
          <div className="thread thread-1" />
          <div className="thread thread-2" />
          <div className="thread thread-3" />
          <div className="thread thread-4" />
          <div className="thread thread-5" />
        </div>

        {/* Floating particles */}
        <div className="particles">
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`particle particle-${i + 1}`} />
          ))}
        </div>

        {/* Center content */}
        <div className="thread-center-content">
          <div className="musical-note">
            <span 
              className="note-icon"
              onAnimationIteration={handleAnimationIteration}
            >🎵</span>
          </div>
          <div className="time-display">
            <div className="time-indicator" />
            <span className="time-text">{displayTime}</span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="thread-progress-bar">
        <div 
          className="thread-progress-fill" 
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Progress message */}
      <div className="thread-message">
        <p>{progressMessage}</p>
      </div>
    </div>
  );
} 