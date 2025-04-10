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
    <div className="min-h-screen bg-gradient-radial from-background-dark via-background-dark to-black">
      <div className="absolute inset-0 bg-stars bg-cover bg-center opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-secondary/5 to-accent/5"></div>
      
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