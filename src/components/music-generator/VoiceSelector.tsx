import React from 'react';
import type { VoiceType } from '../../types';
import { Mic, Music as MusicOff, Volume2, VolumeX } from 'lucide-react';

const VOICE_OPTIONS: { 
  type: VoiceType; 
  label: string;
  description: string;
  icon: typeof Volume2;
}[] = [
  { 
    type: 'softFemale', 
    label: 'Soft Female Voice',
    description: 'Gentle, nurturing voice perfect for lullabies and calm songs',
    icon: Volume2
  },
  { 
    type: 'calmMale', 
    label: 'Calm Male Voice',
    description: 'Warm, soothing voice ideal for storytelling and learning songs',
    icon: Volume2
  }
];

interface VoiceSelectorProps {
  isInstrumental: boolean;
  selectedVoice: VoiceType;
  onVoiceSelect: (voice: VoiceType) => void;
  onInstrumentalToggle: (instrumental: boolean) => void;
}

export default function VoiceSelector({ 
  isInstrumental, 
  selectedVoice, 
  onVoiceSelect,
  onInstrumentalToggle 
}: VoiceSelectorProps) {
  return (
    <div className="space-y-8 sm:space-y-6 rounded-xl bg-white/[0.03] p-4 sm:p-6">
      <div>
        <label className="block text-xl sm:text-lg font-medium text-white/90 mb-2">
          Music Type
        </label>
        <p className="text-sm text-white/60 mb-6 sm:mb-4">
          Choose between instrumental music or songs with vocals
        </p>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-3">
          <button
            onClick={() => onInstrumentalToggle(false)}
            className={`min-h-[5rem] sm:min-h-0 px-4 py-5 sm:py-4 rounded-xl text-center transition-all duration-300
                     flex flex-col items-center justify-center gap-4 sm:gap-3 group flex-1
                     active:scale-[0.98] touch-manipulation
                     ${!isInstrumental
                       ? 'bg-gradient-to-r from-accent to-secondary text-black shadow-lg shadow-accent/25'
                       : 'bg-white/[0.07] text-white hover:bg-white/[0.1]'}`}
            aria-pressed={!isInstrumental}
          >
            <div className={`p-4 sm:p-3 rounded-full transition-all duration-300
                         ${!isInstrumental 
                           ? 'bg-black/10' 
                           : 'bg-white/5 group-hover:bg-white/10'}`}>
              <Mic className="w-7 h-7 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="font-medium text-lg sm:text-base">With Voice</div>
              <div className="text-sm sm:text-xs opacity-80 mt-1">
                Songs with lyrics and vocals
              </div>
            </div>
          </button>
          <button
            onClick={() => onInstrumentalToggle(true)}
            className={`min-h-[5rem] sm:min-h-0 px-4 py-5 sm:py-4 rounded-xl text-center transition-all duration-300
                     flex flex-col items-center justify-center gap-4 sm:gap-3 group flex-1
                     active:scale-[0.98] touch-manipulation
                     ${isInstrumental
                       ? 'bg-gradient-to-r from-accent to-secondary text-black shadow-lg shadow-accent/25'
                       : 'bg-white/[0.07] text-white hover:bg-white/[0.1]'}`}
            aria-pressed={isInstrumental}
          >
            <div className={`p-4 sm:p-3 rounded-full transition-all duration-300
                         ${isInstrumental 
                           ? 'bg-black/10' 
                           : 'bg-white/5 group-hover:bg-white/10'}`}>
              <MusicOff className="w-7 h-7 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="font-medium text-lg sm:text-base">Instrumental</div>
              <div className="text-sm sm:text-xs opacity-80 mt-1">
                Music without vocals
              </div>
            </div>
          </button>
        </div>
      </div>

      {!isInstrumental && (
        <div className="animate-fadeIn">
          <label className="block text-xl sm:text-lg font-medium text-white/90 mb-2">
            Voice Type
          </label>
          <p className="text-sm text-white/60 mb-6 sm:mb-4">
            Select the voice that best suits your song
          </p>
          <div className="grid grid-cols-1 gap-4 sm:gap-3 sm:grid-cols-2">
            {VOICE_OPTIONS.map(({ type, label, description, icon: Icon }) => (
              <button
                key={type}
                onClick={() => onVoiceSelect(type)}
                className={`min-h-[4.5rem] p-5 sm:p-4 rounded-xl text-left transition-all duration-300 group
                         active:scale-[0.98] touch-manipulation
                         ${selectedVoice === type
                           ? 'bg-gradient-to-r from-accent to-secondary text-black shadow-lg shadow-accent/25'
                           : 'bg-white/[0.07] text-white hover:bg-white/[0.1]'}`}
                aria-pressed={selectedVoice === type}
              >
                <div className="flex items-start gap-4 sm:gap-3">
                  <div className={`p-3 sm:p-2 rounded-full transition-all duration-300 flex-shrink-0
                               ${selectedVoice === type 
                                 ? 'bg-black/10' 
                                 : 'bg-white/5 group-hover:bg-white/10'}`}>
                    <Icon className="w-6 h-6 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <div className="font-medium text-lg sm:text-base">{label}</div>
                    <div className="text-sm sm:text-xs mt-1.5 sm:mt-1 opacity-80 line-clamp-2">
                      {description}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}