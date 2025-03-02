
import { ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface HeroProps {
  onOpenAuth: (mode: 'signin' | 'signup') => void;
}

export default function Hero({ onOpenAuth }: HeroProps) {
  const { user } = useAuthStore();
  
  return (
    <section className="relative pt-28 pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-4 sm:mb-6 tracking-tight">
            Musical Adventures for Your
            <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Little One
            </span>
          </h1>
          <p className="text-base sm:text-xl text-white/80 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-2">
            Create personalized melodies that inspire learning, creativity, and development
            through the magic of AI-powered music.
          </p>
          <div className="flex justify-center">
            <a 
              href={user ? "/dashboard" : "#"}
              onClick={() => !user && onOpenAuth('signup')}
              className="btn-primary text-sm sm:text-base px-5 py-2.5 sm:px-6 sm:py-3"
            >
              {user ? 'Go to Dashboard' : 'Get Started Free'}
              <ArrowRight className="w-5 h-5 ml-2 inline-block" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}