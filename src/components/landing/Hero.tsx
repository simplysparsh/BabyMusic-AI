import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Heart, Baby, Sparkle, MusicNote } from '@phosphor-icons/react';
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

  // Animation variants for mobile-optimized interactions
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const floatingIconVariants = {
    float: {
      y: [-4, 4, -4],
      rotate: [-1, 1, -1],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };
  
  return (
    <section className="relative pt-28 pb-16 overflow-hidden">
      {/* Warmer, more welcoming background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Warm, soft gradient orbs */}
        <motion.div 
          className="absolute top-20 left-1/4 w-56 h-56 rounded-full blur-3xl"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 182, 193, 0.15), rgba(255, 218, 185, 0.12))'
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.4, 0.6, 0.4]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
          className="absolute top-40 right-1/3 w-48 h-48 rounded-full blur-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(173, 216, 230, 0.18), rgba(255, 192, 203, 0.15))'
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        
        <motion.div 
          className="absolute top-96 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-3xl"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 239, 213, 0.12), rgba(255, 182, 193, 0.18))'
          }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.35, 0.55, 0.35]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />
        
        <motion.div 
          className="absolute bottom-32 right-1/4 w-52 h-52 rounded-full blur-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 228, 225, 0.16), rgba(173, 216, 230, 0.14))'
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.4, 0.6, 0.4]
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 6
          }}
        />

        {/* Soft texture overlay */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}></div>

        {/* Gentle warm vignette */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-orange-900/5"></div>
      </div>

      {/* Floating baby-friendly icons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-32 left-12"
          variants={floatingIconVariants}
          animate="float"
        >
          <Heart size={20} weight="duotone" className="text-pink-300/60" />
        </motion.div>
        
        <motion.div
          className="absolute top-48 right-16"
          variants={floatingIconVariants}
          animate="float"
          transition={{ delay: 1 }}
        >
          <MusicNote size={24} weight="duotone" className="text-blue-300/60" />
        </motion.div>
        
        <motion.div
          className="absolute top-80 left-1/4"
          variants={floatingIconVariants}
          animate="float"
          transition={{ delay: 2 }}
        >
          <Sparkle size={16} weight="duotone" className="text-yellow-300/60" />
        </motion.div>
        
        <motion.div
          className="absolute bottom-48 right-12"
          variants={floatingIconVariants}
          animate="float"
          transition={{ delay: 1.5 }}
        >
          <Baby size={22} weight="duotone" className="text-purple-300/60" />
        </motion.div>
        
        <motion.div
          className="absolute top-56 right-1/3"
          variants={floatingIconVariants}
          animate="float"
          transition={{ delay: 3 }}
        >
          <Heart size={14} weight="fill" className="text-pink-400/50" />
        </motion.div>
        
        <motion.div
          className="absolute bottom-64 left-1/3"
          variants={floatingIconVariants}
          animate="float"
          transition={{ delay: 2.5 }}
        >
          <Sparkle size={18} weight="fill" className="text-orange-300/50" />
        </motion.div>
      </div>

      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="text-center">
          {/* Enhanced title with warmer, more welcoming design */}
          <motion.div className="relative mb-6 sm:mb-8" variants={itemVariants}>
            <div className="absolute -inset-6 bg-gradient-to-r from-transparent via-pink-200/8 to-transparent blur-2xl opacity-60 rounded-full"></div>
            <h1 className="font-nunito text-3xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-tight
                         drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] relative">
              The Sound of You Doing
              <span className="block py-2 bg-gradient-to-br from-pink-300 via-orange-200 to-blue-300 bg-clip-text text-transparent
                             drop-shadow-[0_2px_8px_rgba(255,182,193,0.4)]">
                Everything Right
              </span>
            </h1>
          </motion.div>
          
          {/* Enhanced subtitle with better readability */}
          <motion.p 
            className="text-base sm:text-xl text-white/95 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-2 tracking-wide
                     drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
            variants={itemVariants}
          >
            From playtime to bedtime, personalized melodies that build brains — and bonds. Rooted in neuroscience.
          </motion.p>

          {/* Beautiful decorative elements with baby-friendly colors */}
          <motion.div 
            className="flex justify-center items-center gap-3 mb-8"
            variants={itemVariants}
          >
            <motion.div 
              className="w-8 h-px bg-gradient-to-r from-transparent via-pink-300/50 to-transparent"
              animate={{ scaleX: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.div 
              className="w-2 h-2 bg-gradient-to-br from-pink-300 to-orange-300 rounded-full shadow-sm"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div 
              className="w-12 h-px bg-gradient-to-r from-transparent via-blue-200/50 to-transparent"
              animate={{ scaleX: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            />
            <motion.div 
              className="w-1.5 h-1.5 bg-gradient-to-br from-blue-300 to-purple-300 rounded-full shadow-sm"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
            <motion.div 
              className="w-8 h-px bg-gradient-to-r from-transparent via-orange-200/50 to-transparent"
              animate={{ scaleX: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, delay: 2 }}
            />
          </motion.div>
          
          {isSignupDisabled ? (
            success ? (
              <motion.div 
                className="bg-gradient-to-r from-pink-500/10 via-orange-500/10 to-pink-500/10 border border-pink-300/20 rounded-2xl p-6 max-w-md mx-auto mb-6 relative backdrop-blur-sm"
                variants={itemVariants}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.3 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-200/5 via-orange-200/5 to-blue-200/5 rounded-2xl"></div>
                <div className="relative">
                  <div className="flex items-center justify-center mb-3">
                    <Heart size={24} weight="duotone" className="text-pink-400 mr-2" />
                    <Sparkle size={20} weight="fill" className="text-yellow-400" />
                  </div>
                  <p className="text-pink-300 font-medium drop-shadow-sm">Thank you for joining our family!</p>
                  <p className="text-white/80 text-sm mt-1 drop-shadow-sm">We'll notify you when we launch magical melodies.</p>
                </div>
              </motion.div>
            ) : (
              <motion.form 
                onSubmit={handleSubmit} 
                className="max-w-2xl mx-auto mb-6"
                variants={itemVariants}
              >
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <div className="relative flex-1 max-w-md mx-auto sm:mx-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-300/10 via-orange-200/8 to-blue-300/10 blur-xl rounded-2xl opacity-60"></div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email for magical updates"
                      className="w-full px-6 py-4 sm:py-3 rounded-2xl bg-white/20 border border-white/30 text-white
                               focus:outline-none focus:ring-2 focus:ring-pink-300/40 focus:border-pink-300/50
                               placeholder-white/70 backdrop-blur-sm relative z-10
                               shadow-lg shadow-pink-900/10 transition-all duration-300
                               text-center sm:text-left"
                      disabled={isSubmitting}
                    />
                    {error && (
                      <p className="absolute -bottom-6 left-0 text-xs text-red-300 drop-shadow-sm">{error}</p>
                    )}
                  </div>
                  <motion.button 
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary text-sm sm:text-base px-8 py-4 sm:py-3 rounded-2xl
                            flex items-center justify-center gap-2 max-w-xs mx-auto sm:mx-0
                            shadow-lg shadow-pink-500/20 relative z-10
                            bg-gradient-to-r from-pink-400 to-orange-400
                            transition-all duration-150 text-white font-medium transform-gpu"
                    whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div 
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <span>Joining our family...</span>
                      </>
                    ) : (
                      <>
                        <Baby size={20} weight="duotone" />
                        Join the Waitlist
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.form>
            )
          ) : (
            <motion.div 
              className="flex flex-col sm:flex-row justify-center items-center gap-4"
              variants={itemVariants}
            >
              <motion.button 
                onClick={onOpenAuth}
                className="btn-primary text-sm sm:text-base px-8 py-4 sm:py-3 rounded-2xl
                        shadow-lg shadow-pink-500/20 relative z-10 bg-gradient-to-r from-pink-400 to-orange-400
                        transition-all duration-150 text-white font-medium flex items-center gap-3 transform-gpu"
                whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
              >
                <Heart size={20} weight="duotone" />
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <a 
                href="/premium"
                className="text-sm sm:text-base text-white/80 transition-colors duration-300 
                        underline underline-offset-4 drop-shadow-sm relative z-10 flex items-center gap-2"
              >
                <Sparkle size={16} weight="duotone" />
                Premium 
              </a>
            </motion.div>
          )}
        </div>
      </motion.div>
    </section>
  );
}