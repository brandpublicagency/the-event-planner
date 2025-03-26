
import { useCallback } from 'react';
import { useMenuFetch } from './useMenuFetch';
import { useMenuSave } from './useMenuSave';
import { useMenuUpdater } from './useMenuUpdater';
import { useMenuChangeDetection } from './useMenuChangeDetection';
import { toast } from "sonner";

export const useMenuState = (eventCode: string) => {
  // Use smaller, focused hooks
  const {
    menuState,
    setMenuState,
    error,
    isLoading,
    isInitialized,
    lastSavedState,
    setLastSavedState,
    refreshMenu
  } = useMenuFetch(eventCode);

  const {
    isSaving,
    saveMenuSelections
  } = useMenuSave(eventCode, menuState, isInitialized, setLastSavedState);

  const {
    handleMenuStateChange,
    handleCustomMenuToggle,
    handleCanapeSelection
  } = useMenuUpdater(setMenuState);

  const {
    hasUnsavedChanges
  } = useMenuChangeDetection(eventCode, menuState, lastSavedState);
  
  // Wrapper for save with explicit feedback
  const saveMenu = useCallback(async (): Promise<void> => {
    try {
      console.log('Manually saving menu...');
      await saveMenuSelections();
      
      // Force a refresh after saving to ensure the UI displays the latest data
      setTimeout(() => {
        refreshMenu(true);
      }, 500);
    } catch (error: any) {
      console.error('Failed to save menu:', error);
      // Toast is already shown in saveMenuSelections
    }
  }, [saveMenuSelections, refreshMenu]);

  return {
    menuState,
    error,
    isLoading,
    isSaving,
    isInitialized,
    hasUnsavedChanges,
    handleMenuStateChange,
    handleCustomMenuToggle,
    handleCanapeSelection,
    saveMenuSelections: saveMenu,
    refreshMenu,
  };
};
