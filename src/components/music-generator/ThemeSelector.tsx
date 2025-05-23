import type { ThemeType } from '../../types';
import { THEMES } from './themeData';
import { useAuthStore } from '../../store/authStore';
import { Sparkles } from 'lucide-react';
// import { Link } from 'react-router-dom'; // Keep Link removed/commented

// Define premium themes
const PREMIUM_THEMES: ThemeType[] = ['indianClassical', 'westernClassical'];

interface ThemeSelectorProps {
  selectedTheme?: ThemeType;
  onThemeSelect: (theme: ThemeType) => void;
}

export default function ThemeSelector({ selectedTheme, onThemeSelect }: ThemeSelectorProps) {
  // Get user premium status from store
  const isPremium = useAuthStore((state) => state.profile?.isPremium);
  const userLoaded = useAuthStore((state) => state.initialized);

  // Filter themes based on subscription
  const availableThemes = userLoaded ? THEMES.filter(theme => 
    isPremium || !PREMIUM_THEMES.includes(theme.type)
  ) : [];

  return (
    <div>
      {/* Mobile-optimized 2-column grid: 2x2 for free (4 themes), 2x3 for premium (6 themes) */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {availableThemes.map(({ type, title, description, icon: Icon }) => (
          <button
            key={type}
            onClick={() => onThemeSelect(type)}
            className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl text-left transition-all duration-300 flex flex-col relative overflow-hidden
                      group hover:scale-[1.02] backdrop-blur-sm touch-manipulation min-h-[120px] sm:min-h-[140px]
                     ${selectedTheme === type
                       ? 'bg-black/90 text-white shadow-xl shadow-primary/10'
                       : 'bg-black/80 text-white/90 hover:bg-black/70'}`}
            style={{
              background: selectedTheme === type 
                ? 'linear-gradient(to bottom right, rgba(0,0,0,0.95), rgba(0,0,0,0.9))' 
                : 'linear-gradient(to bottom right, rgba(0,0,0,0.9), rgba(0,0,0,0.85))'
            }}
          >
            {/* Single subtle background gradient - Simplified for better readability */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-secondary/10 opacity-30 
                         group-hover:opacity-50 transition-opacity duration-300"></div>
            
            {/* Selected state overlay - Reduced opacity */}
            <div className={`absolute inset-0 bg-gradient-to-br transition-opacity duration-300
                          ${selectedTheme === type 
                            ? 'from-primary/20 via-secondary/10 to-transparent opacity-100'
                            : 'opacity-0'}`} />
            
            {/* Header row: Icon + Title */}
            <div className="relative z-10 flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
              {/* Icon container */}
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0
                            transition-all duration-300 group-hover:scale-110
                            ${selectedTheme === type 
                              ? 'bg-primary/40' 
                              : 'bg-white/[0.15] group-hover:bg-white/[0.25]'}`}>
                <Icon className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-300
                              ${selectedTheme === type 
                                ? 'text-primary' 
                                : 'text-white/90 group-hover:text-white'}`} />
              </div>
              
              {/* Title next to icon */}
              <div className="font-medium text-sm sm:text-lg group-hover:text-white transition-colors leading-tight flex-grow">
                {title}
              </div>
            </div>
            
            {/* Description with full space */}
            <div className="relative z-10 flex-grow">
              <div className="text-xs sm:text-sm text-white/80 group-hover:text-white/95 transition-colors leading-relaxed">
                {description}
              </div>
            </div>
            
            {/* Subtle decorative element - Keep minimal */}
            <div className="absolute bottom-0 right-0 w-16 h-16 sm:w-24 sm:h-24
                         bg-gradient-radial from-white/8 to-transparent 
                         rounded-full -mr-6 -mb-6 sm:-mr-8 sm:-mb-8
                         group-hover:scale-125 transition-transform duration-500"></div>
          </button>
        ))}
      </div>
      
      {/* Premium themes hint */} 
      {userLoaded && !isPremium && (
        <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 text-center border border-primary/20 shadow-inner">
          <a href="/premium" className="group inline-flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-primary/80 group-hover:text-primary transition-colors duration-300" />
            <span className="text-sm text-white/70 group-hover:text-white transition-colors">
              Unlock <strong>Indian Ragas</strong> & <strong>Western Classical</strong> themes with <strong className="font-semibold text-primary underline group-hover:text-secondary transition-colors">Premium!</strong>
            </span>
          </a>
        </div>
      )}
    </div>
  );
}