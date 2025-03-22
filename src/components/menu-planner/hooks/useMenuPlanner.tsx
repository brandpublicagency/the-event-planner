
import { useState, useRef, useEffect } from 'react';
import { MenuState } from '@/hooks/menuStateTypes';

export const useMenuPlanner = (
  eventCode: string,
  menuState: MenuState,
  isLoading: boolean,
  onMenuStateChange?: (menuState: MenuState) => void,
  saveMenuSelections?: (saveFn: () => Promise<void>) => void,
  saveMenu?: () => Promise<void>
) => {
  // Flag to prevent feedback loop
  const [isInternalUpdate, setIsInternalUpdate] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const initialLoadComplete = useRef(false);
  const saveRegistered = useRef(false);

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

  // Register save function with parent component - critical for menu saving
  useEffect(() => {
    if (saveMenuSelections && saveMenu && !isLoading && menuState) {
      console.log('Registering save menu function with parent');
      
      // Don't re-register if already done
      if (saveRegistered.current) return;
      
      const wrappedSaveFunction = async () => {
        console.log("Save menu function called");
        try {
          if (!saveMenu) {
            throw new Error("Save menu function is not available");
          }
          
          await saveMenu();
          return Promise.resolve();
        } catch (error: any) {
          console.error('Error saving menu from menu planner:', error);
          throw error; // Re-throw to let parent handle
        }
      };
      
      // Pass the wrapped function up to parent
      saveMenuSelections(wrappedSaveFunction);
      saveRegistered.current = true;
    }
    
    // Mark initial load as complete after first render with data
    if (!initialLoadComplete.current && !isLoading && menuState) {
      initialLoadComplete.current = true;
    }
  }, [saveMenu, saveMenuSelections, isLoading, menuState]);

  // Sync menu state changes back to parent component
  useEffect(() => {
    if (onMenuStateChange && menuState) {
      onMenuStateChange(menuState);
    }
  }, [menuState, onMenuStateChange]);

  // Handle internal changes to the custom menu toggle
  const handleInternalCustomMenuToggle = (value: boolean) => {
    console.log('Handling internal custom menu toggle:', value);
    setIsInternalUpdate(true);
    return value;
  };

  return {
    loadingProgress,
    isInternalUpdate,
    setIsInternalUpdate,
    handleInternalCustomMenuToggle
  };
};
