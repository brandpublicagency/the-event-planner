
import { useEffect } from 'react';
import { MenuState } from '@/hooks/menuStateTypes';

export const useMenuDebugLogger = (
  eventId: string | undefined, 
  isInitialized: boolean,
  menuState: MenuState | null,
  saveMenuFunction: (() => Promise<void>) | null,
  saveFunctionRegistered: React.MutableRefObject<boolean>,
  saveAttempts: React.MutableRefObject<number>
) => {
  // Log state changes for debugging
  useEffect(() => {
    console.log('useEventMenu state updated:', {
      eventId,
      isInitialized,
      hasMenuState: !!menuState,
      hasSaveFunction: !!saveMenuFunction,
      saveFunctionRegistered: saveFunctionRegistered.current,
      saveAttempts: saveAttempts.current
    });
  }, [eventId, menuState, saveMenuFunction, isInitialized, saveFunctionRegistered, saveAttempts]);
};
