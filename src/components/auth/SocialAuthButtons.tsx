import { useState } from 'react';
import { signInWithGoogle } from '../../services/authService';

// Placeholder icons for FB and X - replace with actual icons later
const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg"><path d="M22.676 0H1.324C.593 0 0 .593 0 1.324v21.352C0 23.407.593 24 1.324 24h11.494v-9.294H9.689v-3.621h3.129V8.41c0-3.1 1.893-4.785 4.659-4.785 1.325 0 2.463.099 2.795.142v3.24h-1.918c-1.504 0-1.795.715-1.795 1.763v2.309h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.324V1.324C24 .593 23.407 0 22.676 0z"/></svg>
);
const XIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.847h-7.407l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.153h7.59l5.243 6.931ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
);

export default function SocialAuthButtons() {
  const [showOtherOptions, setShowOtherOptions] = useState(false);

  const baseButtonStyles = "w-full flex items-center justify-center gap-2 bg-white text-black font-medium py-3 rounded-xl shadow hover:bg-gray-100 transition-all duration-200 border border-gray-200";

  return (
    <div className="flex flex-col gap-3 w-full">
      <button
        onClick={signInWithGoogle}
        className={baseButtonStyles}
        aria-label="Continue with Google"
      >
        <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_17_40)">
            <path d="M47.5 24.5C47.5 22.6 47.3 20.8 47 19H24V29H37.1C36.5 32.1 34.5 34.7 31.7 36.4V42H39.3C43.7 38.1 47.5 32.1 47.5 24.5Z" fill="#4285F4"/>
            <path d="M24 48C30.6 48 36.1 45.9 39.3 42L31.7 36.4C29.9 37.6 27.7 38.3 24 38.3C18.7 38.3 14.1 34.7 12.5 29.9H4.7V35.7C7.9 42.1 15.3 48 24 48Z" fill="#34A853"/>
            <path d="M12.5 29.9C12.1 28.7 11.9 27.4 11.9 26C11.9 24.6 12.1 23.3 12.5 22.1V16.3H4.7C3.2 19.1 2.5 22.4 2.5 26C2.5 29.6 3.2 32.9 4.7 35.7L12.5 29.9Z" fill="#FBBC05"/>
            <path d="M24 13.7C27.1 13.7 29.3 14.8 30.7 15.9L39.4 8.2C36.1 5.2 30.6 2 24 2C15.3 2 7.9 7.9 4.7 16.3L12.5 22.1C14.1 17.3 18.7 13.7 24 13.7Z" fill="#EA4335"/>
          </g>
          <defs>
            <clipPath id="clip0_17_40">
              <rect width="48" height="48" fill="white"/>
            </clipPath>
          </defs>
        </svg>
        Continue with Google
      </button>

      {!showOtherOptions && (
        <button
          onClick={() => setShowOtherOptions(true)}
          className={baseButtonStyles}
          aria-label="See other options"
        >
          See other options
        </button>
      )}

      {showOtherOptions && (
        <div className="flex gap-3 w-full">
          <button 
            onClick={() => alert('Facebook Sign-in (not implemented yet)')}
            className={`${baseButtonStyles} flex-1`}
            aria-label="Continue with Facebook"
          >
            <FacebookIcon />
          </button>
          <button 
            onClick={() => alert('X Sign-in (not implemented yet)')} 
            className={`${baseButtonStyles} flex-1`}
            aria-label="Continue with X (formerly Twitter)"
          >
            <XIcon />
          </button>
          {/* Add Apple button here later if needed */}
        </div>
      )}
    </div>
  );
} 