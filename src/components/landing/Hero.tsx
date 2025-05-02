import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { isValidEmail } from '../../utils/validation';

interface HeroProps {
  onOpenAuth: () => void;
}

export default function Hero({ onOpenAuth }: HeroProps) {
  
  // State for the inline email form
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Check for 'true' or 'TRUE' case-insensitively
  const isSignupDisabled = import.meta.env.VITE_DISABLE_SIGNUP?.toLowerCase() === 'true';
  
  // Handle direct submission of email form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }
    
    if (!isValidEmail(email.trim())) {
      setError('Please enter a valid email');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In development mode, log the email for tracking
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log(`Waitlist signup email: ${email.trim()}`);
      }
      
      let apiSuccess = false;
      let responseData = null;
      
      try {
        console.log('Attempting to call Netlify function at /.netlify/functions/waitlist');
        const response = await fetch('/.netlify/functions/waitlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim() })
        });
        
        const responseText = await response.text();
        
        if (responseText) {
          try {
            responseData = JSON.parse(responseText);
            console.log('Netlify function response:', responseData);
          } catch {
            console.warn('Non-JSON response received:', responseText.slice(0, 100));
          }
        }
        
        if (response.ok) {
          apiSuccess = true;
          setSuccess(true);
        } else if (responseData?.error) {
          throw new Error(responseData.error);
        }
      } catch (apiError) {
        console.warn('API request failed:', apiError);
        
        // In development mode, show success even if API fails
        if ((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && !apiSuccess) {
          console.log('🚨 Development mode - Using mock Beehiiv integration as fallback');
          console.log('📨 Would have sent email to Beehiiv:', email.trim());
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500));
          setSuccess(true);
        } else {
          throw apiError;
        }
      }
    } catch (err) {
      console.error('Form submission error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };
  
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
          
          {isSignupDisabled ? (
            success ? (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 max-w-md mx-auto mb-6">
                <p className="text-primary font-medium">Thank you for joining our waitlist!</p>
                <p className="text-white/70 text-sm mt-1">We'll notify you when we launch.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-6">
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <div className="relative flex-1 max-w-md mx-auto sm:mx-0">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 sm:py-2.5 rounded-md bg-white/25 border border-white/40 text-white
                               focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50
                               placeholder-white/70"
                      disabled={isSubmitting}
                    />
                    {error && (
                      <p className="absolute -bottom-6 left-0 text-xs text-red-400">{error}</p>
                    )}
                  </div>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary text-sm sm:text-base px-5 py-2.5 sm:px-6 sm:py-3 
                            hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 whitespace-nowrap
                            flex items-center justify-center gap-2 max-w-xs mx-auto sm:mx-0"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black/20 border-t-black/80 rounded-full animate-spin"></div>
                        <span>Joining...</span>
                      </>
                    ) : (
                      <>
                        Join the Waitlist
                        <ArrowRight className="w-5 h-5 inline-block" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )
          ) : (
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <button 
                onClick={onOpenAuth}
                className="btn-primary text-sm sm:text-base px-5 py-2.5 sm:px-6 sm:py-3 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 whitespace-nowrap"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2 inline-block" />
              </button>
              <a 
                href="/premium"
                className="text-sm sm:text-base text-white/70 hover:text-primary transition-colors duration-300 underline underline-offset-4"
              >
                Premium 
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}