import { Music2, Heart, Star, ArrowRight } from 'lucide-react';

interface CTASectionProps {
  onOpenAuth: () => void;
}

export default function CTASection({ onOpenAuth }: CTASectionProps) {
  // Check for 'true' or 'TRUE' case-insensitively
  const isSignupDisabled = import.meta.env.VITE_DISABLE_SIGNUP?.toLowerCase() === 'true';
  
  return (
    <section className="relative py-16 sm:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-white/[0.03] border border-white/[0.05] rounded-2xl p-8 sm:p-12 group
                      hover:bg-white/[0.04] hover:border-white/[0.08] transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-tl from-secondary/10 via-transparent to-transparent"></div>
          
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">
              Start Your Musical Journey Today
            </h2>
            <p className="text-base sm:text-lg text-white/70 mb-6 sm:mb-8 max-w-2xl mx-auto group-hover:text-white/80 transition-colors duration-500">
              Create magical moments with your little one through the power of AI-crafted melodies. Your peaceful parenting journey starts here.
            </p>
            <button 
              onClick={onOpenAuth}
              className="relative inline-flex items-center btn-primary text-sm sm:text-base px-5 py-2.5 sm:px-6 sm:py-3 
                        hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              {isSignupDisabled ? 'Join the Waitlist' : 'Create Your First Song'}
              <ArrowRight className="w-5 h-5 ml-2 inline-block" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}