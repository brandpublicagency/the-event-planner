
import React, { useEffect, useState } from 'react';
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
  
  const {
    loadingProgress,
    handleInternalCustomMenuToggle,
    saveRegistered
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

  // Debug logging for important state
  useEffect(() => {
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
