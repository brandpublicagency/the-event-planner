
import React, { useEffect, useState, useCallback } from 'react';
import { useMenuState } from '@/hooks/useMenuState';
import { MenuState } from '@/hooks/menuStateTypes';
import { useMenuPlanner } from './hooks/useMenuPlanner';
import MenuPlannerLoading from './MenuPlannerLoading';
import MenuPlannerError from './MenuPlannerError';
import MenuPlannerContent from './MenuPlannerContent';
import { toast } from "sonner";

interface WeddingMenuPlannerProps {
  eventCode: string;
  eventName?: string;
  isCustomMenu?: boolean;
  onCustomMenuToggle?: (checked: boolean) => void;
  onMenuStateChange?: (menuState: MenuState) => void;
  saveMenuSelections?: (saveFn: () => Promise<void>) => void;
}

const WeddingMenuPlanner: React.FC<WeddingMenuPlannerProps> = ({ 
  eventCode, 
  eventName, 
  isCustomMenu, 
  onCustomMenuToggle,
  onMenuStateChange,
  saveMenuSelections
}) => {
  
  const { 
    menuState, 
    error,
    isLoading,
    isSaving,
    isInitialized,
    handleMenuStateChange,
    handleCanapeSelection,
    saveMenuSelections: saveMenu
  } = useMenuState(eventCode);
  
  // Define all React hooks before any conditional logic
  const [isInternalUpdate, setIsInternalUpdate] = useState(false);
  const [saveRegistered, setSaveRegistered] = useState(false);
  const [registerAttempts, setRegisterAttempts] = useState(0);
  
  const {
    loadingProgress,
    handleInternalCustomMenuToggle,
  } = useMenuPlanner(
    eventCode,
    menuState,
    isLoading,
    onMenuStateChange,
    saveMenuSelections,
    saveMenu,
    isInternalUpdate,
    setIsInternalUpdate
  );

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
      
      saveMenuSelections(saveFn);
      setSaveRegistered(true);
      console.log('Save function successfully registered');
      return true;
    } catch (error) {
      console.error('Failed to register save function:', error);
      return false;
    }
  }, [saveMenuSelections, saveMenu, isInitialized]);

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

  // Debug logging for important state
  useEffect(() => {
    console.log('WeddingMenuPlanner component state:', {
      eventCode,
      isInitialized,
      isLoading,
      saveRegistered,
      registerAttempts,
      hasMenuState: !!menuState,
      hasSaveMenuFunction: !!saveMenu,
      hasSaveMenuSelectionsProps: !!saveMenuSelections
    });
  }, [eventCode, isInitialized, isLoading, saveRegistered, menuState, saveMenu, saveMenuSelections, registerAttempts]);

  // Sync external isCustomMenu state with menu state - only when prop changes
  useEffect(() => {
    if (isCustomMenu !== undefined && isCustomMenu !== menuState.isCustomMenu && !isInternalUpdate) {
      console.log('External custom menu update:', isCustomMenu);
      handleMenuStateChange('isCustomMenu', isCustomMenu);
    }
  }, [isCustomMenu, menuState.isCustomMenu, handleMenuStateChange, isInternalUpdate]);

  // Notify parent of custom menu changes from internal updates
  useEffect(() => {
    if (onCustomMenuToggle && isInternalUpdate) {
      console.log('Internal custom menu update:', menuState.isCustomMenu);
      onCustomMenuToggle(menuState.isCustomMenu);
      setIsInternalUpdate(false);
    }
  }, [menuState.isCustomMenu, onCustomMenuToggle, isInternalUpdate, setIsInternalUpdate]);

  // Handle loading state
  if (isLoading) {
    return <MenuPlannerLoading loadingProgress={loadingProgress} />;
  }

  // Handle error state
  if (error) {
    return <MenuPlannerError error={error} />;
  }

  // Render main content when data is loaded
  return (
    <MenuPlannerContent
      menuState={menuState}
      isSaving={isSaving}
      onMenuStateChange={handleMenuStateChange}
      onCanapeSelection={handleCanapeSelection}
      handleInternalCustomMenuToggle={handleInternalCustomMenuToggle}
    />
  );
};

export default WeddingMenuPlanner;
