
import { useMenuFetch } from './useMenuFetch';
import { useMenuSave } from './useMenuSave';
import { useMenuUpdater } from './useMenuUpdater';
import { useMenuChangeDetection } from './useMenuChangeDetection';

export const useMenuState = (eventCode: string) => {
  // Use smaller, focused hooks
  const {
    menuState,
    setMenuState,
    error,
    isLoading,
    isInitialized,
    lastSavedState,
    setLastSavedState
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
    saveMenuSelections,
  };
};
