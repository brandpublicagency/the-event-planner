
import { useState, useRef } from 'react';
import { MenuState } from '@/hooks/menuStateTypes';

export const useEventMenuState = (eventId: string | undefined) => {
  const [isCustomMenu, setIsCustomMenu] = useState(false);
  const [menuState, setMenuState] = useState<MenuState | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Update setMenuState to also set isInitialized flag
  const updateMenuState = (newState: MenuState) => {
    console.log('Menu state updated:', Object.keys(newState));
    setMenuState(newState);
    setIsInitialized(true);
  };

  return {
    eventId,
    isCustomMenu,
    setIsCustomMenu,
    menuState,
    setMenuState: updateMenuState,
    isInitialized
  };
};
