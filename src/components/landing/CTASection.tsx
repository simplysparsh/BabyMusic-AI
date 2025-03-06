import { Music2, Heart, Star, ArrowRight } from 'lucide-react';

interface CTASectionProps {
  onOpenAuth: () => void;
}

export default function CTASection({ onOpenAuth }: CTASectionProps) {
  // Check for 'true' or 'TRUE' case-insensitively
  const isSignupDisabled = import.meta.env.VITE_DISABLE_SIGNUP?.toLowerCase() === 'true';
  
  // Handle methodology navigation to ensure scroll to top
  const handleMethodologyClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.history.pushState({}, '', '/methodology');
    window.scrollTo(0, 0);
    
    // Dispatch a custom event so any components listening for route changes can update
    const navigationEvent = new CustomEvent('navigation', { detail: '/methodology' });
    window.dispatchEvent(navigationEvent);
  };
  
  return (
    <section className="relative py-16 sm:py-24 overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-20 w-64 h-64 bg-primary/10 rounded-full filter blur-[80px]"></div>
        <div className="absolute -bottom-40 right-20 w-64 h-64 bg-secondary/10 rounded-full filter blur-[80px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative bg-white/[0.03] border border-white/[0.05] rounded-2xl p-8 sm:p-12 group
                      hover:bg-white/[0.04] hover:border-white/[0.08] transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-tl from-secondary/10 via-transparent to-transparent"></div>
          
          <div className="relative z-10 text-center">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">
              Start Your Musical Journey Today
            </h2>
            <p className="text-base sm:text-lg text-white/70 mb-6 sm:mb-8 max-w-2xl mx-auto group-hover:text-white/80 transition-colors duration-500">
              Create magical moments with your little one through the power of AI-crafted melodies. Your peaceful parenting journey starts here.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={onOpenAuth}
                className="relative inline-flex items-center btn-primary text-sm sm:text-base px-5 py-2.5 sm:px-6 sm:py-3 
                          hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 w-full sm:w-auto"
              >
                {isSignupDisabled ? 'Join the Waitlist' : 'Create Your First Song'}
                <ArrowRight className="w-5 h-5 ml-2 inline-block" />
              </button>
              
              <a 
                href="/methodology" 
                onClick={handleMethodologyClick}
                className="relative inline-flex items-center justify-center text-sm sm:text-base px-5 py-2.5 sm:px-6 sm:py-3
                          border border-white/20 rounded-md text-white/80 hover:text-white hover:border-white/30
                          transition-all duration-300 w-full sm:w-auto"
              >
                View Our Methodology
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}