
import { useRef, useEffect } from 'react';
import { useEventMenuState } from './event-menu/useEventMenuState';
import { useEventMenuSave } from './event-menu/useEventMenuSave';
import { useMenuDebugLogger } from './event-menu/useMenuDebugLogger';
import { MenuState } from './menuStateTypes';

export const useEventMenu = (eventId: string | undefined) => {
  // Use the smaller, focused hooks
  const {
    isCustomMenu,
    setIsCustomMenu,
    menuState,
    setMenuState,
    isInitialized
  } = useEventMenuState(eventId);

  const saveAttempts = useRef(0);
  const saveFunctionRegistered = useRef(false);
  
  const {
    isSaving,
    saveMenuFunction,
    setSaveMenuFunction,
    handleSaveMenu
  } = useEventMenuSave(eventId, isInitialized);

  // Effect to update registration status
  useEffect(() => {
    saveFunctionRegistered.current = !!saveMenuFunction;
  }, [saveMenuFunction]);

  // Setup debug logging
  useMenuDebugLogger(
    eventId, 
    isInitialized, 
    menuState, 
    saveMenuFunction, 
    saveFunctionRegistered,
    saveAttempts
  );

  return {
    isCustomMenu,
    setIsCustomMenu,
    isSaving,
    saveMenuFunction,
    setSaveMenuFunction,
    menuState,
    setMenuState,
    isInitialized,
    handleSaveMenu
  };
};
