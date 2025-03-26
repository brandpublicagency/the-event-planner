
import { useState, useRef, useEffect } from 'react';
import { MenuState } from '@/hooks/menuStateTypes';
import { toast } from "sonner";

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
  
  // Refs for tracking state
  const initialLoadComplete = useRef(false);
  const saveRegistered = useRef(false);
  const lastRegistrationAttempt = useRef(0);
  const registrationTimeoutId = useRef<number | null>(null);

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

  // Cleanup registration timeout on unmount
  useEffect(() => {
    return () => {
      if (registrationTimeoutId.current) {
        clearTimeout(registrationTimeoutId.current);
      }
    };
  }, []);

  // Register save function with parent component - critical for menu saving
  useEffect(() => {
    // Clear any pending registration timeouts when dependencies change
    if (registrationTimeoutId.current) {
      clearTimeout(registrationTimeoutId.current);
      registrationTimeoutId.current = null;
    }

    // Only proceed if all required parts are available
    if (!saveMenuSelections || !saveMenu || isLoading || !menuState) {
      if (!saveMenuSelections) console.log('SaveMenuSelections function not available yet');
      if (!saveMenu) console.log('SaveMenu function not available yet');
      if (isLoading) console.log('Still loading, not registering save function');
      if (!menuState) console.log('Menu state not available yet');
      return;
    }
    
    // Only re-register if we haven't already or if it's been some time since last attempt
    const now = Date.now();
    if (saveRegistered.current && (now - lastRegistrationAttempt.current < 5000)) {
      return;
    }
    
    console.log('Preparing to register save menu function with parent');
    
    // Delay the registration slightly to ensure all components are ready
    registrationTimeoutId.current = window.setTimeout(() => {
      console.log('Registering save menu function with parent');
      lastRegistrationAttempt.current = Date.now();
      
      const wrappedSaveFunction = async () => {
        console.log("Save menu function called");
        try {
          if (!saveMenu) {
            const error = new Error("Save menu function is not available");
            console.error(error);
            toast.error("Failed to save menu: Save function not available");
            throw error;
          }
          
          await saveMenu();
          console.log("Menu saved successfully via wrapped function");
          return Promise.resolve();
        } catch (error: any) {
          console.error('Error saving menu from menu planner:', error);
          toast.error(`Failed to save menu: ${error.message || 'Unknown error'}`);
          throw error; // Re-throw to let parent handle
        }
      };
      
      // Pass the wrapped function up to parent
      saveMenuSelections(wrappedSaveFunction);
      saveRegistered.current = true;
      console.log('Save function successfully registered');
      
      // Mark initial load as complete after first render with data
      if (!initialLoadComplete.current && !isLoading && menuState) {
        initialLoadComplete.current = true;
        console.log('Initial load complete, menu data ready');
      }
    }, 300); // Small delay to ensure components are ready
    
  }, [saveMenu, saveMenuSelections, isLoading, menuState]);

  // Sync menu state changes back to parent component
  useEffect(() => {
    if (onMenuStateChange && menuState && initialLoadComplete.current) {
      onMenuStateChange(menuState);
    }
  }, [menuState, onMenuStateChange]);

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
    handleInternalCustomMenuToggle,
    saveRegistered: saveRegistered.current
  };
};
