
import { useState, useEffect } from 'react';
import { MenuState } from '@/hooks/menuStateTypes';

export const useMenuPlanner = (
  eventCode: string,
  menuState: MenuState,
  isLoading: boolean,
  onMenuStateChange?: (menuState: MenuState) => void,
  saveMenuSelections?: (saveFn: () => Promise<void>) => void,
  saveMenu?: () => Promise<void>,
  isInternalUpdate?: boolean,
  setIsInternalUpdate?: (value: boolean) => void
) => {
  // Loading progress state
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  // Simulate progress when loading
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          const newProgress = prev + (100 - prev) * 0.1;
          return Math.min(newProgress, 95); // Cap at 95% until actual completion
        });
      }, 300);
      
      return () => {
        clearInterval(interval);
        if (!isLoading) {
          setLoadingProgress(100);
          // Reset after animation completes
          setTimeout(() => setLoadingProgress(0), 500);
        }
      };
    }
  }, [isLoading]);

  // Sync menu state changes back to parent component when data is ready
  useEffect(() => {
    if (onMenuStateChange && menuState && !isLoading) {
      console.log('Propagating menu state to parent component');
      onMenuStateChange(menuState);
    }
  }, [menuState, onMenuStateChange, isLoading]);

  // Handle internal changes to the custom menu toggle
  const handleInternalCustomMenuToggle = (value: boolean) => {
    console.log('Handling internal custom menu toggle:', value);
    if (setIsInternalUpdate) {
      setIsInternalUpdate(true);
    }
    return value;
  };

  return {
    loadingProgress,
    handleInternalCustomMenuToggle
  };
};
