import { Smartphone } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { useState } from 'react';
import IOSInstallModal from './IOSInstallModal';

interface InstallPWAButtonProps {
  className?: string;
  buttonText?: string;
  showIcon?: boolean;
  onInstallSuccess?: () => void;
  onInstallFailure?: () => void;
  onInstructionsShown?: () => void;
  IconComponent?: React.ElementType;
}

export default function InstallPWAButton({
  className = 'btn-primary text-sm px-4 py-2 flex items-center justify-center gap-2',
  buttonText = 'Install App',
  showIcon = true,
  onInstallSuccess,
  onInstallFailure,
  onInstructionsShown,
  IconComponent = Smartphone,
}: InstallPWAButtonProps) {
  const { canInstall, isInstalled, isIOS, triggerInstallPrompt } = usePWAInstall();
  const [isIOSModalOpen, setIsIOSModalOpen] = useState(false);

  const handleInstallClick = async () => {
    if (isIOS) {
      setIsIOSModalOpen(true);
      if (onInstructionsShown) onInstructionsShown();
    } else if (canInstall) {
      const success = await triggerInstallPrompt();
      if (success) {
        console.log('PWA installation initiated by button click.');
        if (onInstallSuccess) onInstallSuccess();
      } else {
        console.log('PWA installation declined or failed from button click.');
        if (onInstallFailure) onInstallFailure();
      }
    } else {
      console.log('PWA install not available (not iOS, and prompt not ready).');
    }
  };

  if (isInstalled) {
    return null;
  }

  return (
    <>
      <button onClick={handleInstallClick} className={className}>
        {showIcon && IconComponent && <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />}
        {buttonText}
      </button>
      {isIOS && (
        <IOSInstallModal 
          isOpen={isIOSModalOpen} 
          onClose={() => setIsIOSModalOpen(false)} 
        />
      )}
    </>
  );
} 