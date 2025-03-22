
import React from 'react';
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
  
  const {
    loadingProgress,
    isInternalUpdate,
    setIsInternalUpdate,
    handleInternalCustomMenuToggle,
    saveRegistered
  } = useMenuPlanner(
    eventCode,
    menuState,
    isLoading,
    onMenuStateChange,
    saveMenuSelections,
    saveMenu
  );

  // Debug logging for important state
  React.useEffect(() => {
    console.log('WeddingMenuPlanner debug state:', {
      eventCode,
      isInitialized,
      isLoading,
      saveRegistered,
      hasMenuState: !!menuState,
      hasSaveMenuFunction: !!saveMenu,
      hasSaveMenuSelectionsProps: !!saveMenuSelections
    });
  }, [eventCode, isInitialized, isLoading, saveRegistered, menuState, saveMenu, saveMenuSelections]);

  // Sync external isCustomMenu state with menu state - only when prop changes
  React.useEffect(() => {
    if (isCustomMenu !== undefined && isCustomMenu !== menuState.isCustomMenu && !isInternalUpdate) {
      console.log('External custom menu update:', isCustomMenu);
      handleMenuStateChange('isCustomMenu', isCustomMenu);
    }
  }, [isCustomMenu, menuState.isCustomMenu, handleMenuStateChange, isInternalUpdate]);

  // Notify parent of custom menu changes from internal updates
  React.useEffect(() => {
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

  // Verify save function is registered
  React.useEffect(() => {
    if (!saveRegistered && !isLoading && isInitialized && saveMenuSelections && saveMenu) {
      console.log('Save function not registered yet, ensuring registration is attempted');
      // Force a re-registration attempt
      const saveFn = async () => {
        try {
          await saveMenu();
          return Promise.resolve();
        } catch (error: any) {
          console.error('Error in save function:', error);
          throw error;
        }
      };
      
      saveMenuSelections(saveFn);
    }
  }, [saveRegistered, isLoading, isInitialized, saveMenuSelections, saveMenu]);

  // Custom menu toggle handler that marks updates as internal
  const internalCustomMenuToggleHandler = (value: boolean) => {
    return handleInternalCustomMenuToggle(value);
  };

  // Render main content when data is loaded
  return (
    <MenuPlannerContent
      menuState={menuState}
      isSaving={isSaving}
      onMenuStateChange={handleMenuStateChange}
      onCanapeSelection={handleCanapeSelection}
      handleInternalCustomMenuToggle={internalCustomMenuToggleHandler}
    />
  );
};

export default WeddingMenuPlanner;
