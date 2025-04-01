
import { useState, useCallback, useEffect } from 'react';
import { MenuState } from '@/hooks/menuStateTypes';

interface UseSaveRegistrationProps {
  saveMenuSelections?: (saveFn: () => Promise<void>) => void;
  saveMenu?: () => Promise<void>;
  isInitialized: boolean;
  isLoading: boolean;
  autoSaveOnLoad?: boolean; // New option to control auto-saving
}

export const useSaveRegistration = ({
  saveMenuSelections,
  saveMenu,
  isInitialized,
  isLoading,
  autoSaveOnLoad = false // Default to false to prevent auto-saving
}: UseSaveRegistrationProps) => {
  const [saveRegistered, setSaveRegistered] = useState(false);
  const [registerAttempts, setRegisterAttempts] = useState(0);
  
  // Register save function with parent - using useCallback for stability
  const registerSaveFunction = useCallback(() => {
    if (!saveMenuSelections || !saveMenu || !isInitialized) {
      console.log('Cannot register save function yet:', {
        hasSaveMenuSelections: !!saveMenuSelections,
        hasSaveMenu: !!saveMenu,
        isInitialized,
      });
      return false;
    }

    try {
      console.log('Registering save function with parent component');
      
      const saveFn = async () => {
        console.log('Save function called from WeddingMenuPlanner');
        try {
          await saveMenu();
          console.log('Save operation completed successfully');
          return Promise.resolve();
        } catch (error) {
          console.error('Error in save operation:', error);
          throw error;
        }
      };
      
      // Register the save function but don't trigger an auto-save
      saveMenuSelections(saveFn);
      setSaveRegistered(true);
      console.log('Save function successfully registered, autoSaveOnLoad:', autoSaveOnLoad);
      return true;
    } catch (error) {
      console.error('Failed to register save function:', error);
      return false;
    }
  }, [saveMenuSelections, saveMenu, isInitialized, autoSaveOnLoad]);

  // Attempt to register save function when dependencies change
  useEffect(() => {
    if (!saveRegistered && isInitialized && !isLoading && saveMenu && saveMenuSelections) {
      console.log(`Attempting to register save function (attempt ${registerAttempts + 1})`);
      const success = registerSaveFunction();
      
      if (success) {
        console.log('Save function registration successful');
      } else {
        console.log('Save function registration failed, will retry');
        setRegisterAttempts(prev => prev + 1);
        
        // Retry with timeout if failed
        if (registerAttempts < 5) {
          const timeout = setTimeout(() => {
            registerSaveFunction();
          }, 500 * (registerAttempts + 1)); // Exponential backoff
          
          return () => clearTimeout(timeout);
        }
      }
    }
  }, [isInitialized, isLoading, saveMenu, saveMenuSelections, saveRegistered, registerAttempts, registerSaveFunction]);

  return {
    saveRegistered,
    registerSaveFunction
  };
};
