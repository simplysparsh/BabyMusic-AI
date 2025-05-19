import { signInWithGoogle } from '../../services/authService';

interface SocialAuthButtonsProps {
  mode?: 'signin' | 'signup';
}

export default function SocialAuthButtons({ mode = 'signin' }: SocialAuthButtonsProps) {
  const googleButtonStyles = "w-full flex items-center justify-center gap-2 bg-white text-black font-medium py-2 rounded-xl shadow hover:bg-gray-100 transition-all duration-200 border border-gray-200";
  
  const buttonText = mode === 'signup' ? 'Signup with Google' : 'Continue with Google';

  const handleGoogleClick = () => {
    signInWithGoogle(mode === 'signup');
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <button
        onClick={handleGoogleClick}
        className={googleButtonStyles}
        aria-label={buttonText}
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
        {buttonText}
      </button>
    </div>
  );
} 