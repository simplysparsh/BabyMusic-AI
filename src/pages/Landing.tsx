import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import ProblemSolution from '../components/landing/ProblemSolution';
import VideoEvidence from '../components/landing/VideoEvidence';
import ResearchInstitutions from '../components/landing/ResearchInstitutions';
import Benefits from '../components/landing/Benefits';
import CTASection from '../components/landing/CTASection';
import AuthModal from '../components/auth/AuthModal';
import EmailSignupForm from '../components/EmailSignupForm';
import Footer from '../components/Footer';
import { useAuthStore } from '../store/authStore';
import { useAuthModal } from '../hooks/useAuthModal';
import { useEmailSignup } from '../hooks/useEmailSignup';

export default function Landing() {
  const { user: _user } = useAuthStore();
  const { isAuthModalOpen, authMode, handleOpenAuth, handleCloseAuth } = useAuthModal();
  const { isOpen: isEmailSignupOpen, handleOpen: handleOpenEmailSignup, handleClose: handleCloseEmailSignup } = useEmailSignup();
  
  // Check for 'true' or 'TRUE' case-insensitively
  const isSignupDisabled = import.meta.env.VITE_DISABLE_SIGNUP?.toLowerCase() === 'true';
  
  // Create a wrapper function that handles both cases
  const handleAction = () => {
    if (isSignupDisabled) {
      handleOpenEmailSignup();
    } else {
      handleOpenAuth('signup');
    }
  };
  
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Warmer, more welcoming background - Baby and parent-friendly */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-950"></div>
      <div className="fixed inset-0 bg-gradient-to-tr from-rose-900/12 via-pink-900/8 to-orange-900/10"></div>
      <div className="fixed inset-0 bg-gradient-to-bl from-blue-900/8 via-transparent to-purple-900/6"></div>
      <div className="fixed inset-0 bg-gradient-to-t from-amber-900/6 via-transparent to-transparent"></div>
      
      {/* Large floating orbs with warmer, baby-friendly colors */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/6 w-80 h-80 rounded-full blur-3xl animate-pulse"
             style={{ 
               background: 'linear-gradient(135deg, rgba(255, 182, 193, 0.08), rgba(255, 218, 185, 0.06))',
               animationDelay: '0s', 
               animationDuration: '15s' 
             }}></div>
        <div className="absolute top-3/4 right-1/6 w-96 h-96 rounded-full blur-3xl animate-pulse"
             style={{ 
               background: 'linear-gradient(135deg, rgba(173, 216, 230, 0.10), rgba(255, 192, 203, 0.08))',
               animationDelay: '5s', 
               animationDuration: '18s' 
             }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-3xl animate-pulse"
             style={{ 
               background: 'linear-gradient(135deg, rgba(255, 239, 213, 0.06), rgba(255, 228, 225, 0.09))',
               animationDelay: '10s', 
               animationDuration: '20s' 
             }}></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full blur-2xl animate-pulse"
             style={{ 
               background: 'linear-gradient(135deg, rgba(221, 160, 221, 0.08), rgba(255, 182, 193, 0.06))',
               animationDelay: '7s', 
               animationDuration: '16s' 
             }}></div>
        
        {/* Soft, warm texture overlay */}
        <div className="absolute inset-0 opacity-[0.008]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}></div>
        
        {/* Gentle warm vignette effect */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-rose-950/8"></div>
      </div>
      
      <Hero onOpenAuth={handleAction} />
      <ProblemSolution />
      <VideoEvidence />
      <ResearchInstitutions />
      <Features />
      <Benefits />
      <CTASection onOpenAuth={handleAction} />
      <Footer />
      
      {isSignupDisabled ? (
        <EmailSignupForm
          isOpen={isEmailSignupOpen}
          onClose={handleCloseEmailSignup}
        />
      ) : (
        <AuthModal
          isOpen={isAuthModalOpen}
          defaultMode={authMode}
          onClose={handleCloseAuth}
        />
      )}
    </div>
  );
}