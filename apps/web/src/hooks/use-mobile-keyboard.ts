import { useEffect, useCallback } from 'react';

export function useMobileKeyboard() {
  // Handle mobile keyboard appearance
  const showKeyboard = useCallback((element: HTMLElement) => {
    if (typeof window !== 'undefined') {
      // Focus the element to trigger keyboard
      element.focus();
      
      // For iOS, ensure the element is visible
      if (element.scrollIntoView) {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
      
      // For Android, try to show virtual keyboard
      if ('virtualKeyboard' in navigator) {
        (navigator as any).virtualKeyboard.show();
      }
    }
  }, []);

  // Handle mobile keyboard hiding
  const hideKeyboard = useCallback(() => {
    if (typeof window !== 'undefined') {
      // Blur any focused element
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      
      // For Android, try to hide virtual keyboard
      if ('virtualKeyboard' in navigator) {
        (navigator as any).virtualKeyboard.hide();
      }
    }
  }, []);

  // Prevent zoom on input focus (iOS)
  useEffect(() => {
    const preventZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchstart', preventZoom, { passive: false });
    
    return () => {
      document.removeEventListener('touchstart', preventZoom);
    };
  }, []);

  return {
    showKeyboard,
    hideKeyboard,
  };
} 