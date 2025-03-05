import { FormEvent, useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { isValidEmail } from '../utils/validation';

interface EmailSignupFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EmailSignupForm({ isOpen, onClose }: EmailSignupFormProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);
    
    const trimmedEmail = email.trim();
    
    if (!trimmedEmail) {
      setError('Please enter your email');
      setIsLoading(false);
      return;
    }
    
    if (!isValidEmail(trimmedEmail)) {
      setError('Please enter a valid email');
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await fetch('/.netlify/functions/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail })
      });

      let data;
      try {
        const responseText = await response.text();
        
        try {
          data = JSON.parse(responseText);
        } catch (jsonError) {
          console.error('Error parsing JSON response:', jsonError);
          throw new Error('Unexpected response from server');
        }
      } catch (jsonError) {
        console.error('Error parsing JSON response:', jsonError);
        throw new Error('Unexpected response from server');
      }

      if (!response.ok) {
        throw new Error(data?.error || 'Something went wrong');
      }

      setSuccess(true);
      if (data?.message) {
        setMessage(data.message);
      } else {
        setMessage('Successfully added to waitlist! Please check your email to confirm your subscription.');
      }
    } catch (err) {
      console.error('Form submission error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-lg z-50 flex items-center justify-center p-4">
      <div className="card w-full max-w-md relative border-white/[0.05] fade-in overflow-hidden">
        {/* Animated background gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-secondary/20 via-transparent to-transparent animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* Floating particles */}
        <div className="absolute top-12 left-12 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-12 right-12 w-20 h-20 bg-secondary/10 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative p-8">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-white/60 hover:text-white bg-white/5 rounded-full p-2
                     transition-all duration-300 hover:rotate-90 hover:bg-white/10 hover:scale-110"
          >
            <X className="w-5 h-5" />
          </button>
          
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary via-white to-secondary 
                       bg-clip-text text-transparent mb-2">
            Stay Tuned for Launch
          </h2>
          <p className="text-white/60 text-sm mb-8">
            Sign up to be the first to know when we launch
          </p>
          
          {success ? (
            <div className="text-center">
              <p className="text-primary text-xl mb-4">Thanks for signing up!</p>
              <p className="text-white/60 text-sm">
                {message || "We'll let you know when we launch"}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Email
                  <span className="text-primary ml-1">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input w-full bg-white/[0.07] focus:bg-white/[0.09] transition-colors"
                  required
                  placeholder="Enter your email"
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary to-secondary text-black font-medium
                         py-3 rounded-xl hover:opacity-90 transition-all duration-300
                         shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40
                         hover:scale-[1.02] active:scale-[0.98]
                         disabled:opacity-50 disabled:cursor-not-allowed
                         disabled:hover:scale-100 disabled:hover:shadow-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-black/20 border-t-black/80 rounded-full animate-spin"></div>
                    <span>Signing Up...</span>
                  </div>
                ) : (
                  'Join Waitlist'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
} 