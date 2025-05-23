import { X, Share } from 'lucide-react';

interface IOSInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function IOSInstallModal({ isOpen, onClose }: IOSInstallModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-[150] flex flex-col items-center justify-start p-4 pt-8 sm:pt-12 overflow-y-auto">
      <div className="bg-background-dark border border-white/10 rounded-2xl shadow-xl max-w-md w-full relative fade-in max-h-[85dvh] sm:max-h-[80dvh] overflow-y-auto p-6 sm:p-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white/60 hover:text-white bg-white/5 rounded-full p-2 transition-all duration-300 hover:rotate-90 hover:bg-white/10 hover:scale-110"
          aria-label="Close instructions"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center border border-white/10 shadow-lg">
            <img src="/logo.png" alt="TuneLoom Logo" className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg"/>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mb-3">Install TuneLoom!</h2>
          <p className="text-white/80 text-sm sm:text-base leading-relaxed px-2">
            Add TuneLoom to your Home Screen for instant one-tap access, a smoother app experience, and offline listening.
          </p>
          
          <p className="text-white/80 text-sm sm:text-base mb-4 font-medium">Here's how:</p>
          
          <ol className="text-left text-sm sm:text-base text-white/80 space-y-4 mb-6 sm:mb-8 pl-2">
            <li className="flex items-center gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary/80 text-black rounded-full flex items-center justify-center font-semibold text-xs">1</span>
              <span>Tap the <Share className="inline-block w-4 h-4 sm:w-5 sm:h-5 mx-0.5 text-blue-400" /> <strong className="text-white">Share</strong> button in browser.</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary/80 text-black rounded-full flex items-center justify-center font-semibold text-xs">2</span>
              <span>Scroll down and tap '<strong className="text-white">Add to Home Screen</strong>'.</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary/80 text-black rounded-full flex items-center justify-center font-semibold text-xs">3</span>
              <span>Tap '<strong className="text-white">Add</strong>' in the top right.</span>
            </li>
          </ol>

          <button
            onClick={onClose}
            className="w-full max-w-xs mx-auto bg-primary text-black font-medium py-2.5 sm:py-3 text-base rounded-xl hover:opacity-90 transition-all duration-300 shadow-lg shadow-primary/25"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
} 