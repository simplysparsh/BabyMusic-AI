import { useMemo } from 'react';
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
  // Calculate time display
  const displayTime = useMemo(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, [timeLeft]);

  // Get progress message
  const progressMessage = useMemo(() => {
    if (progress < 25) return "✨ Gathering stardust melodies...";
    if (progress < 50) return "🎨 Painting with sound colors...";
    if (progress < 75) return "🌙 Adding moonlight harmonies...";
    return "🎁 Wrapping your musical gift...";
  }, [progress]);

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
            <span className="note-icon">🎵</span>
          </div>
          <p className="status-text">Weaving your melody</p>
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