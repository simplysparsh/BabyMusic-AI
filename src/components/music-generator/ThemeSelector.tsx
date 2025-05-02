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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {availableThemes.map(({ type, title, description, icon: Icon }) => (
          <button
            key={type}
            onClick={() => onThemeSelect(type)}
            className={`p-6 rounded-2xl text-left transition-all duration-500 flex items-start gap-4 relative overflow-hidden
                      group hover:scale-[1.02] backdrop-blur-sm
                     ${selectedTheme === type
                       ? 'bg-black/90 text-white shadow-xl shadow-primary/10'
                       : 'bg-black/80 text-white/90 hover:bg-black/70'}`}
            style={{
              background: selectedTheme === type 
                ? 'linear-gradient(to bottom right, rgba(0,0,0,0.95), rgba(0,0,0,0.9))' 
                : 'linear-gradient(to bottom right, rgba(0,0,0,0.9), rgba(0,0,0,0.85))'
            }}
          >
            {/* Dynamic background gradients - Stronger opacity for mobile */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-transparent opacity-50 
                         group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-gradient-to-tl from-secondary/30 via-transparent to-transparent opacity-50 
                         group-hover:opacity-100 transition-opacity duration-500" style={{ animationDelay: '150ms' }}></div>
            
            {/* Selected state overlay - Enhanced for mobile */}
            <div className={`absolute inset-0 bg-gradient-to-br transition-opacity duration-500
                          ${selectedTheme === type 
                            ? 'from-primary/40 via-secondary/30 to-transparent opacity-100'
                            : 'opacity-0'}`} />
            
            {/* Icon container - Enhanced background for mobile */}
            <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center
                          transition-all duration-700 group-hover:scale-110 group-hover:rotate-[360deg]
                          ${selectedTheme === type 
                            ? 'bg-primary/40' 
                            : 'bg-white/[0.15] group-hover:bg-white/[0.2]'}`}>
              <Icon className={`w-6 h-6 transition-colors duration-300
                            ${selectedTheme === type 
                              ? 'text-primary' 
                              : 'text-white/90 group-hover:text-white'}`} />
            </div>
            
            <div className="relative z-10">
              <div className="font-medium text-lg mb-1 group-hover:text-white transition-colors">{title}</div>
              <div className="text-sm text-white/80 group-hover:text-white/90 transition-colors">{description}</div>
            </div>
            
            {/* Enhanced decorative corner gradient - darker for mobile */}
            <div className="absolute bottom-0 right-0 w-36 h-36 
                         bg-gradient-radial from-white/15 to-transparent 
                         rounded-full -mr-12 -mb-12 
                         group-hover:scale-150 transition-transform duration-700"></div>
          </button>
        ))}
      </div>
      
      {/* Subtle hint for premium themes - Restyled */} 
      {userLoaded && !isPremium && (
        // Use a slightly different but related gradient/border style
        <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 text-center border border-primary/20 shadow-inner">
          <a href="/premium" className="group inline-flex items-center justify-center gap-2">
             {/* Changed icon to Sparkles */}
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