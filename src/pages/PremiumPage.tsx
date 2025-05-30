import React, { useState } from 'react';
import { CheckCircle, Zap, Star, Play, Download, Heart } from 'lucide-react'; // Example icons
import { supabase } from '../lib/supabase'; // <-- Import Supabase client
import { useAuthStore } from '../store/authStore'; // <-- Import auth store

// IMPORTANT: Replace with your actual Stripe Price IDs from your Stripe dashboard
const STRIPE_MONTHLY_PRICE_ID = 'price_1RLCswD7u6T4OuZr4EwTg7Km'; 
const STRIPE_YEARLY_PRICE_ID = 'price_1RLCtYD7u6T4OuZrQ71AUgq9';

const PremiumPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const user = useAuthStore((state) => state.user); // <-- Get user from auth store
  
  // TODO: Fetch actual prices from configuration/backend if dynamic
  const monthlyPrice = 9;
  const yearlyPrice = 90;
  const yearlyMonthlyPrice = (yearlyPrice / 12).toFixed(2);

  const features = [
    { name: 'Unlimited Song Generations', icon: Zap },
    { name: 'Unlimited Song Plays', icon: Play }, // Need to import Play
    { name: 'Access All 6 Themes (incl. Indian & Western)', icon: Star },
    { name: 'Download Your Songs (MP3)', icon: Download }, // Need to import Download
    { name: 'Favorite Your Custom Songs', icon: Heart }, // Need to import Heart
    // Add potential future benefits here
    // { name: 'Early Access to New Features', icon: Sparkles },
    // { name: 'Priority Support', icon: LifeBuoy },
  ];

  const handleUpgradeClick = async (plan: 'monthly' | 'yearly') => {
    if (!user) {
      console.error('No user found');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-stripe-checkout', {
        body: { plan }
      });

      if (error) {
        console.error('Stripe checkout error:', error);
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        console.error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white pt-16 sm:pt-24 pb-12 sm:pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold mb-4 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
            Unlock TuneLoom Premium
          </h1>
          <p className="text-base sm:text-xl text-white/70 max-w-2xl mx-auto">
            Get unlimited access to all features and create endless musical moments for your little one.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-stretch">
          {/* Free Tier Card (Added md:order-last) */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col md:order-last">
            <h2 className="text-2xl font-semibold mb-4 text-white/80">Free Plan</h2>
            <p className="text-4xl font-bold mb-1">$0<span className="text-lg font-medium text-white/60">/month</span></p>
            <p className="text-sm text-white/50 mb-6 min-h-[2.5rem]">Get started and try basic features.</p>
            <ul className="space-y-3 text-sm text-white/70 mb-8 flex-grow">
              <li className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-green-400/50 flex-shrink-0" /> 2 Custom Song Generations (Lifetime)</li>
              <li className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-green-400/50 flex-shrink-0" /> 25 Song Plays / Month</li>
              <li className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-green-400/50 flex-shrink-0" /> 4 Core Music Themes</li>
              <li className="flex items-center gap-3 opacity-50"><CheckCircle className="w-4 h-4 text-white/30 flex-shrink-0" /> Download Songs</li>
              <li className="flex items-center gap-3 opacity-50"><CheckCircle className="w-4 h-4 text-white/30 flex-shrink-0" /> Favorite Songs</li>
            </ul>
            {/* Maybe add a disabled button or link back to dashboard */}
          </div>

          {/* Premium Tier Card (Added order-first) */}
          <div className="order-first bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/50 rounded-2xl p-6 sm:p-8 ring-2 ring-primary/70 shadow-2xl shadow-primary/20 relative flex flex-col">
             <div className="absolute top-0 right-0 bg-gradient-to-r from-primary to-secondary text-black text-xs font-bold px-4 py-1 rounded-bl-lg rounded-tr-xl">
               MOST POPULAR
             </div>
            <h2 className="text-2xl font-semibold mb-4 text-white">Premium Plan</h2>
             {/* Pricing Toggle could go here if offering monthly/yearly */}
            <p className="text-4xl font-bold mb-1">${yearlyPrice}<span className="text-lg font-medium text-white/60">/year</span></p>
            <p className="text-sm text-white/50 mb-6 min-h-[2.5rem]">Just ${yearlyMonthlyPrice}/month, billed annually.</p>
            <ul className="space-y-3 text-sm text-white mb-8 flex-grow">
              {features.map((feature) => (
                <li key={feature.name} className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  {feature.name}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleUpgradeClick('yearly')}
              disabled={isLoading} // <-- Disable button while loading
              className={`w-full bg-gradient-to-r from-primary to-secondary text-black font-bold py-3 px-6 rounded-xl hover:opacity-90 transition-opacity duration-300 shadow-lg shadow-primary/30 active:scale-95 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Processing...' : 'Go Premium (Yearly)'}
            </button>
             {/* Optional: Add Monthly Button */}
             <button
               onClick={() => handleUpgradeClick('monthly')}
               disabled={isLoading} // <-- Disable button while loading
               className={`w-full mt-3 bg-white/10 text-white font-medium py-3 px-6 rounded-xl hover:bg-white/20 transition-colors duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
             >
               {isLoading ? 'Processing...' : `Go Premium (Monthly - $${monthlyPrice})`}
             </button>
          </div>
        </div>

         <div className="text-center mt-12">
           <a href="/" className="text-sm text-white/60 hover:text-primary transition-colors">
             &larr; Back to Dashboard
           </a>
         </div>
      </div>
    </div>
  );
};

// Need to import missing icons used in the features list:
// import { Play, Download, Heart, Sparkles, LifeBuoy } from 'lucide-react'; 

export default PremiumPage; 