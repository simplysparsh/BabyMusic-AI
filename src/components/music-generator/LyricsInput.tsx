import React from 'react';

interface LyricsInputProps {
  value: string;
  onChange: (value: string) => void;
  isCustom?: boolean;
}

export default function LyricsInput({ value, onChange, isCustom = false }: LyricsInputProps) {
  const [hasIdeas, setHasIdeas] = React.useState(false);

  return (
    <div>
      <label className="block text-lg font-medium text-white/90 mb-2">
        {isCustom ? 'Your Custom Song' : 'Your Musical Inspiration'}
        {!isCustom && <span className="text-white/60 text-sm ml-2">(Optional)</span>}
      </label>
      <div className="space-y-3">
        {!isCustom && (
          <div className="flex gap-3">
            <button
              onClick={() => {
                setHasIdeas(false);
                onChange('');
              }}
              className={`px-4 py-2 rounded-xl text-sm transition-all duration-300
                       ${!hasIdeas
                         ? 'bg-gradient-to-r from-primary to-secondary text-black'
                         : 'bg-white/[0.07] text-white hover:bg-white/[0.1]'}`}
            >
              Build for me
            </button>
            <button
              onClick={() => setHasIdeas(true)}
              className={`px-4 py-2 rounded-xl text-sm transition-all duration-300
                       ${hasIdeas
                         ? 'bg-gradient-to-r from-primary to-secondary text-black'
                         : 'bg-white/[0.07] text-white hover:bg-white/[0.1]'}`}
            >
              I have ideas
            </button>
          </div>
        )}
        {(hasIdeas || isCustom) && (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`Examples:
• A song about colors and shapes
• An upbeat song to for diaper change
• Melody for tummy time
• [Name] explores a magical garden`}
            className="w-full h-40 bg-[#2A2D3E] border border-white/10 rounded-xl px-6 py-4
                     text-white placeholder:text-white/40 placeholder:text-sm focus:outline-none focus:ring-2
                     focus:ring-primary/50 transition-all duration-300 resize-none"
          />
        )}
      </div>
    </div>
  );
}