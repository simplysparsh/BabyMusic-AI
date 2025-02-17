import React from 'react';
import type { VoiceType } from '../../types';
import { Mic, Music as MusicOff } from 'lucide-react';

const VOICE_OPTIONS: { type: VoiceType; label: string }[] = [
  { type: 'softFemale', label: 'Soft Female Voice' },
  { type: 'calmMale', label: 'Calm Male Voice' }
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
    <div className="space-y-6">
      <div>
        <label className="block text-lg font-medium text-white/90 mb-4">
          Music Type
        </label>
        <div className="flex gap-3">
          <button
            onClick={() => onInstrumentalToggle(false)}
            className={`flex-1 px-4 py-3 rounded-xl text-center transition-all duration-300
                     flex items-center justify-center gap-2
                     ${!isInstrumental
                       ? 'bg-gradient-to-r from-accent to-secondary text-black'
                       : 'bg-white/[0.07] text-white hover:bg-white/[0.1]'}`}
          >
            <Mic className="w-4 h-4" />
            With Voice
          </button>
          <button
            onClick={() => onInstrumentalToggle(true)}
            className={`flex-1 px-4 py-3 rounded-xl text-center transition-all duration-300
                     flex items-center justify-center gap-2
                     ${isInstrumental
                       ? 'bg-gradient-to-r from-accent to-secondary text-black'
                       : 'bg-white/[0.07] text-white hover:bg-white/[0.1]'}`}
          >
            <MusicOff className="w-4 h-4" />
            Instrumental
          </button>
        </div>
      </div>

      {!isInstrumental && (
        <div>
          <label className="block text-lg font-medium text-white/90 mb-4">
            Voice Type
          </label>
          <div className="flex gap-3">
            {VOICE_OPTIONS.map(({ type, label }) => (
              <button
                key={type}
                onClick={() => onVoiceSelect(type)}
                className={`flex-1 px-4 py-3 rounded-xl text-center transition-all duration-300
                         ${selectedVoice === type
                           ? 'bg-gradient-to-r from-accent to-secondary text-black'
                           : 'bg-white/[0.07] text-white hover:bg-white/[0.1]'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}