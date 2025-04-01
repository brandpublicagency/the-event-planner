
import React, { useState } from 'react';
import { useMenuState } from '@/hooks/useMenuState';
import { MenuState } from '@/hooks/menuStateTypes';
import { useMenuPlanner } from './hooks/useMenuPlanner';
import { useSaveRegistration } from './hooks/useSaveRegistration';
import { useMenuRefresh } from './hooks/useMenuRefresh';
import { useCustomMenuSync } from './hooks/useCustomMenuSync';
import MenuPlannerLoading from './MenuPlannerLoading';
import MenuPlannerError from './MenuPlannerError';
import MenuPlannerContent from './MenuPlannerContent';
import MenuPlannerActions from './components/MenuPlannerActions';
import MenuSavingOverlay from './components/MenuSavingOverlay';

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
    hasUnsavedChanges,
    handleMenuStateChange,
    handleCanapeSelection,
    saveMenuSelections: saveMenu,
    refreshMenu
  } = useMenuState(eventCode);
  
  // Define component state
  const [isManualSaving, setIsManualSaving] = useState(false);
  
  // Sync custom menu state between parent and this component
  const { 
    handleInternalCustomMenuToggle,
    isInternalUpdate,
    setIsInternalUpdate 
  } = useCustomMenuSync({
    menuState,
    isCustomMenu,
    onCustomMenuToggle,
    handleMenuStateChange
  });
  
  // Set up menu planner with load progress tracking
  const { loadingProgress } = useMenuPlanner(
    eventCode,
    menuState,
    isLoading,
    onMenuStateChange,
    saveMenuSelections,
    saveMenu,
    isInternalUpdate,
    setIsInternalUpdate
  );

  // Register save function with parent component but set autoSaveOnLoad to false
  useSaveRegistration({
    saveMenuSelections,
    saveMenu,
    isInitialized,
    isLoading,
    autoSaveOnLoad: false // Added this option to prevent auto-saving
  });

  // Set up periodic background refreshing without triggering saves
  useMenuRefresh({
    isInitialized,
    isLoading,
    isSaving,
    isManualSaving,
    refreshMenu,
    disableAutoSave: true // Added this option to prevent auto-saving
  });

  // Manual save handler with improved feedback
  const handleManualSave = async () => {
    if (isManualSaving) return;
    
    setIsManualSaving(true);
    try {
      console.log('Manual save initiated');
      await saveMenu();
      // Toast handled in saveMenu function with consistent ID
    } catch (error: any) {
      console.error('Manual save failed:', error);
      // Toast handled in saveMenu function with consistent ID
    } finally {
      setIsManualSaving(false);
    }
  };

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
    <div className="relative">
      <MenuSavingOverlay isVisible={isSaving || isManualSaving} />
      
      <MenuPlannerContent
        menuState={menuState}
        isSaving={isSaving || isManualSaving}
        onMenuStateChange={handleMenuStateChange}
        onCanapeSelection={handleCanapeSelection}
        handleInternalCustomMenuToggle={handleInternalCustomMenuToggle}
      />
      
      <MenuPlannerActions 
        onSave={handleManualSave}
        isSaving={isSaving}
        isManualSaving={isManualSaving}
      />
    </div>
  );
};

export default WeddingMenuPlanner;
