
import { useState, useEffect } from 'react';
import { MenuState } from '@/hooks/menuStateTypes';

interface UseCustomMenuSyncProps {
  menuState: MenuState;
  isCustomMenu?: boolean;
  onCustomMenuToggle?: (checked: boolean) => void;
  handleMenuStateChange: (field: keyof MenuState, value: any) => void;
}

export const useCustomMenuSync = ({
  menuState,
  isCustomMenu,
  onCustomMenuToggle,
  handleMenuStateChange
}: UseCustomMenuSyncProps) => {
  const [isInternalUpdate, setIsInternalUpdate] = useState(false);

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
  }, [menuState.isCustomMenu, onCustomMenuToggle, isInternalUpdate]);

  // Function for handling internal toggle changes
  const handleInternalCustomMenuToggle = (value: boolean) => {
    console.log('Handling internal custom menu toggle:', value);
    setIsInternalUpdate(true);
    return value;
  };

  return {
    handleInternalCustomMenuToggle,
    isInternalUpdate,
    setIsInternalUpdate
  };
};
