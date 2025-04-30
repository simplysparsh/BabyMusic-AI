import type { MusicMood, Tempo } from '../../types';

const TEMPO_OPTIONS: { type: Tempo; label: string }[] = [
  { type: 'slow', label: 'Slow' },
  { type: 'medium', label: 'Medium' },
  { type: 'fast', label: 'Fast' }
];

const MOOD_OPTIONS: { type: MusicMood; label: string }[] = [
  { type: 'calm', label: 'Calm' },
  { type: 'playful', label: 'Playful' },
  { type: 'learning', label: 'Learning' },
  { type: 'energetic', label: 'Energetic' }
];

interface CustomOptionsProps {
  mood?: MusicMood;
  tempo?: Tempo;
  onMoodSelect: (mood: MusicMood) => void;
  onTempoSelect: (tempo: Tempo) => void;
}

export default function CustomOptions({ 
  mood, 
  tempo, 
  onMoodSelect, 
  onTempoSelect 
}: CustomOptionsProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-lg font-medium text-white/90 mb-4">
          Tempo
        </label>
        <div className="flex gap-3">
          {TEMPO_OPTIONS.map(({ type, label }) => (
            <button
              key={type}
              onClick={() => onTempoSelect(type)}
              className={`flex-1 rounded-xl text-center py-3 px-4 transition-all duration-500 group relative overflow-hidden backdrop-blur-sm
                       ${tempo === type
                         ? 'bg-black/90 text-white shadow-md shadow-primary/10'
                         : 'bg-black/80 text-white/90 hover:bg-black/70'}`}
              style={{
                background: tempo === type 
                  ? 'linear-gradient(to bottom right, rgba(0,0,0,0.95), rgba(0,0,0,0.9))' 
                  : 'linear-gradient(to bottom right, rgba(0,0,0,0.9), rgba(0,0,0,0.85))'
              }}
            >
              {/* Dynamic background gradients */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-transparent opacity-50 
                           group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Selected state overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br transition-opacity duration-500
                            ${tempo === type 
                              ? 'from-primary/40 via-secondary/30 to-transparent opacity-100'
                              : 'opacity-0'}`} />
              
              {/* Text content */}
              <div className="relative z-10 font-medium">{label}</div>
              
              {/* Decorative corner gradient */}
              <div className="absolute bottom-0 right-0 w-16 h-16 
                           bg-gradient-radial from-white/15 to-transparent 
                           rounded-full -mr-6 -mb-6 
                           group-hover:scale-150 transition-transform duration-700"></div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-lg font-medium text-white/90 mb-4">
          Mood
        </label>
        <div className="grid grid-cols-2 gap-3">
          {MOOD_OPTIONS.map(({ type, label }) => (
            <button
              key={type}
              onClick={() => onMoodSelect(type)}
              className={`rounded-xl text-center py-3 px-4 transition-all duration-500 group relative overflow-hidden backdrop-blur-sm
                       ${mood === type
                         ? 'bg-black/90 text-white shadow-md shadow-primary/10'
                         : 'bg-black/80 text-white/90 hover:bg-black/70'}`}
              style={{
                background: mood === type 
                  ? 'linear-gradient(to bottom right, rgba(0,0,0,0.95), rgba(0,0,0,0.9))' 
                  : 'linear-gradient(to bottom right, rgba(0,0,0,0.9), rgba(0,0,0,0.85))'
              }}
            >
              {/* Dynamic background gradients */}
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 via-transparent to-transparent opacity-50 
                           group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Selected state overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br transition-opacity duration-500
                            ${mood === type 
                              ? 'from-secondary/40 via-accent/30 to-transparent opacity-100'
                              : 'opacity-0'}`} />
              
              {/* Text content */}
              <div className="relative z-10 font-medium">{label}</div>
              
              {/* Decorative corner gradient */}
              <div className="absolute bottom-0 right-0 w-16 h-16 
                           bg-gradient-radial from-white/15 to-transparent 
                           rounded-full -mr-6 -mb-6 
                           group-hover:scale-150 transition-transform duration-700"></div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}