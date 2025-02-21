import React from 'react';

interface LyricsInputProps {
  value: string;
  onChange: (value: string) => void;
  isFromScratch?: boolean;
  onHasIdeasChange?: (hasIdeas: boolean) => void;
}

const MAX_INPUT_LENGTH = 300;

export default function LyricsInput({ value, onChange, isFromScratch = false, onHasIdeasChange }: LyricsInputProps) {
  const [hasIdeas, setHasIdeas] = React.useState(false);
  const [isOverLimit, setIsOverLimit] = React.useState(false);

  const handleHasIdeasChange = (newHasIdeas: boolean) => {
    setHasIdeas(newHasIdeas);
    onHasIdeasChange?.(newHasIdeas);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setIsOverLimit(newValue.length > MAX_INPUT_LENGTH);
    onChange(newValue.slice(0, MAX_INPUT_LENGTH));
  };

  return (
    <div>
      <label className="block text-lg font-medium text-white/90 mb-2">
        {isFromScratch ? 'Your Song Ideas' : 'Additional Context'}
        <span className="text-white/60 text-sm ml-2">
          {!isFromScratch && !hasIdeas && '(Optional) '}
          ({MAX_INPUT_LENGTH} characters max)
        </span>
      </label>
      <div className="space-y-3">
        {!isFromScratch && (
          <div className="flex gap-3">
            <button
              onClick={() => {
                handleHasIdeasChange(false);
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
              onClick={() => handleHasIdeasChange(true)}
              className={`px-4 py-2 rounded-xl text-sm transition-all duration-300
                       ${hasIdeas
                         ? 'bg-gradient-to-r from-primary to-secondary text-black'
                         : 'bg-white/[0.07] text-white hover:bg-white/[0.1]'}`}
            >
              I have ideas
            </button>
          </div>
        )}
        {(hasIdeas || isFromScratch) && (
          <div className="space-y-2">
            <textarea
              value={value}
              onChange={handleInputChange}
              placeholder={`Examples:
${isFromScratch ?
`• Create a song about exploring colors and shapes in nature
• Make a melody about a magical garden adventure
• Tell a story about making new friends at the park
• Include themes of curiosity and discovery` :
`• Include favorite animals or activities
• Add specific places or objects
• Mention special family moments
• Include daily routines or rituals`}`}
              className="w-full h-40 bg-[#2A2D3E] border border-white/10 rounded-xl px-6 py-4
                     text-white placeholder:text-white/40 placeholder:text-sm focus:outline-none focus:ring-2
                     focus:ring-primary/50 transition-all duration-300 resize-none
                     ${isOverLimit ? 'border-red-400 focus:ring-red-400/50' : ''}"
            />
            <div className="flex justify-between text-sm">
              <span className={`${isOverLimit ? 'text-red-400' : 'text-white/60'}`}>
                {value.length}/{MAX_INPUT_LENGTH} characters
              </span>
              {isOverLimit && (
                <span className="text-red-400">
                  Character limit exceeded
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}