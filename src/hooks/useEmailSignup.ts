import { useState, useCallback, useEffect } from 'react';

export function useEmailSignup() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = useCallback(() => {
    console.log('Opening email signup form');
    setIsOpen(true);
  }, []);
  
  const handleClose = useCallback(() => {
    console.log('Closing email signup form');
    setIsOpen(false);
  }, []);

  // Debug log when state changes
  useEffect(() => {
    console.log('Email signup form isOpen state changed:', isOpen);
  }, [isOpen]);

  return {
    isOpen,
    handleOpen,
    handleClose,
  };
} 