import { ChangeEvent, useState } from 'react';


interface LyricsInputProps {
  value: string;
  onChange: (value: string) => void;
  isFromScratch?: boolean;
  onSongTypeChange: (songType: 'theme' | 'theme-with-input' | 'from-scratch') => void;
}

const MAX_INPUT_LENGTH = 180;

export default function LyricsInput({ value, onChange, isFromScratch = false, onSongTypeChange }: LyricsInputProps) {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [isOverLimit, setIsOverLimit] = useState(false);

  const handleCustomInputChange = (wantsCustomInput: boolean) => {
    setShowCustomInput(wantsCustomInput);
    onSongTypeChange(wantsCustomInput ? 'theme-with-input' : 'theme');
  };

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setIsOverLimit(newValue.length > MAX_INPUT_LENGTH);
    onChange(newValue.slice(0, MAX_INPUT_LENGTH));
  };

  return (
    <div>
      <label className="block text-xl font-semibold text-white/90 mb-3 text-center">
        {isFromScratch ? 'Enter Your Song Ideas' : 'Customize Your Song'}
        <span className="text-white/60 text-sm ml-2">
          {(isFromScratch || showCustomInput) && `(${MAX_INPUT_LENGTH} chars max)`}
        </span>
      </label>
      <div className="space-y-3">
        {!isFromScratch && (
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                handleCustomInputChange(false);
                onChange('');
              }}
              className={`px-4 py-2 rounded-xl text-sm transition-all duration-300
                       ${!showCustomInput
                         ? 'bg-gradient-to-r from-primary to-secondary text-black'
                         : 'bg-white/[0.07] text-white hover:bg-white/[0.1]'}`}
            >
              Build for me
            </button>
            <button
              onClick={() => handleCustomInputChange(true)}
              className={`px-4 py-2 rounded-xl text-sm transition-all duration-300
                       ${showCustomInput
                         ? 'bg-gradient-to-r from-primary to-secondary text-black'
                         : 'bg-white/[0.07] text-white hover:bg-white/[0.1]'}`}
            >
              I have ideas
            </button>
          </div>
        )}
        {(showCustomInput || isFromScratch) && (
          <div className="space-y-2">
            <textarea
              value={value}
              onChange={handleInputChange}
              placeholder={`Examples:
${isFromScratch ?
`• Create a song about exploring colors and shapes in nature
• Make a melody about a magical garden adventure
• Tell a story about making new friends at the park` :
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